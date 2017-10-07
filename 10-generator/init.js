const fs = require('fs');

if (!fs.existsSync('practice-generator')) {
  fs.mkdirSync('practice-generator');
}

if (!fs.existsSync('practice-generator/source.txt')) {
  for (let i = 1; i < 100; i ++) {
    fs.appendFileSync('practice-generator/source.txt', i + '\n');
  }
}
