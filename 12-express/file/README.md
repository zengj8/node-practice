创建过程
===========

```Express```是基于 ```Nodejs``` 的一个快速 ```web``` 开发框架, 它提供了一个 ```Express application generator``` 可以帮助我们快速创建应用的骨架。

使用如下命令安装 ```generator```:

```
npm install express-generator -g
```

安装完成后用以下命令生成骨架, ```-e``` 选项代表使用 ```EJS``` 模板引擎:

```
express -e myapp
```
生成后的应用文件结构如下:

```
.
├── LICENSE
├── README.md
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.ejs
    └── index.ejs
    
7 directories, 10 files
```

* ```app.js``` 是 ```express``` 的设置文件
* ```bin/www``` 是 ```express``` 执行文件
* ```package.json``` 是 ```node.js``` 项目的配置文件，用于保存应用信息与依赖管理
* ```public```文件夹为 ```web``` 应用的资源文件夹
* ```routes```保存路由文件
* ```views```保存网站的 ```ejs``` 视图代码

然后执行 ```npm install``` 安装项目依赖, 该命令根据 ```package.json``` 文件中描述的 ```dependencies``` 安装依赖，默认安装到 ```node_modules``` 文件夹下。例如自动生成的 ```package.json``` 文件如下:

```
{
  "name": "NodeTurtorials",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "body-parser": "~1.13.2",
    "cookie-parser": "~1.3.5",
    "debug": "~2.2.0",
    "ejs": "~2.3.3",
    "express": "~4.13.1",
    "morgan": "~1.6.1",
    "serve-favicon": "~2.3.0"
  }
}
```
通过 ```npm start``` 或者直接 ```node ./bin/www``` 启动项目。

打开浏览器输入 ```localhost:8001``` 查看效果。