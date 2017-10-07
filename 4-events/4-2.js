let EventEmitter = require('events').EventEmitter;
let eventEmitter = new EventEmitter();
let fs = require('fs');
let path = require('path');

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

eventEmitter.addListener('log-write', (_path, content) => {
  let dirname = path.dirname(_path);
  if (!fs.existsSync(dirname)) {
    fs.mkdirsSync(dirname);
  }
  fs.appendFile(_path, `${content}\n`, (err) => {
    if (err) throw err;
    console.log("追加内容完成");
  });
});

eventEmitter.on('log-error', (error) => {
  eventEmitter.emit('log-write', "./fs-error.log", error.message);
  console.log("追加错误完成");
});
eventEmitter.emit('log-error', new Error("some error"));
