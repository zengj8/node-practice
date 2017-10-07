const fs = require('fs');
const path = require('path');
const fse = require('fs-extra')

/**
 * 访问文件信息
 */

// 访问文件信息
function fileInfo(filename) {
  fs.stat(filename, function (err, stats) {
    console.log("fs.Stats对象属性：\n");
    console.log(stats, '\n');
    console.log("fs.Stats对象方法：\n");

    console.log("isFile: " + stats.isFile());
    console.log("isDirectory: " + stats.isDirectory());
    console.log("isBlockDevice: " + stats.isBlockDevice());
    console.log("isCharacterDevice: " + stats.isCharacterDevice());
    console.log("isFIFO: " + stats.isFIFO());
    console.log("isSocket: " + stats.isSocket());
  });
}

// fileInfo('3-1.js');

/**
 * 递归创建目录
 */

// 递归创建目录 异步方法
function mkdirs(dirname, callback) {
  fs.exists(dirname, function (exists) {
    if (exists) {
      callback();
    } else {
      mkdirs(path.dirname(dirname), function () {
        fs.mkdir(dirname, callback);
      });
    }
  });
}

// 递归创建目录 同步方法
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

function makeDirections(dir) {
  fs.exists(dir, (exists) => {
    if (!exists) {
      mkdirs(dir);
      // mkdirsSync(dir);
    }
  });

  // 直接用fs-extra递归创建目录
  // fse.mkdirs(dir);
}

// makeDirections('./3-2/中文/3-1/333');

/**
 * 移动文件或目录，可用fs-extra.move()
 */

// 将src移动到（重命名为）dist，所以如果dist存在，就会抛出异常
function moveFile(src, dist) {
  // 先递归创建前置目录，可用同步或异步方法实现

  // mkdirs(path.dirname(dist), function () {
  //   fs.rename(src, dist, function (err) {
  //     if (err) throw err;
  //     fs.stat(dist, function (err, stats) {
  //       if (err) throw err;
  //       console.log('stats: ' + JSON.stringify(stats));
  //     });
  //   });
  // });

  mkdirsSync(path.dirname(dist));
  fs.rename(src, dist, function (err) {
    if (err) throw err;
    fs.stat(dist, function (err, stats) {
      if (err) throw err;
      console.log('stats: ' + JSON.stringify(stats));
    });
  });
}

// moveFile('./333/111', './222/111');

/**
 * 拷贝文件或目录，可用fs-extra.copy()
 */

// 文件复制：通过fs.readFile()方法读取文件到内存中，再通过fs.writeFile()方法写入到一个新文件
function copyFile(src, dist) {
  fs.writeFileSync(dist, fs.readFileSync(src));
}

// 大文件复制：
// fs.readFile()方法（fs.readFileSync()为其同步版本的方法）会整体将文件读取到内存中。
// 当文件较大时，会对系统资源造成一定压力，这时可以通过文件流来进行操作。
function copyHugeFile(src, dist) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dist));
}

// 目录复制
function copyDir(src, dist, callback) {
  fs.access(dist, function(err){
    if(err){
      // 目录不存在时递归创建目录
      // fs.mkdirSync(dist);
      mkdirsSync(dist);
    }
    _copy(null, src, dist);
  });

  function _copy(err, src, dist) {
    if (err) {
      callback(err);
    } else {
      fs.readdir(src, function(err, paths) {
        if (err) {
          callback(err);
        } else {
          paths.forEach(function(path) {
            var _src = src + '/' + path;
            var _dist = dist + '/' + path;
            fs.stat(_src, function(err, stat) {
              if (err) {
                callback(err);
              } else {
                // 判断是文件还是目录
                if (stat.isFile()) {
                  fs.writeFileSync(_dist, fs.readFileSync(_src));
                } else if (stat.isDirectory()) {
                  // 当是目录时，递归复制
                  copyDir(_src, _dist, callback)
                }
              }
            });
          });
        }
      });
    }
  }
}

// copyDir('./111', './222/333');
