const net = require('net');

let clients = [], users = [];

let server = net.createServer((socket) => {
  console.log('server connected');

  socket.on('data', function(chunk) {
    try {
      let signal = JSON.parse(chunk.toString().trim());
      // 用户登录
      if (signal.type === 'login') {
        let name = signal.username;
        if (!~users.indexOf(name)) {
          // 不重名
          users.push(name);
          clients.push(socket);
          console.log(`${name} login`);
          boardcast(signal);
        } else {
          // 重名
          let repetition = {
            message: `用户 ${name} 已经存在, 请重连`,
            type: 'repetition'
          };
          console.log(`用户 ${name} 已经存在, server connected`);
          socket.write(JSON.stringify(repetition));
        }
      } else {
        let from = signal.username;
        let message = signal.message;
        console.log(`${from}> ${message}`);
        boardcast(signal);
      }
    } catch (err) {
      server.write('server error');
    }
  });

  // 用户登出
  socket.on('close', (data) => {
    let index = clients.indexOf(socket);
    let user = users[index];
    let logout = {
      message: `user ${user} logout.`,
      username: user,
      type: 'logout'
    };
    console.log(`user ${user} CLOSED`, data);
    boardcast(logout);
  });

  // 客户端ctrl+C, 不监听error事件会报错
  socket.on('error', (error) => {
    // let index = clients.indexOf(socket);
    // let user = users[index];
    // console.log(`${user} 用户强退`, error);
  });
});

// 广播消息
function boardcast(signal) {
  clients.forEach(function(client) {
    client.write(JSON.stringify(signal));
  });
}

server.listen(2080, (err) => {
  if (err)
    throw err;
  console.log('服务端正常启动, 监听2080端口');
});
