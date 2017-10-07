const fs = require('fs');

fs.mkdir("./practice-fs", function (err) {
  if (err) throw err;
  let str = "letcontent = `I'm practicing writing a javascript file at ${Date.now()}`;\nconsole.log(content);";
  fs.writeFile("./practice-fs/p-write1.js", str, function (err) {
    if (err) throw err;
    console.log("数据写入成功");
  });
});
