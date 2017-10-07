require('./init.js');

const fs = require('fs');
const readline = require('readline');
const path = require('path');

copyByPieces('practice-promise/source.txt', 3);

function copyByPieces(sourceFile, pieceNum) {
  if (!fs.existsSync(sourceFile) || fs.lstatSync(sourceFile).isDirectory() || pieceNum < 2)
    return;

  let extname = path.extname(sourceFile);
  let basename = path.basename(sourceFile, extname);
  let dirname = path.dirname(sourceFile);

  let data = new Array();
  for (let i = 0; i < pieceNum; i ++)
    data[i] = new Array();

  let lines = new Array();

  return new Promise((resolve, reject) => {
    // 读取母文件内容
    let sourceStream = fs.createReadStream(sourceFile);
    let rl = readline.createInterface({ input: sourceStream });
    let num = 0;

    rl.on('line', (line) => {
      data[(num ++) % pieceNum].push(line);
    });
    rl.on('close', () => {
      console.log("读取母文件内容完毕");
      // 调用后续then()函数
      resolve();
    });
  }).then(
    // 将data内容写入所有子文件
    () => {
      let saveFunctions = new Array();
      for (let i = 0; i < pieceNum; i ++) {
        saveFunctions.push(saveFile(i));
      }
      // Promise.all和async.parallel一样
      return Promise.all(saveFunctions).then(results => {
        for (let i in results)
          console.log(results[i]);
        console.log("写入子文件完毕");
      });
    }
  ).then(
    // 同时读取所有子文件的内容
    () => {
      let readFunctions = new Array();
      for (let i = 0; i < pieceNum; i ++) {
        readFunctions.push(readFile(i));
      }
      // Promise.all和async.parallel一样
      return Promise.all(readFunctions).then(results => {
        for (let i in results)
          console.log(results[i]);
        console.log("读取子文件完毕");
      });
    }
  ).then(
    // 将三个子文件的内容合并到duplicate.txt中
    () => {
      for (let i in lines) {
        let str = i === 0 ? lines[i] : `\n${lines[i]}`;
        fs.appendFileSync(`${dirname}/${basename}-duplicate${extname}`, str);
      }
      console.log("合并子文件内容完毕");
    }
  ).catch(err => console.log(err));   // 如果没有catch会报UnhandledPromiseRejectionWarning，从而无法定位问题

  function saveFile(value) {
    return new Promise((resolve, reject) => {
      for (let i in data[value]) {
        let serial = i * pieceNum + value;
        let str = i === 0 ? `${serial}:${data[value][i]}` : `\n${serial}:${data[value][i]}`;
        fs.appendFileSync(`${dirname}/${basename}-p${value + 1}${extname}`, str);
      }
      resolve(`file ${value + 1} finish saving`);
    });
  }

  function readFile(value) {
    return new Promise((resolve, reject) => {
      let stream = fs.createReadStream(`${dirname}/${basename}-p${value + 1}${extname}`);
      let rl = readline.createInterface({ input : stream });
      rl.on('line', (line) => {
        let delimiter = line.indexOf(':');    // 冒号分隔符
        let serial = parseInt(line.substring(0, delimiter));    // 文本序号
        let str = line.substring(delimiter + 1);
        lines[serial] = str;
      });
      rl.on('close', () => {
        resolve(`file ${value + 1} finish loading`);
      });
    });
  }
}

