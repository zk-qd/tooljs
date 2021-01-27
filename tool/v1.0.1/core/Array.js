

var $array = {
    /**
     * todo 简单排序
     * * 无key 类似target = [1,2,3]
     * * 有key 类似target = [{age: 10},{age: 20}]
     * @param {Array} target 目标数组
     * @param {String} type 升序or降序  up or down
     * @param {String} key 比较的key
     *  */
    sort(target, type = 'up', key) {
        target.sort((value1, value2) => {
            if (type == 'down') [value2, value1] = [value1, value2] // 降序
            if (key) {
                // 有key比较key的值
                return value1[key].toString().localeCompare(value2[key].toString());
            } else {
                // 无key直接比较
                return value1.localeCompare(value2);
            }
        });
    },
}
