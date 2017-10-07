let EventEmitter = require('events').EventEmitter;
let fs = require('fs');
let path = require('path');
let eventEmitter = new EventEmitter();

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

function append(_path, content) {
  setTimeout(() => {
    fs.appendFile(_path, content, () => {
      console.log("内容添加完成");
    });
  }, 2000);
}

eventEmitter.addListener('log-write', (_path, content) => {
  filename = path.basename(_path);
  var dirname = path.dirname(_path);
  fs.exists(dirname, function (exists) {
    if (exists) {
      append(_path, content);
    } else {
      mkdirs(dirname, append(_path, content));
    }
  });
});
eventEmitter.emit('log-write', "fs-write.log", "append");