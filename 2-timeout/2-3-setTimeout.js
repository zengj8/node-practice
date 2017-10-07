// 每分钟的第i秒都输出当前时间
// 注:第2秒实际上是hh:mm:01的时候

// function schedule(seconds) {
//     function getSecond() {
//         setTimeout(() => {
//             var date = new Date();
//             if (date.getSeconds() == seconds - 1) {
//                 console.log(date.toLocaleTimeString());
//             }
//             getSecond();
//         }, 1000);
//     }
//     getSecond();
// }
// schedule(10);

function print() {
    setTimeout(() => {
        console.log(new Date().toLocaleTimeString());
        print();
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
    setTimeout(() => {
        console.log(new Date().toLocaleTimeString());
        print();
    }, delay);
}

schedule(1);