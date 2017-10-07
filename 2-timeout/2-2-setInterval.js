// 3s后输出当前时间
var flag = 0;
var i = setInterval(() => {
    if (flag === 0) {
        console.log(new Date().toLocaleTimeString());
        flag ++;
    }
    else clearInterval(i);
}, 3000);