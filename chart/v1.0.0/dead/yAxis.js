
import { color } from "../variable.js"
// 通用属性
export default {
    nameLocation: "end", // 单位位置
    nameTextStyle: { // 单位样式
        color: color,
        // fontSize: "13"
    },
    axisLine: {//轴线
        show: false
    },
    axisTick: {//刻度
        show: false
    },
    axisLabel: {//轴值
        textStyle: {
            color: color,
        }
    },
    // splitArea: {  // 相间条纹 默认为true ，设置在数值轴上
    //     show: false
    // },
    // axisPointer: {// tooltip时候垂直线的颜色 ，设置在数值轴上
    //     type: 'shadow'
    // }
}