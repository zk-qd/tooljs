var $targetect = {
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
}



