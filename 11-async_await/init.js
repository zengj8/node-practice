const fs = require('fs');

if (!fs.existsSync('practice-async_await')) {
  fs.mkdirSync('practice-async_await');
}

if (!fs.existsSync('practice-async_await/source.txt')) {
  for (let i = 1; i < 100; i ++) {
    fs.appendFileSync('practice-async_await/source.txt', i + '\n');
  }
}
