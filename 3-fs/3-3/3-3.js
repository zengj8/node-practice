const fs = require('fs');

var file1 = "./p-write1.js";
var file2 = "./p-write2.js";

var writeStream1 = fs.createWriteStream(file1);
var readStream = fs.createReadStream(file1);
var writeStream2 = fs.createWriteStream(file2);

// 写入之前调用pipe
readStream.pipe(writeStream2);

writeStream1.write('xxxx');
writeStream1.end();
