const fs = require('fs');
const http = require('http');
const urls = require('url');
const paths = require('path');
const archiver = require('archiver');

// 上传单个文件到服务器指定目录
function uploadOneFile(path, url, dir, useZip) {
  useZip = useZip || false;
  dir = dir || '/';
  let boundaryKey = Date.now();
  let urlObj = urls.parse(url);console.log(urlObj);

  let options = {
    host: urlObj.hostname,
    port: urlObj.port === null ? 80 : urlObj.port,
    method: "POST",
    path: useZip ? `/upload?dir=${dir}&zip=1` : `/upload?dir=${dir}`,
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundaryKey}`,
      "Connection": `keep-alive`
    }
  };

  let req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`服务器响应: ${chunk}`);
    });
    res.on('end', () => {
      if (useZip) {
        // 删除文件
        fs.unlinkSync(path);
      }
    });
  });
  req.on('error', (e) => {
    console.log(`请求错误: ${e.message}`);
  });

  // 写入数据
  req.write(`--${boundaryKey}\r\nContent-Disposition: form-data; name="upload"; ` +
    `filename="${paths.basename(path)}"\r\nContent-Type: application/octet-stream\r\n\r\n`);
  let fileStream = fs.createReadStream(path);
  fileStream.pipe(req, { end: false });
  fileStream.on('end', () => {
    req.end(`\r\n--${boundaryKey}--`);
  });
}

// 上传文件或文件夹
function uploadFile(path, url, useZip, dir, start) {
  useZip = useZip || false;
  dir = dir || '/';

  // 路径不存在直接返回
  if (!fs.existsSync(path)) {
    console.log('The path is not existed!');
    return;
  }

  // 路径为文件直接调用uploadOneFile函数
  if (fs.lstatSync(path).isFile()) {
    uploadOneFile(path, url, dir);
    return;
  }

  if (useZip) {
    let zipPath = `${paths.basename(path)}.zip`;
    archiveDirToZip(path, zipPath, () => {
      uploadOneFile(zipPath, url, dir, true);
    });
    return;
  }

  // 设置上传目录根路径位置
  if (start === -1)
    start = path.lastIndexOf(paths.basename(path));

  // 递归遍历目录并上传文件
  fs.readdir(path, (err, files) => {
    for (let i in files)
      uploadFile(paths.join(path, files[i]), url, false, path.substr(start), start);
  });
}

// 压缩文件夹
function archiveDirToZip(dir, zipPath, callback) {
  let output = fs.createWriteStream(zipPath);
  let archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    callback();
  });

  archive.pipe(output);
  archive.directory(dir, '');
  archive.finalize();
}

// 递归创建目录
function mkdirsSync(dir) {
  if (!fs.existsSync(dir)) {
    mkdirsSync(paths.dirname(dir));
    fs.mkdirSync(dir);
  }
}

// 下载文件或文件夹
function downloadFile(path, url) {
  let urlObj = urls.parse(url);

  let options = {
    hostname: urlObj.hostname,
    port: urlObj.port === null ? 80 : urlObj.port,
    method: "GET",
    path: `/download?file=${path}`,
    headers: { "cache-control": "no-cache" }
  };

  let req = http.request(options, (res) => {
    let chunks = [];

    res.on('data', (chunk) => {
      chunks.push(chunk);
    });

    res.on('end', () => {
      let body = Buffer.concat(chunks);
      let bodyMsg = body.toString();
      let contentType = res.headers['content-type'];

      if (contentType === 'text/json') {  // 返回json格式说明是目录
        downloadDirectory(url, JSON.parse(bodyMsg));
      } else if (contentType === 'text/html') {   // 返回html格式说明是出错信息
        console.log(bodyMsg);
      } else if (contentType === 'application/octet-stream') {
        let savePath = paths.join('practice-http/client/download', path);
        mkdirsSync(paths.dirname(savePath));
        fs.writeFile(savePath, body, (err) => {
          if (err)
            throw err;
          console.log(savePath);
        });
      }
    });
  });

  req.end();
}

// 下载文件夹
function downloadDirectory(url, data) {
  if (data.isDir) {
    let realPath = paths.join('practice-http/client/download', data.root);
    mkdirsSync(realPath);
    for (let i in data.sub) {
      downloadDirectory(url, data.sub[i]);
    }
  } else {
    downloadFile(data.root, url);
  }
}

// uploadFile('./xx', 'http://127.0.0.1:7000', true);
// downloadFile('./xx', 'http://127.0.0.1:7000');