/*
 * @Author: zk 
 * @Date: 2021-01-14 09:33:02 
 * @Last Modified by: zk
 * @Last Modified time: 2021-01-15 17:58:32
 */



/**
 * 
 * @param {*} startValue 开始值 取的是series的值
 * @param {*} endValue  结束值 取的是series的值
 * @param {String} type 默认值inside在里面
 */
export default function ({
    startValue = "",
    endValue = "",
    type = "inside"
} = {}) {
    return [
        {
            startValue: startValue.toString(),//注意echarts会传入的数值转成string类型，而dataZoom则不会自动转，并且还是全等匹配，因此这里需要手动转下
            endValue: endValue.toString(),
        },
        {
            type,
        }
    ]
}
