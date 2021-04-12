//Array.js

window.$array = {sort(target, type = 'up', key) {
        target.sort((value1, value2) => {
            if (type == 'down') [value2, value1] = [value1, value2]
            if (key) {
                return value1[key].toString().localeCompare(value2[key].toString());
            } else {
                return value1.localeCompare(value2);
            }
        });
    },withinScope(scope, target, right = true, left = true) {
        if (!scope) return false;
        target = Number(target);
        let [first, last] = scope, result;
        if (right && left) result = first <= target && target <= last;
        else if (!right && left) result = first <= target && target < last;
        else if (right && !left) result = first < target && target <= last;
        else if (!right && !left) result = first < target && target < last;
        return result;
    },toArray(o) {
        if (!(o instanceof Array)) return [o];
        else return o;
    },

}

//Check.js
window.$check = {
    isNativeFunction(fn) {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
    },isObject(val) {
        return Object == val.constructor;
    },isPromise(obj) {
        return 'function' == typeof obj.then;
    },isGenerator(obj) {
        return 'function' == typeof obj.next && 'function' == typeof obj.throw;
    },isGeneratorFunction(obj) {
        var constructor = obj.constructor;
        if (!constructor) return false;
        if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
        return isGenerator(constructor.prototype);
    },
}
//Date.js


function adaptDate(date) {
    if (!date) date = new Date();
    else if (date.toString().length == 8) date = new Date(date.replace(/(?<year>\d{4})(?<month>\d{2})(?<day>\d{2})/, '$<year>/$<month>/$<day>'));
    else date = new Date(date);
    return date;
}
window.$date = {format(date, format = 'yyyy-MM-dd') {
        date = adaptDate(date);
        const list = [
            { match: 'yyyy', val: date.getFullYear() },
            { match: 'MM', val: fillZore(date.getMonth() + 1) },
            { match: 'M', val: date.getMonth() + 1 },
            { match: 'dd', val: fillZore(date.getDate().toString()) },
            { match: 'd', val: date.getDate().toString() },
            { match: 'HH', val: fillZore(date.getHours().toString()) },
            { match: 'H', val: date.getHours().toString() },
            { match: 'hh', val: fillZore(hour12()) },
            { match: 'h', val: hour12() },
            { match: 'mm', val: fillZore(date.getMinutes().toString()) },
            { match: 'm', val: date.getMinutes().toString() },
            { match: 'ss', val: fillZore(date.getSeconds().toString()) },
            { match: 's', val: date.getSeconds().toString() },
            { match: 'WW', val: fillZore(week().toString()) },
            { match: 'W', val: week().toString() },
            { match: 'A', val: apm('Upper') },
            { match: 'a', val: apm('Lower') },
            { match: 'timestamp', val: date.getTime() },
        ]
        for (let i = 0, length = list.length; i < length; i++) {
            const item = list[i];
            const reg = new RegExp(item.match);
            format = format.replace(reg, item.val);
        }
        return format;
        function hour12() {
            let hour = date.getHours();
            hour = hour > 12 ? hour - 12 : hour;
            return hour.toString();
        }
        function apm(cases) {
            let hour = date.getHours(),
                temp = hour > 12 ? 'pm' : 'am';
            return temp['to' + cases + 'Case']()
        }
        function week() {
            let w = date.getDay();
            return w == 0 ? 7 : w;
        }
        function fillZore(value) {
            return value.toString().padStart(2, '0')
        }
    },days(date) {
        date = adaptDate(date);
        let year = date.getFullYear(),
            month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    },datetime(date, time) {
        date = adaptDate(date);
        time = adaptDate(time);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
    },interval: function (date, type = 'day') {
        date = adaptDate(date);
        let year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();
        switch (type) {
            case 'year':
                return {
                    begin: new Date(year, 0, 1),
                    end: new Date(year, 11),
                };
            case 'month':
                return {
                    begin: new Date(year, month),
                    end: new Date(year, month + 1, 0),
                };
            case 'day':
                return {
                    begin: new Date(year, month, day, 0, 0, 0),
                    end: new Date(year, month, day, 23, 59, 59),
                };
            case 'hour':
                return {
                    begin: new Date(year, month, day, hour, 0, 0),
                    end: new Date(year, month, day, hour, 59, 59),
                };
            case 'minute':
                return {
                    begin: new Date(year, month, day, hour, minute, 0),
                    end: new Date(year, month, day, hour, minute, 59),
                };
        }
    },distance(count = 0, type = 'day') {
        let year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();
        const states = {
            year: () => {
                return new Date(year + count, month, day);
            },
            month: () => {
                return new Date(year, month + count, day);
            },
            day: () => {
                return new Date(year, month, day + count);
            },
        }
        return states[type];
    },currents(type = 30) {
        let date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth();
        const state = {
            _12() {
                return '.'.repeat(11).split('.').map((item, index) =>
                    $date.format(new Date(year, index + 1), 'yyyy-MM'));
            },
            _30() {
                return '.'.repeat($date.days(date) - 1).split('.').map((item, index) =>
                    $date.format(new Date(year, month, index + 1), 'yyyy-MM-dd')
                )
            },
            _24() {
                return '.'.repeat(23).split('.').map((item, index) => index.toString().padStart(2, '0') + ':00')
            },
            _48() {
                return this._24().flatMap(item => [item, item.replace(/:00/, ':30')]);
            }
        }
        return state['_' + type]();
    },recents(sum, type = 'day', format) {
        let current = new Date(),
            year = current.getFullYear(),
            month = current.getMonth(),
            day = current.getDate(),
            recents = [];
        const states = {
            year: (i) => {
                return $date.format(new Date(year - i, month, day), format || "yyyy");
            },
            month: (i) => {
                return $date.format(new Date(year, month - i, day), format || 'yyyy-MM');
            },
            day: (i) => {
                return $date.format(new Date(year, month, day - i), format || "yyyy-MM-dd");
            },
        }
        let state = states[type];
        for (let i; i <= sum; i++) recents.push(state(i));
        return recents;
    },realtime() {
        let year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();
        return {
            year,
            month,
            day,
            hour,
            minute,
            second,
        }
    }
}
//Design.js

