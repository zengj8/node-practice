const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

process.on('message', (message) => {
  let command = message.trim().split(/\s+/);
  switch (command[0]) {
    case '-version':
    case '-v':
      if (command.length > 1) {
        console.log('-version命令没有参数');
      } else {
        console.log(process.version);
      }
      break;
    case '-help':
    case '-h':
      if (command.length > 1) {
        console.log('-help命令没有参数');
      } else {
        console.log("create\创建一个目录或文件" + "\n"
          + "copy\\将sourcefile复制到targetdir目录下" + "\n"
          + "-version或者-v打印一个版本号" + "\n"
          + "-help或者-h打印帮助说明");
      }
      break;
    case 'create':
      if (command.length != 2) {
        console.log('create命令只能有一个参数');
      } else {
        create(command[1]);
      }
      break;
    case 'copy':
      if (command.length != 3) {
        console.log('copy命令只能有两个参数');
      } else {
        copy(message);
      }
      break;
  }
});

// exec执行系统cmd命令
function callCmd(command) {
  exec(command, (err, stdout, stderr) => {
    if (err)
      throw err;
  });
}

function create(filename) {
  // 没有扩展名则认为是目录
  if (!path.extname(filename)) {
    callCmd(`mkdir ${filename}`);
  } else {
    callCmd(`type nul>${filename}`);
  }
}

// 或使用child_process模块实现文件复制
// child_process.spawn('cp', ['-r', src, dist]);

// 注意Windows下目录表示为 \
function copy(line) {
  callCmd(line);
}
