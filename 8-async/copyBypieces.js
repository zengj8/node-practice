require('./init_1.js');

const fs = require('fs');
const async = require('async');
const readline = require('readline');
const path = require('path');

function copyByPieces(sourceFile, pieceNum) {
  // 如果路径不存在或者路径为目录或切分数小于2则直接返回
  if (!fs.existsSync(sourceFile) || fs.lstatSync(sourceFile).isDirectory() || pieceNum < 2)
    return;

  let extname = path.extname(sourceFile);
  let basename = path.basename(sourceFile, extname);

  let data = new Array();
  for (let i = 0; i < pieceNum; i ++)
    data[i] = new Array();

  let lines = new Array();

  async.series([
    // 读取母文件内容
    (callback) => {
      let sourceStream = fs.createReadStream(sourceFile);
      let rl = readline.createInterface({ input: sourceStream });
      let num = 0;

      rl.on('line', (line) => {
        data[(num ++) % pieceNum].push(line);
      });
      rl.on('close', () => {
        callback(null, "读取母文件内容完毕");
      });
    },

    // 将data内容写入所有子文件
    (callback) => {
      let saveFunctions = new Array();
      for (let i = 0; i < pieceNum; i ++) {
        saveFunctions.push(saveFile(i));
      }
      async.parallel(saveFunctions, (err, results) => {
        let str = '';
        for (let i in results) {
          str = str + results[i] + '\n';
        }
        callback(null, str + "写入子文件完毕");
      });
    },

    // 同时读取所有子文件的内容
    (callback) => {
      let readFunctions = new Array();
      for (let i = 0; i < pieceNum; i ++) {
        readFunctions.push(readFile(i));
      }
      async.parallel(readFunctions, (err, results) => {
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
        fs.appendFileSync(`${basename}-duplicate${extname}`, str);
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
        let serial = i * pieceNum + value;
        let str = i === 0 ? `${serial}:${data[value][i]}` : `\n${serial}:${data[value][i]}`;
        fs.appendFileSync(`${basename}-p${value + 1}${extname}`, str);
      }
      callback(null, `file ${value + 1} finish saving`);
    }
  }

  function readFile(value) {
    return function (callback) {
      let stream = fs.createReadStream(`${basename}-p${value + 1}${extname}`);
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
}

copyByPieces('source.txt', 5);
