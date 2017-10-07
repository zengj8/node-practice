# Node.js 练习

## 目录

- [start](#start)
- [异步回调练习](#异步回调练习)
- [fs](#fs)
- [events](#events)
- [child_process](#child_process)
- [net](#net)
- [http](#http)
- [async](#async)
- [Promise](#Promise)
- [generator](#generator)
- [async/await](#async\/await)
- [express](#express)

## start

- 安装Node.js, 配置npm源
- 安装nvm, 使用nvm管理至少两个Node.js版本

## 异步回调练习


1. 分别使用 `setTimeout` 和 `setInterval` 实现每隔3秒输出当前时间的操作;
2. 分别使用 `setTimeout` 和 `setInterval` 实现3秒后输出当前时间的操作;
3. 分别使用 `setTimeout` 和 `setInterval` 实现一个函数 schedule(seconds),要求每分钟的第`seconds`秒都打印当前时间。

## fs

1. 访问文件信息、递归创建目录、移动文件或目录、拷贝文件或目录；

2. 使用fs在当前目录创建一个`practice-fs`目录，并在目录下创建一个`practice.js`文件，并写入内容：

```js
let content = `I'm practicing writing a javascript file at ${Date.now()}`;

console.log(content);
```

3. 实现操作：向`p-write1.js`文件中写入内容的同时，向`p-write2.js`写入同样的内容，要求以读写流的方式实现；

4. 将步骤3的操作使用watchFile的方法实现；

## events
1. 定义事件`log-write`, 传入的参数有`path`和`content`, 当触发`log-write`操作时, 向`path`对应的文件中添加`content`内容;

2. 定义事件`log-error`, 传入的参数为`error`, 要求触发该事件时触发步骤1中的`log-write`事件添加错误对象error的内容到`fs-error.log`文件;

## child_process & process
1. 使用child_process实现进程间通信, 要求实现操作两个进程, 进程1监听终端输入, 当终端输入内容时, 将内容发送到进程2, 进程2将内容添加到`practice-process/practice.log`文件中;

2. 扩展步骤1中的功能，将终端输入的内容按照特定标签读取并按规则写入文件, 规则为：
	- 当内容为`[INFO]*`, 将内容添加到`practice-process/info.log`;
	- 当内容为`[WARN]*`, 将内容添加到`practice-process/warn.log`;
	- 当内容为`[ERROR]*`, 将内容添加到`practice-process/error.log`;
	- 所有内容均写入到`practice-process/practice.log`;

3. 使用child_process实现一个cli, 要求可以有以下操作：
	- create \<dirname\> 创建一个dirname目录或者文件
	- copy \<sourcefile\> \<targetdir\> 将sourcefile复制到targerdir目录下
	- --version 或者 -v 打印一个版本号
	- --help 或者 -h 打印帮助说明

## net
1. 实现服务端与客户端通讯

2. 实现多个客户端之间的聊天

## http
1. 提供一个函数createNewHttpServer(port), 实现功能为创建一个http server, 当http server收到请求时, 按如下格式打印内容`时间: ip 地址 浏览器信息 请求完整url http请求方式: {请求的参数: 对应的参数内容}`;

2. 将步骤1中的http server增加文件上传功能, 将上传的文件存入`practice-http/server/upload`目录中;

3. 提供一个函数uploadFile(path, url), 要求调用该函数时创建一个http Client对象, 并且实现将`path`对应的文件(需先判断是否为文件而不是目录, 并且目录或文件是否存在)上传到对应的url中(可以直接对应步骤2中的http server);

4. 扩展步骤2和步骤3中的功能, 要求实现uploadFile(path, url)可以上传整个目录的文件, 并且在http server的`practice-http/server/upload`中存放的位置和上传的文件目录相对应。例如uploadFile上传的目录结构是这样的
```markdown
- dir
	- dir1
		- file1
	- dir2
		- file2
```
则http server中存放的目录为
```markdown
- practice-http/server
	- upload
		- dir
			- dir1
				- file1
			- dir2
				- file2
```
额外要求：当http server存在相同目录文件时，在之后添加的文件名末尾加个-N(N为重名的个数-1), 例如http server已经存在`practice-http/server/download/dir/file1.txt`和`practice-http/server/download/dir/file1-0.txt`, 然后又上传一个`/dir/file1.txt`, 则存为`practice-http/server/download/dir/file1-1.txt`;

5. 扩展步骤2中的http server, 要求实现文件下载操作, 可以下载目录`practice-http/server/download`目录下任何路径的文件, 并且禁止越权下载到任何`practice-http/server/download`上级目录下的文件。

6. 提供downloadFile(path, url)函数, 要求创建一个http Client对象, 向url(对应http server)发出http请求, 可以下载path对应的文件或者path对应目录下的单个文件, 或者path对应的供下载的目录下的所有文件, 将下载的文件及对应的相对路径结构存入`practice-http/client/download`目录中, 例如: 需要path为`dir`, 则下载`practice-http/server/download/dir`目录及其目录下的所有文件, 并存为`practice-http/client/download/dir`。

额外操作: 自己想办法将步骤5和步骤6中上传整个目录的操作改为将文件压缩上传, 并且在另一端解压存储(可以增加参数来标识问文件是否需要解压)

## async
使用async库的对应函数按步骤实现以下功能:
1. 使用readline和fs模块读取文件`practice-async/source.txt`的内容, 文件内容行数除以3的余数切分为三个数组;
2. 将三个数组的内容分别写入三个不同的文件`practice-async/source-p1.txt`, `practice-async/source-p2.txt`和`practice-async/source-p3.txt`;
3. 同时读取三个文件的内容, 将内容合并并写入一个新的文件`practice-async/duplicate.txt`, 要求新文件的内容必须和`practice-async/source.txt`的内容一致;
注: 为了使内容可以恢复, 步骤2的内容可以添加某些标志
扩展: 将以上操作封装成函数copyBypices(sourceFile, piceNum), piceNum为切分文件数(切分规则可以不按步骤1中的规则), sourceFile为源文件路径, 最后生成的文件放在当前目录下。

## Promise
使用Promise完成async练习中同样的内容

## generator
使用generator完成async练习中相同的内容

## async/await
使用async/await完成async练习中相同的内容

## express
1. 创建一个express应用, 并且监听8001端口, 将http练习中的文件上传和下载操作都实现一遍(上传和下载需对应不同路由)。

2. 结合Mongoose创建一个简单的用户系统, 实现简单的用户注册和登录操作, 并且步骤1中的文件上传和下载操作必须验证登录, 将登录验证写成一个中间件;

3. 给用户增加权限, 用户只能下载自己上传的文件, 并且提供接口返回给用户可以下载的文件列表;

4. 实现文件共享操作, 用户可以分享自己上传的文件给其他用户, 这一题为开放性题目, 大家可以自己结合数据库实现这部分的操作;

5. 自写一个中间件, 要求实现统一处理返回数据格式和返回的status。
