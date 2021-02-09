
// 工具类
window.$tool = {
    /**
     * @description 防抖动，
     * @param {Function} handler 执行函数 
     * @param {Number} delay 推迟时间毫秒数
     * @param {Boolean} immediate 第一次立即执行
     * @return {Function} 返回的promise状态 then or catch
     * @todo 应用场景：各种按钮
     * @todo 主要作用：短时间内多次触发限制只执行一次
     * @todo 缺点：反应时间延长
     */
    debounce(handler, delay = 400, immediate = false) {
        let timer = null, cancel;
        return function (...args) { // 这里不要用箭头函数
            let content = this;
            if (timer) clearTimeout(timer);
            return new Promise((resolve, reject) => {
                if (immediate) immediate = true, execute();
                else timer = setTimeout(execute, delay);
                function execute() {
                    if (cancel) cancel("请勿频繁操作"); // cancel取消的是上一次的promise，
                    cancel = reject;// 只有请求到了结果才算成功，再次之前任何下一次请求，都会取消上次请求
                    resolve(handler.apply(content, args)) // 不管结果返回的是promise还是其他都可以
                }
            }).catch(console.warn);
        }
    },
    /**
     * @description 节流阀，多次触发下，一个时间段必定会执行一次
     * @param {Function} handler 执行函数
     * @param {Number} delay 蓄满时间 毫秒
     * @param {Boolean} immediate 为true立即执行，不蓄
     * @return {Function} then or catch
     * @todo 应用场景：海量点
     * @todo 主要作用：短时间内多次触发减少请求次数，并且缩短反应时间
    */
    throttle(handler, delay = 400, immediate = false) {
        let timer = null, cancel,
            startTime = Date.parse(new Date());// 初始化一个开始时间
        return function (...args) {
            let context = this,
                curTime = Date.parse(new Date()),
                remaining = delay - (curTime - startTime);
            if (timer) clearTimeout(timer); // 取消上一次的定时器
            return new Promise((resolve, reject) => {
                if (immediate || remaining <= 0) execute(); // 上一个周期内已经完了
                else timer = setTimeout(handler, remaining);// 还在同一个周期内
                function execute() {
                    if (cancel) cancel('等待中');// 取消上一次的promise
                    cancel = reject, startTime = Date.parse(new Date());
                    resolve(handler.apply(context, args));
                }
            }).catch(console.warn)
        }
    },
    /**
     * afterperform 之后执行
     * @param {Function} callback 执行函数
     * @param {Function or *} condition 满足条件  使用传参调用
     * @param {Number} delay 延迟时间
     * todo 轨迹播放就用到过，在不同的函数中，要等待地图加载完毕，才能执行
     *  */
    afterperform(callback, condition = function () { return true }, delay = 400) {
        if (typeof condition == 'function' ? condition() : condition) {
            callback();
        } else {
            setTimeout(() => {
                $object.afterperform(callback, condition, delay)
            }, delay)
        }
    },
    /**
     * @description 通过文件地址获取文件类型
     * @param {string} url 文件地址
     * @return {object} 文件相关信息
     * @todo 
     */
    fileInfo(url) {
        if (!/\./.test(url)) throw new TypeError('文件地址错误:没有后缀名');
        let type,
            suffix,
            name,
            map;
        ([suffix, ...name] = url.split('.').reverse());
        name = name.join('.');
        map = new Map([
            ['.jpg, .jpeg, .png, .gif', 'image'],
            ['视频后缀', 'video'],
            ['音频后缀', 'audio'],
            ['.pdf', 'pdf'],
            ['.xlxs, .xls', 'excel'],
            ['.word', 'word']
        ])
        for (let [key, value] of map) {
            if (new RegExp(suffix).test(key)) {
                type = value;
                break;
            }
        }
        return {
            url, // 文件地址
            suffix, // 文件后缀
            name, // 文件名称
            type, // 文件类型
        }
    }
}