
import {color} from "../variable.js"
// 通用属性
export default {
    axisLabel: {// 轴值
        textStyle: {
            color: color
        },
        interval: 0,
        // 顺时针
        rotate: 45
    },
    axisTick: { // 刻度
        show: false
    },
    axisLine: { // 轴线
        show: false
    },
    // splitArea: {  // 相间条纹 默认为true ，设置在数值轴上
    //     show: false
    // },
    // axisPointer: {// tooltip时候垂直线的颜色 ，设置在数值轴上
    //     type: 'shadow'
    // }
}