const fs = require('fs');
const LOG_PATH = './practice-process/';

process.on('message', (message) => {
  writeLog('practice.log', message);
  let tag = message.trim().match(/^\[[\w]+\]/);
  if (tag) {
    switch (tag[0]) {
      case '[INFO]':
        writeLog('info.log', message);
        break;
      case '[WARN]':
        writeLog('warn.log', message);
        break;
      case '[ERROR]':
        writeLog('error.log', message);
        break;
    }
  }
});

function writeLog(path, message) {
  if (!fs.existsSync(LOG_PATH)) {
    fs.mkdir(LOG_PATH);
  }
  path = LOG_PATH + path;
  fs.appendFile(path, message + '\n', (err) => {
    if (err)
      throw err;
  });
}
