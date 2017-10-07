require('./init.js')

const fs = require('fs');
const paths = require('path');
const http = require('http');
const unzip = require('unzip');
const querystring = require('querystring');
const formidable = require('formidable');
const urls = require('url');

// 文件重命名，如果文件存在则在文件名末尾加-N
function rename(oldPath, name) {
  let dirname = paths.dirname(oldPath);
  let newPath = paths.join(dirname, name);
  if (fs.existsSync(newPath)) {
    let extname = paths.extname(name);
    let basename = paths.basename(name, extname);

    let i = 0;
    while (fs.existsSync(paths.join(dirname, `${basename}-${i}${extname}`)))
      i ++;
    newPath = paths.join(dirname, `${basename}-${i}${extname}`);
  }
  fs.renameSync(oldPath, newPath);
}

// 如果为文件则下载文件，为目录则下载json格式的目录树信息
function downloadFile(res, path) {
  // 判断文件是否在practice-http/server/download目录下
  if (path.indexOf('practice-http\\server\\download')) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Access denied!</h1>');
    return;
  }

  let stat = fs.lstatSync(path);
  if (stat.isFile()) {
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${paths.basename(path)}`,
      'Content-Length': stat.size
    });
    fs.createReadStream(path).pipe(res);
  } else {
    let result = {};
    getDirTree(path, result);
    res.writeHead(200, { 'Content-Type': 'text/json' });
    res.end(JSON.stringify(result).replace(/practice-http\\\\server\\\\download\\{0,2}/g, ''));
  }
}

// 获取目录树
function getDirTree(path, result) {
  let stat = fs.lstatSync(path);
  result.root = path;
  result.isDir = stat.isDirectory();
  result.sub = [];

  if (result.isDir) {
    let files = fs.readdirSync(path);
    for (let i in files) {
      result.sub[i] = {};
      getDirTree(paths.join(path, files[i]), result.sub[i]);
    }
  }
}

// 文件下载
function download(req, res) {
  if (req.method.toLowerCase() === 'get') {
    if (req.parameters.file === undefined) {
      res.writeHead(200, { 'Content-Type': 'text/html '});
      res.end('<h1>Invalid parameters!</h1>');
      return;
    }
    let downloadPath = paths.join('practice-http/server/download', req.parameters.file);
    if (!fs.existsSync(downloadPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found!</h1>');
      return;
    }
    downloadFile(res, downloadPath);
  }
}

// 文件上传
function upload(req, res) {
  if (req.method.toLowerCase() === 'post') {
    let uploadDir = 'practice-http/server/upload';
    if (req.parameters.dir !== undefined)
      uploadDir = paths.join(uploadDir, req.parameters.dir);
    mkdirsSync(uploadDir);
    let form = new formidable.IncomingForm({
      uploadDir: uploadDir,   // 上传目录
      keepExtensions: true
    });
    form.parse(req, (err, fields, files) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      if (err) {
        console.log(err.stack);
        res.end('Upload unsuccessfully!');
        return;
      }
      if (!req.parameters.zip) {
        rename(files.upload.path, files.upload.name);
      } else {
        let basename = paths.basename(files.upload.name, paths.extname(files.upload.name));
        let readStream = fs.createReadStream(files.upload.path);
        readStream.on('close', () => {
          fs.unlinkSync(files.upload.path);
        });
        readStream.pipe(unzip.Extract({ path: `${uploadDir}/${basename}`}));
      }
      res.end('Upload successfully!');
    });
  }
}

let urlMap = { "/download": download, "/upload": upload };

function createNewHttpServer(port) {
  http.createServer((req, res) => {
    let headers = req.headers;
    let remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||
        req.socket.remoteAddress || req.connection.socket.remoteAddress;
    let ip = remoteAddress.substr(remoteAddress.lastIndexOf(':') + 1);
    let url = `http://${headers['host']}${req.url}`;
    if (req.url.indexOf('?') === -1) {
      req.parameters = {};
    } else {
      req.parameters = querystring.parse(req.url.substr(req.url.indexOf('?') + 1));
    }
    console.log(`${new Date()}: ${ip} ${headers['user-agent']} ${url} ${req.method}: ${JSON.stringify(req.parameters)}`);

    req.on('data', (data) => {
      console.log(data.toString());
    })

    // 路由控制
    let routePath = urls.parse(req.url).pathname;
    console.log('routePath', routePath, 'req.url', req.url);
    let routeFunc = urlMap[routePath];
    if (routeFunc)
      routeFunc(req, res);
  }).listen(port);
}

createNewHttpServer(7000);

// 递归创建目录
function mkdirsSync(dir) {
  if (!fs.existsSync(dir)) {
    mkdirsSync(paths.dirname(dir));
    fs.mkdirSync(dir);
  }
}
