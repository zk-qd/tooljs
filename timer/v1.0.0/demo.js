
const timer = require('../index');

// js中执行定时器
let revoke = timer(function () {
    console.log('答应');
}, 1000, true)

setTimeout(() => {
    revoke();
    // 释放闭包
    revoke = null;
}, 5000)

// vue
function created() {
    timer.vue.call(this, handler, delay, immediate);
}
