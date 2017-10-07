const express = require('express');
const router = express.Router();
const multer = require('multer');

const User = require('../models/user');
const File = require('../models/file');

const uploadDir = "practice-http/server/upload";
const downloadDir = "practice-http/server/download";

// 验证登录中间件
function verifyLogin(req, res, next) {
    let user = req.session.user;
    if (user == null) {
        res.render('login', {title: '用户未登录'});
    } else {
        User.findOne({username: user.username}, (err, result) => {
            if (result == null) {
                res.render('login', {title: '非法用户'});
            } else {
                req.user = result;
                next();
            }
        });
    }
}

// 统一处理返回数据格式和返回的status中间件,render以后就不能使用，因为一次响应只能发送一次数据
function APIReturn(req, res) {
    let status = {};
    status.code = res.code;
    status.message = res.message;
    status.data = res.data;
    res.json(JSON.stringify(status));
}

/* GET home page. */
const routes = (app) => {
    app.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });

    app.get('/hello', function(req, res, next) {
        res.send('hello world');
    });

    app.get('/reg', function(req, res, next) {
        res.render('reg', {title: '注册'});
    });

    app.post('/reg', function(req, res, next) {
        let name = req.body.name,
            password = req.body.password;
        // console.log(name + ' ' + password);
        let flag = 0;
        User.findOne({username: name}, (err, result) => {
            console.log("result: " + result);
            if (result == null) {
                let user = new User({
                    username: name,
                    password: password
                })
                user.save(function(err, doc) {
                    if (err) {
                        console.log('save error:' + err);
                    }
                    // console.log('save success \n' + doc);
                    req.session.user = user;
                });
                res.render('index', { title: name });
            } else {
                res.render('reg', {title: '用户名已被占用'});
            }
        });
    });

    app.get('/login', function(req, res, next) {
        res.render('login', {title: '登录'});
    });

    app.post('/login', function(req, res, next) {
        let name = req.body.name,
            password = req.body.password;
        User.findOne({username: name}, (err, user) => {
            if (!user)
                return res.render('login', {title: '用户不存在'});
            if (user.password != password) {
                return res.render('login', {title: '密码错误'});
            }
            // console.log('user: ' + user);
            req.session.user = user;
            // console.log(req.session.user);
            res.render('index', { title: name });
        });

    });

    app.get('/upload', verifyLogin, function(req, res, next) {
        res.render('upload', {title: '上传'});
    });

    let upload = multer({dest: uploadDir});
    app.post('/upload', verifyLogin, upload.any(), function(req, res, next) {
        if (req.files[0] == null) {
            return render('error', {message: "无文件"});
        }
        let file = new File({
            username: req.user.username,
            filename: req.files[0].originalname,
            path: req.files[0].path
        });
        file.save((error) => {
            return res.render('index', { title: "上传成功" });
        });
    });

    app.get('/download', verifyLogin, function(req, res, next) {
        res.render('download', {title: '下载'});
    });

    app.get('/downloadFile', verifyLogin, function(req, res, next) {
        if (req.query.file != null) {
            File.findOne({_id: req.query.file}, (error, file) => {
                if (file == null) {
                    return res.render('error', {message: "无此文件"});
                } else if (file.username != req.user.username && file.public == false) {
                    return res.render('error', {message: "无权限"});
                } else {
                    res.download(file.path, file.filename, (error) => {
                        // return res.render('index', {title: "下载成功"});
                    });
                }
            });
        } else {
            return res.render('error', {message: "无此文件"});
        }
    });

    app.get('/logout', verifyLogin, function(req, res, next) {
        req.session.user = null;
        return res.render('login', { title: "注销成功" });
    });

    app.get('/downloadList',  verifyLogin, function(req, res, next) {
        File.find({username: req.user.username}, (err, files) => {
            File.find({public: true}, (err, result) => {
                for (let i in files) {
                    let flag = 1;
                    for (let j in result) {
                        if (files[i]._id.toString() == result[j]._id.toString()) {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag == 1)
                        result.push(files[i]);
                }
                res.code = 0;
                res.message = "downloadFileList";
                res.data = result;
                for (let i in result) {
                    console.log(result[i]);
                }
                next();
            });
        });
    }, APIReturn);

    app.get('/share', verifyLogin, function(req, res, next) {
        return res.render('share', { title: "分享" });
    });

    app.get('/shareList', verifyLogin, function(req, res, next) {
        File.find({username: req.user.username}, (err, result) => {
            res.code = 0;
            res.message = "shareFileList";
            res.data = result;
            // console.log(result);
            next();
        });
    }, APIReturn);

    app.post('/share', verifyLogin, function(req, res, next) {
        if (req.body.file != null) {
            File.findOne({_id: req.body.file}, (error, file) => {
                // console.log('file: ' + file);
                if (file == null) {
                    return res.render('error', {message: "无此文件"});
                } else if (file.username != req.user.username) {
                    return res.render('error', {message: "无权限"});
                } else {
                    file.public = true;
                    // console.log(file);
                    File.update({_id: file._id}, file, (error) => {
                        res.code = 0;
                        next();
                    });
                }
            });
        } else {
            return res.render('error', {message: "无此文件"});
        }
    }, APIReturn);

    app.post('/unshare', verifyLogin, function(req, res, next) {
        if (req.body.file != null) {
            File.findOne({_id: req.body.file}, (error, file) => {
                // console.log('file: ' + file);
                if (file == null) {
                    return res.render('error', {message: "无此文件"});
                } else if (file.username != req.user.username) {
                    return res.render('error', {message: "无权限"});
                } else {
                    file.public = false;
                    // console.log(file);
                    File.update({_id: file._id}, file, (error) => {
                        res.code = 0;
                        next();
                    });
                }
            });
        } else {
            return res.render('error', {message: "无此文件"});
        }
    }, APIReturn);
}
  


module.exports = routes;
