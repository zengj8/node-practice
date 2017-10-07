const net = require('net');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What is your name?\n', (username) => {

  username = username.trim();
  if (!username)
    throw new Error('名字不能为空');

  let socket = net.connect({port: 2080, host: '127.0.0.1'}, () => {

    console.log('Welcome', username, 'to chatroom');

    let login = {
      message: `user ${username} login.`,
      username: username,
      type: 'login'
    };
    socket.write(JSON.stringify(login));

    socket.on('data', (chunk) => {
      let signal = JSON.parse(chunk.toString().trim());
      if (signal.type === 'repetition') {
        // 登录重名
        console.log(`用户 ${username} 已经存在,请重连`);
        socket.destroy();
        rl.close();
      } else {
        let from = signal.username;
        let message = signal.message;
        console.log(`${from}> ${message}`);
      }
    });


    rl.on('line', (line) => {
      var send = {
        username: username,
        message: line.toString().trim()
      };

      socket.write(JSON.stringify(send));
    });
  });
});
