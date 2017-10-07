// 每分钟的第i秒都输出当前时间
// 注:第2秒实际上是hh:mm:01的时候
// function schedule(seconds) {
//     if (new Date().getSeconds() == seconds - 1)
//         console.log(new Date().toLocaleTimeString());
//     setInterval(() => {
//         var date = new Date();
//         if (date.getSeconds() == seconds - 1)
//             console.log(date.toLocaleTimeString());
//     }, 1000);
// }

function print() {
    setInterval(() => {
        console.log(new Date().toLocaleTimeString());
    }, 60 * 1000);
}

function schedule(seconds) {
    var cur = new Date().getSeconds();
    var delay = 1000;
    seconds -= 1;
    if (cur >= seconds) 
        delay *= 60 - cur + seconds;
    else 
        delay *= cur - seconds;
    var i = setInterval(() => {
        console.log(new Date().toLocaleTimeString());
        clearInterval(i);
        print();
    }, delay);
}

schedule(1);