// 每隔3s输出当前时间，输出10次后终止
var num = 0;
var i = function() {
    setTimeout(() => {
        console.log(new Date().toLocaleTimeString());
        num ++;
        if (num >= 10)
            return;
        i();
    }, 3000);
}
i();