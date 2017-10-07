// 每隔3s输出当前时间，输出10次后终止
var num = 0;
var i = setInterval(function() {
    num ++;
    console.log(new Date().toLocaleTimeString());
    if (num >= 10)
        clearInterval(i);
}, 3000);
