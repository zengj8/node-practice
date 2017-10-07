const fs = require('fs');
const path = require('path');

function mkdirsSync(dir) {
  if (!fs.existsSync(dir)) {
    mkdirsSync(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}

mkdirsSync('practice-http/server/upload');
mkdirsSync('practice-http/server/download');


