const fs = require('fs');

if (!fs.existsSync('source.txt')) {
  for (let i = 1; i < 100; i ++) {
    fs.appendFileSync('source.txt', i + '\n');
  }
}
