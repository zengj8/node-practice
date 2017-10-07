const fs = require('fs');
const readline = require('readline');
const cp = require('child_process');
const child = cp.fork(`${__dirname}/log_child.js`);

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  child.send(line);
});