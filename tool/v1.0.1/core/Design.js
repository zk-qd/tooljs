
// 设计类
window.$design = {
    /**
    * *观察者 
    * todo observer = new observer();
    * ? observer.on(type,fn) 消息订阅
    * @param {String} type 事件类型
    * @param {Function} fn 处理函数
    * !一个type可以绑定多个处理函数
    * ? observer.emit(type,args) 消息发布
    * @param {String} type 事件类型
    * @param {Any} args 参数
    * @param {Boolean} async 参数 20201023
    * !触发type绑定的所有函数
    * !默认异步触发（一个类型的各个函数相对同步，函数相对其他异步）
    * ? observer.off(type,fn) 注销订阅
    * @param {String} type 事件类型
    * @param {Function} fn 处理函数
    * ! 如果有fn注销一个类型的其中一个函数，如果没有fn注销整个类型，如果不传入参数，那么注销所有事件
    * ! 多个发布者可以，但是多个订阅者就要注意了
    * 
   */
    observer: function () {
        // 安全模式
        if (new.target !== $design.observer) { return new $design.observer() }
        const list = {};
        this.on = function (type, fn) {
            !list[type] && (list[type] = new Set());
            list[type].add(fn)
            return this;
        }
        this.emit = function (type, args, async = true) {
            let event = { type: type, params: args }
            run(() => { list[type] && list[type].forEach(fn => fn.call(undefined, event)) }); // 传名
            function run(callback) {
                if (async) setTimeout(callback);
                else callback();
            }
            return this;
        }
        this.off = function (type, fn) {
            if (type) {
                list[type] && (fn ? list[type].delete(fn) : delete list[type])
            } else {
                list = {};
            }
            return this
        }
    },
    /**
     * *状态管理
     * @param {Object} states 状态方法集合
     * @return {Object} 接口对象
     * 执行状态返回this，不需要返回其他数据，因为状态之间是没有关系的\
     * usage:
     * state.change('fn1','fn2').run()
     *  */
    state: function (states) {
        // 安全模式
        if (new.target !== $design.state) { return new $design.state(states) }
        let currentState = {};
        // 控制类
        let constrol = {
            change(...args) {
                let i = 0, len = args.length;
                // 重置当前状态
                currentState = {};
                // 添加新的状态
                for (; i < len; i++) {
                    currentState[args[i]] = true;
                }
                return this;
            },
            run() {
                for (let key in currentState) {
                    states[key] && states[key]();
                }
                return this;
            }

        }
        return constrol;
    },

    /**
     * 命令模式
     * @param {Object} command 命令对象
     * @returns {Object} {execute: 执行命令方法} 
     * 命令和状态不一样，可能需要返回值 
     * usage:
     * command.execute([{cmd: 'fn1',params: []])
     * */
    command: function (command = {}) {
        if (new.target !== $design.command) return new $design.command(command);
        return {
            /** 
             * *执行命令方法 
             * execute(args)
             * @param {Object or Array} args 如果是对象那么直接执行，如果是数组，那么递归执行
             * @return {Any} 返回方法的返回值
             * ! args的格式: [{cmd: '命令名称',params: ['参数列表']}]
             * @param {String} cmd 命令名称
             * @param {Any} params 参数 不是传入数组的话最终也会包装成数组
             * 
             * */
            execute(args) {
                // 判断是否数组
                if (Object.prototype.toString.call(args) === '[object Array]') {
                    args.forEach(this.execute)
                }
                let cmd = args['cmd'], // 命令
                    params = args['params'] || [];// 参数
                // 适配参数
                if (!(params instanceof Array)) {
                    params = [params];
                }
                return command && command[cmd] && command[cmd](...params);
            }
        }
    },
    /** 
     * *享元模式
     * @param  {Object} logic 共享逻辑
     * @returns {Object} 返回访问接口
     * 既可以初始化，又可以动态添加
     * flyweight.add({fn1: function})
     * flyweight.call([{share: 'fn1',params: [{}]}])
     *  */
    flyweight: function (logic = {}) {
        if (new.target !== $design.flyweight) return new $design.flyweight(logic);
        return {
            /**
             * *执行逻辑的方法
             * call(args)
             * @param {Object or Array} args 如果是对象那么直接执行，如果是数组，那么递归执行
             * @return {Any} 返回方法的返回值
             * ! args的格式: [{share: '共享方法名称',params: ['参数列表']}]
             *
             * */
            call(args) {
                // 判断是否数组
                if (Object.prototype.toString.call(args) === '[object Array]') {
                    args.forEach(this.call)
                }
                let share = args['share'], // 共享方法名
                    params = args['params'] || [];// 参数
                return logic && logic[share] && logic[share](...params);
            },
            /**
             * *add
             * @param {Object} obj 对象
             * @return {Object} 接口对象 
             * */
            add(obj) {
                logic = { ...logic, ...obj };
                return this;
            }
        }
    },
    /**
     * *备忘录模式
     * @property cache 缓存器
     * @method add 缓存方法
     * @method get 获取方法
     * todo 缓存的键不能有重复的 否则就替换了
     *  */
    meno: function () {
        // 安全模式
        if (new.target !== $design.meno) return new $design.meno();
        this.cache = new Map();
        this.add = function (key, value) {
            this.cache.set(key, value);
        }
        this.get = function (key) {
            return this.cache.get(key);
        }
        this.has = function (key) {
            return this.cache.has(key);
        }
    },
}