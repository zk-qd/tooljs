
// 对象相关类
window.$object = {
    /**
     * @description 深拷贝
     * @param {} target 目标
     * @return {}
     * @todo 适用于简单数组和对象，不支持类似dom复杂对象
     */
    deepCopy: function (target) {
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
            // 保持原型  不然会转成对象
            copy = target.valueOf();
        }
        return copy;
    },
    /**
     * @description 构造函数混入
     * @param  {...any} mixins 
     * @return {object} 混入对象 
     */
    mixin(...mixins) {
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
    },
    /**
     * @description 通过属性获取对象属性值
     * @param {object} target
     * @param {string} propstring
     * @return {*} 返回获取的属性值
     * @todo valueAt(AMap,'TileLayer.RoadNet');
     */
    valueAt(target, propstring) {
        let propArray = propstring.split('.');
        return propArray.reduce((object, prop) => {
            return object[prop]
        }, target);
    }
}



