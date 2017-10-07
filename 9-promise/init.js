const fs = require('fs');

if (!fs.existsSync('practice-promise')) {
  fs.mkdirSync('practice-promise');
}

if (!fs.existsSync('practice-promise/source.txt')) {
  for (let i = 1; i < 100; i ++) {
    fs.appendFileSync('practice-promise/source.txt', i + '\n');
  }
}