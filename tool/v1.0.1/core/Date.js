

function adaptDate(date) {
    if (!date) date = new Date();
    else if (date.toString().length == 8) date = new Date(date.replace(/(?<year>\d{4})(?<month>\d{2})(?<day>\d{2})/, '$<year>/$<month>/$<day>')); // 20201010 格式
    else date = new Date(date);
    return date;
}

// 时间操作相关类
window.$date = {
    /**
     * @description 格式化时间
     * @param {Any} date 任意能够转时间的数据
     * @param {String} format 模板格式
     * @return {String} 时间 
     *  */
    format(date, format = 'yyyy-MM-dd') {
        date = adaptDate(date);
        // 注意月份是 MM 分钟是mm ，只有h和a既有大写又有小写，单个字母不补零
        const list = [
            { match: 'yyyy', val: date.getFullYear() }, // 年份
            { match: 'MM', val: fillZore(date.getMonth() + 1) }, // 月份 补零
            { match: 'M', val: date.getMonth() + 1 }, // 月份 不补零
            { match: 'dd', val: fillZore(date.getDate().toString()) }, // 天 补零
            { match: 'd', val: date.getDate().toString() }, // 天 不补零
            { match: 'HH', val: fillZore(date.getHours().toString()) }, // 小时 24制 补零
            { match: 'H', val: date.getHours().toString() }, // 小时 24制 不补零
            { match: 'hh', val: fillZore(hour12()) }, // 小时 12制 补零
            { match: 'h', val: hour12() }, // 小时 12制 不补零
            { match: 'mm', val: fillZore(date.getMinutes().toString()) }, // 分钟 补零
            { match: 'm', val: date.getMinutes().toString() }, // 分钟 不补零
            { match: 'ss', val: fillZore(date.getSeconds().toString()) }, // 秒 补零
            { match: 's', val: date.getSeconds().toString() }, // 秒 不补零
            { match: 'WW', val: fillZore(week().toString()) }, // AM or PM
            { match: 'W', val: week().toString() }, // am or pm
            { match: 'A', val: apm('Upper') }, // AM or PM
            { match: 'a', val: apm('Lower') }, // am or pm
            { match: 'timestamp', val: date.getTime() }, // am or pm
        ]
        for (let i = 0, length = list.length; i < length; i++) {
            const item = list[i];
            const reg = new RegExp(item.match);
            format = format.replace(reg, item.val);
        }
        return format;
        // 24小时转12小时制
        function hour12() {
            let hour = date.getHours();
            hour = hour > 12 ? hour - 12 : hour;
            return hour.toString();
        }
        // 判断上午还是下午
        function apm(cases) {
            let hour = date.getHours(),
                temp = hour > 12 ? 'pm' : 'am';
            return temp['to' + cases + 'Case']()
        }
        // 周 1234560 => 1234567
        function week() {
            let w = date.getDay();
            return w == 0 ? 7 : w;
        }
        // 补零
        function fillZore(value) {
            return value.toString().padStart(2, '0')
        }
    },
    /**
     * @description 获取一个月的天数
     * @param {Any} date 传入时间 格式可以被new Date转化就行了
     * @returns {Number} 返回的是一个月的天数
     * @todo monthOfdays
     */
    days(date) {
        date = adaptDate(date);
        let year = date.getFullYear(),
            month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    },
    /**
     * @description 通过时间和日期组合成date对象
     * @param {*} date 日期
     * @param {*} time 时间
     * @return {date} 时间对象
     */
    datetime(date, time) {
        date = adaptDate(date);
        time = adaptDate(time);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
    },

    /**
   * @description 根据某分,某小时，某日，某月，某年获取时间段 
   * @param {*} date 
   * @returns {date} {begin: new Date,end: new Date} 
   * @param {string} type minute,hour,day,month,year
   * @returns {begin,end} 返回的是两个时间段
   * */
    interval: function (date, type = 'day') {
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
    },
    /**
    * @description 距离当天的时间
    * @param {number} count 间隔多少天
    * @todo count的值可为正负  为正则获取 未来日期  为负则获取 过去日期
    * @param {string} 类型
    * @return {date} 返回时间对象
    * // @param {number} h 小时 当天几点,默认当前小时，而一般插件取的都是0点
    * // @todo h的值 => [undefined,0,8]
    * */
    distance(count = 0, type = 'day') {
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
    },
    /**
     * @description 获取当前时间的集合
     * @param {string} type 类型 
     * @returns {array} 时间集合
     * @todo 场景: echarts
     */
    currents(type = 30) {
        let date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth();
        const state = {
            _12() { // 12个月
                return '.'.repeat(11).split('.').map((item, index) =>
                    $date.format(new Date(year, index + 1), 'yyyy-MM'));
            },
            _30() { // 一个月所有天
                return '.'.repeat($date.days(date) - 1).split('.').map((item, index) =>
                    $date.format(new Date(year, month, index + 1), 'yyyy-MM-dd')
                )
            },
            _24() { // 24 小时
                return '.'.repeat(23).split('.').map((item, index) => index.toString().padStart(2, '0') + ':00')
            },
            _48() { // 48 
                return this._24().flatMap(item => [item, item.replace(/:00/, ':30')]);
            }
        }
        return state['_' + type]();
    },
    /**
     * @description 获取近n天，月，年。集合
     * @param {number} sum 数量
     * @param {string} type 类型 
     * @param {string} format 格式模板
     * @returns {array} 时间集合
     * @todo 场景： echart的近xx
     */
    recents(sum, type = 'day', format) {
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
    },
    /**
     * @description 实时时间
     * @returns {*}
     */
    realtime() {
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