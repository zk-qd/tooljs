

export default function (ipx) {
    /**
     * @param {Object} config 
     * 默认全部是1
     * 如果有legend 但是只占一行，那么也是 1
     * 如果有单位 y轴单位 或者x轴 末尾单位，那么就要占2个单元长度
     * @todo containLabel:true 表示axisLabel也包含在这grid内
     *  */
    return function ({ left = 1, right = 1, top = 1, bottom = 1 } = {}) {
        let grid = {
            left: ipx * left,
            right: ipx * right,
            bottom: ipx * bottom,
            top: ipx * top,
            containLabel: true
        }
        return grid;
    }
}