require('./init.js');

const fs = require('fs');
const async = require('async');
const readline = require('readline');

let data = [new Array(), new Array(), new Array()];
let lines = new Array();

// async的callback第一个参数是error
async.series([
  // 读取source.txt内容
  (callback) => {
    let sourceStream = fs.createReadStream('practice-async/source.txt');
    let rl = readline.createInterface({ input: sourceStream });
    let num = 0;

    rl.on('line', (line) => {
      data[(num ++) % 3].push(line);
    });
    rl.on('close', () => {
      callback(null, "读取source.txt内容完毕");
    });
  },

  // 将data内容写入三个子文件
  (callback) => {
    async.parallel([
      saveFile(0), saveFile(1), saveFile(2)
    ], (err, results) => {
      let str = '';
      for (let i in results) {
        str = str + results[i] + '\n';
      }
      callback(null, str + "写入子文件完毕");
    });
  },

  // 同时读取三个子文件的内容
  (callback) => {
    async.parallel([
      readFile(0), readFile(1), readFile(2)
    ], (err, results) => {
      let str = '';
      for (let i in results) {
        str = str + results[i] + '\n';
      }
      callback(null, str + "读取子文件完毕");
    });
  },

  // 将三个子文件的内容合并到duplicate.txt中
  (callback) => {
    for (let i in lines) {
      let str = i === 0 ? lines[i] : `\n${lines[i]}`;
      fs.appendFileSync('practice-async/duplicate.txt', str);
    }
    callback(null, "合并子文件内容完毕");
  }
], (err, results) => {
  for (let i in results) {
    console.log(results[i]);
  }
});

function saveFile(value) {
  return function (callback) {
    for (let i in data[value]) {
      let serial = i * 3 + value;
      let str = i === 0 ? `${serial}:${data[value][i]}` : `\n${serial}:${data[value][i]}`;
      fs.appendFileSync(`practice-async/source-p${value + 1}.txt`, str);
    }
    callback(null, `file ${value + 1} finish saving`);
  }
}

function readFile(value) {
  return function (callback) {
    let stream = fs.createReadStream(`practice-async/source-p${value + 1}.txt`);
    let rl = readline.createInterface({ input : stream });
    rl.on('line', (line) => {
      let delimiter = line.indexOf(':');    // 冒号分隔符
      let serial = parseInt(line.substring(0, delimiter));    // 文本序号
      let str = line.substring(delimiter + 1);
      lines[serial] = str;
    });
    rl.on('close', () => {
      callback(null, `file ${value + 1} finish loading`);
    })
  }
}
