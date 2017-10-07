let fs = require('fs');

let file1 = "./p-write1.js";
let file2 = "./p-write2.js";

var writeStream1 = fs.createWriteStream(file1);

fs.watchFile(file1, (curr, prev) => {
  if (curr.mtime.getTime() != prev.mtime.getTime()) {
    var readStream = fs.createReadStream(file1);
    var writeStream2 = fs.createWriteStream(file2);
    readStream.pipe(writeStream2);
  }
});

writeStream1.write('xxxxx');
writeStream1.end();