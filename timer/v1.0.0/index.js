
(function (global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document
            ? (function () {
                return (window.$timer = factory(global));
            })()
            : factory(global);
    } else {
        window.$gTimer = factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (window) {
    /**
     * @description 替代setInterval定时器，标签页隐藏时不会执行
     * @param {Function} handler 执行函数
     * @param {Number} delay 毫秒数
     * @param {Boolean} immediate 第一次是否立即执行 
     * @return {Function} 通过闭包方式返回方法关闭定时器
     * @todo 用完后注意取消闭包引用 
     * @todo 应用场景: 滚动数据,海量点
     */
    function timer(handler, delay, immediate = true) {
        let timerId;
        excute(handler, delay, immediate);
        return function () {
            clearTimeout(timerId), timerId = null;
        }
        function excute(handler, delay, immediate) {
            if (immediate) return run();
            timerId = setTimeout(run, delay);
            function run() {
                handler();
                excute(handler, delay)
            }
        }
    }
    // 在vue中执行定时器
    function vueExecuteTimer(handler, delay, immediate) {
        let revoke = null;
        function open() {
            close();
            revoke = timer(handler, delay, immediate);
        }
        function close() {
            if (revoke) revoke(), revoke = null;

        }
        open();
        // this.$once('hook:mounted', open);
        this.$on('hook:activated', () => {
            if (!revoke) open(); // 只有已经关闭了才会再次打开
        });
        this.$on('hook:deactivated', close);
        this.$once('hook:beforeDesctory', close);
        return close;
    }
    timer.vue = vueExecuteTimer;
    return timer;
});