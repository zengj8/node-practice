const fs = require('fs');

if (!fs.existsSync('practice-async')) {
  fs.mkdirSync('practice-async');
}

if (!fs.existsSync('practice-async/source.txt')) {
  for (let i = 1; i < 100; i ++) {
    fs.appendFileSync('practice-async/source.txt', i + '\n');
  }
}