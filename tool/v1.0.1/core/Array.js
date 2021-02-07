
// 数组操作相关类
window.$array = {
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
    /**
     * @description 判断target数值是否在数组范围内
     * @param {array} scope 范围数组 如 [1,10] 
     * @param {number} target 数字
     * @param {boolean} right 右边界 是否包含有边界
     * @param {boolean} left 左边界
     * 
     */
    withinScope(scope, target, right = true, left = true) {
        if (!scope) return false;
        target = Number(target);
        let [first, last] = scope, result;
        if (right && left) result = first <= target && target <= last;
        else if (!right && left) result = first <= target && target < last;
        else if (right && !left) result = first < target && target <= last;
        else if (!right && !left) result = first < target && target < last;
        return result;
    }

}