window.$design = {observer: function () {
        if (new.target !== $design.observer) { return new $design.observer() }
        const list = {};
        this.on = function (type, fn) {
            !list[type] && (list[type] = new Set());
            list[type].add(fn)
            return this;
        }
        this.emit = function (type, args, async = true) {
            let event = { type: type, params: args }
            run(() => { list[type] && list[type].forEach(fn => fn.call(undefined, event)) });
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
    },state: function (states) {
        if (new.target !== $design.state) { return new $design.state(states) }
        let currentState = {};
        let constrol = {
            change(...args) {
                let i = 0, len = args.length;
                currentState = {};
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
    },command: function (command = {}) {
        if (new.target !== $design.command) return new $design.command(command);
        return {execute(args) {
                if (Object.prototype.toString.call(args) === '[object Array]') {
                    args.forEach(this.execute)
                }
                let cmd = args['cmd'],
                    params = args['params'] || [];
                if (!(params instanceof Array)) {
                    params = [params];
                }
                return command && command[cmd] && command[cmd](...params);
            }
        }
    },flyweight: function (logic = {}) {
        if (new.target !== $design.flyweight) return new $design.flyweight(logic);
        return {call(args) {
                if (Object.prototype.toString.call(args) === '[object Array]') {
                    args.forEach(this.call)
                }
                let share = args['share'],
                    params = args['params'] || [];
                return logic && logic[share] && logic[share](...params);
            },add(obj) {
                logic = { ...logic, ...obj };
                return this;
            }
        }
    },meno: function () {
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
//Dom.js

window.$dom = {
    copyText(dom) {
        return new Promise((resolve, reject) => {
            try {
                if (document.body.createTextRange) {
                    let range = document.body.createTextRange();
                    range.moveToElementText(dom);
                    range.select();
                } else if (window.getSelection) {
                    let selection = window.getSelection();
                    let range = document.createRange();
                    range.selectNodeContents(dom);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                document.execCommand("copy");
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    },adaptImgCover({
        width,
        height,
        url,
    }) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = url;
            img.onload = function () {
                resolve(adapt(img));
            }
            img.onerror = reject;
        })
        function adapt(img) {
            let w = img.width,
                h = img.height,
                zoomW = width,
                zoomH = h * width / w;
            if (zoomH < height) zoomH = height;
            img.width = zoomW;
            img.height = zoomH;
            return img;
        }
    },
    

}
//Encrypt.js

window.$encrypt = {idnumber(val) {
        if (!val) return val;
        return val.toString().replace(/(\d{3})\d{11}(\d{4}|\d{3}[A-Z]{1})/, "$1" + "*".repeat(11) + "$2");
    }
}
//Form.js

var FormKit_Message = {
    ['form-notExist']: 'The form doesn\'t exist',
}


window.$form = {
    ...FormKit_Message,
    getForm({ formSel, prefix } =ErrorKit.emptyParameterException()) {
        var form = document.querySelector(formSel);
        if (!form) return FormKit_Message['form-notExist'];
        var data = form.serializeArray();
        if (prefix) {
            data = data.reduce((total, item) => {
                total[item.name.substr(1, item.name.length)] = item.value;
                return total;
            }, {});
        } else {
            data = data.reduce((total, item) => {
                total[item.name] = item.value;
                return total;
            }, {});
        }
        return data;
    },
    setForm({ formSel, prefix, params } =ErrorKit.emptyParameterException()) {
        const form = document.querySelector(formSel);
        if (!form) return FormKit_Message['form-notExist'];
        let ele;
        for (var key in params) {
            if (prefix) ele = form.querySelector('[name=' + prefix + key + ']');
            else ele = form.querySelector('[name=' + key + ']');
            if (ele) ele.value = params[key];
        }
    },toFormData(data) {
        let type = Object.prototype.toString.call(data);
        switch (type) {
            case "[object Object]":
                return Object.entries(data).reduce((t, v) => {
                    Reflect.apply(t.append, t, v);
                    return t;
                }, new FormData());
            case "[object Array]":
                return Object.entries(data).reduce((t, v) => {
                    Reflect.apply(t.append, t, v);
                    return t;
                }, new FormData());
        }
    }
};
//Http.js


var HttpKit_Judge = {

}
var HttpKit_Uri = {
    query2string(...params) {
        params = params.reduce((total, item) => ({ ...total, ...item }), {})
        var querystring = '';
        if (params) {
            for (let key in params) {
                querystring += key + '=' + params[key];
                querystring += '&';
            }
            if (querystring.match(/&$/g)) querystring = querystring.slice(0, querystring.length - 1);
            return querystring;
        }
    },
    uri3query(uri, ...params) {
        var querystring = this.query2string(...params);
        uri.indexOf('?') == -1 ? uri += '?' + querystring : uri += querystring;
        return uri;
    },
    clear1void(obj) {
        for (let key in obj) {
            let value = obj[key]
            if (value == undefined) delete obj[key];
        }
        return obj;
    },
    clear1allVoid(obj) {
        for (let key in obj) {
            let value = obj[key]
            if (value == undefined || value === '') delete obj[key];
        }
        return obj;
    },
    clear1assignVoid(obj, assign = [], filter = 'clear1allVoid') {
        obj = this[filter](obj);
        for (let key in obj) {
            var value = obj[key];
            assign.forEach(item => {
                if (value === item) delete obj[key];
            });
        }
        return obj;
    }
}

window.$http = {
    ...HttpKit_Judge,
    ...HttpKit_Uri,
}

//Math.js

window.$math = {
    add(arg1, arg2) {
        let r1, r2, m;
        try {
            r1 = arg1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    },
    subtract(arg1, arg2) {
        let r1, r2, m, n;
        try {
            r1 = arg1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        n = r1 >= r2 ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(2);
    },
    multiply(arg1, arg2) {
        let m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split('.')[1].length;
        } catch (e) { }
        try {
            m += s2.split('.')[1].length;
        } catch (e) { }
        return (
            (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
            Math.pow(10, m)
        );
    },
    divide(arg1, arg2) {
        let t1 = 0,
            t2 = 0,
            r1,
            r2;
        try {
            t1 = arg1.toString().split('.')[1].length;
        } catch (e) { }
        try {
            t2 = arg2.toString().split('.')[1].length;
        } catch (e) { }
        r1 = Number(arg1.toString().replace('.', ''));
        r2 = Number(arg2.toString().replace('.', ''));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    },
    randomScope(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    randomCoding(n) {
        let database = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            text = [];
        database.push(...database.map(item => item.toLowerCase()));
        for (var i = 0; i < n; i++) {
            text.push(database[Math.floor(Math.random() * 48)]);
        }
        return text.join('');
    },
    random() {
        let timestamp = Date.now();
        return this.randomCoding(8) + timestamp;
    },randomArray(len, min, max) {
        return '.'.repeat(len - 1).split('.').map(item => this.randomScope(min, max));
    },
    rgbtohex(rgb) {
        let { r, g, b } = rgb.match(/rgb\(\s*(?<r>\d*),\s*(?<g>\d*),\s*(?<b>\d*)\)/).groups;
        r = Number(r).toString(16).padStart(2, 0);
        g = Number(g).toString(16).padStart(2, 0);
        b = Number(b).toString(16).padStart(2, 0);
        return '#' + r + g + b;
    },
    hextorgb(hex) {
        if (hex.length == 4 || hex.length == 7) {
            let len = (hex.length - 1) / 3;
            return 'rgb(' + hex.replace(/#/, '').match(new RegExp(`[0-9A-z]{${len}}`, 'g'))
                .map(item => parseInt(item.repeat(len == 1 ? 2 : 1), 16)).reduce((t, v, i) => {
                    return t + ',' + v
                }) + ')';
        } else {
            throw new TypeError('hex type error! ' + hex)
        }
    },toFixed(num, len) {
        num = num.toString();
        let index = num.indexOf('.');
        if (index !== -1) {
            num = num.substring(0, len + index + 1)
        } else {
            num = num.substring(0)
        }
        return parseFloat(num);
    }
}

//Object.js

window.$object = {deepCopy: function (target) {
        var copy;
        if (toString.call(target) === '[object Object]') {
            copy = {};
            for (var key in target) {
                copy[key] = this.deepCopy(target[key]);
            };
        } else if (toString.call(target) === '[object Array]') {
            copy = [];
            for (var [i, v] of target.entries()) {
                copy[i] = this.deepCopy(target[i]);
            }
        } else {
            copy = target.valueOf();
        }
        return copy;
    },mixin(...mixins) {
        class Mix {
            constructor() {
                for (let mixin of mixins) {
                    copyProperties(this, new mixin());
                }
            }
        }
        for (let mixin of mixins) {
            copyProperties(Mix, mixin);
            copyProperties(Mix.prototype, mixin.prototype);
        }
        function copyProperties(target, source) {
            for (let key of Reflect.ownKeys(source)) {
                if (key !== 'constructor'
                    && key !== 'prototype'
                    && !(key === 'name' && typeof source === 'function')
                    && !(key === 'length' && typeof source === 'function')
                ) {
                    let desc = Object.getOwnPropertyDescriptor(source, key);
                    Object.defineProperty(target, key, desc);
                }
            }
        }
        return Mix;
    },valueAt(target, propstring) {
        let propArray = propstring.split('.');
        return propArray.reduce((object, prop) => {
            return object[prop]
        }, target);
    }
}




//Tool.js

window.$tool = {debounce(handler, delay = 400, immediate = false) {
        let timer = null, cancel;
        return function (...args) {
            let content = this;
            if (timer) clearTimeout(timer);
            return new Promise((resolve, reject) => {
                if (immediate) immediate = true, execute();
                else timer = setTimeout(execute, delay);
                function execute() {
                    if (cancel) cancel("请勿频繁操作");
                    cancel = reject;
                    resolve(handler.apply(content, args))
                }
            }).catch(console.warn);
        }
    },throttle(handler, delay = 400, immediate = false) {
        let timer = null, cancel,
            startTime = Date.parse(new Date());
        return function (...args) {
            let context = this,
                curTime = Date.parse(new Date()),
                remaining = delay - (curTime - startTime);
            if (timer) clearTimeout(timer);
            return new Promise((resolve, reject) => {
                if (immediate || remaining <= 0) execute();
                else timer = setTimeout(handler, remaining);
                function execute() {
                    if (cancel) cancel('等待中');
                    cancel = reject, startTime = Date.parse(new Date());
                    resolve(handler.apply(context, args));
                }
            }).catch(console.warn)
        }
    },afterperform(callback, condition = function () { return true }, delay = 400) {
        if (typeof condition == 'function' ? condition() : condition) {
            callback();
        } else {
            setTimeout(() => {
                $object.afterperform(callback, condition, delay)
            }, delay)
        }
    },fileInfo(url) {
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
            url,
            suffix,
            name,
            type,
        }
    }
}
//Validate.js

window.$validate = {
  
}
