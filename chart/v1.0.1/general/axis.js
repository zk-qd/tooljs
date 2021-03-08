
import { color } from "../variable.js"


// 通用属性
export default function axis({
    name, // 单位
    nameLocation = "end",
    axisLabel = {
        rotate: null,// 顺时针 旋转
        interval: null,// 间隔
        unit: null,// 单位
        formatter: null,//格式化
        show: true, // 是否显示标签值
    },
    max,
    min,
    type,// 类型 x y
} = {}) {
    let defaultAxisLabel = {// 轴值
        textStyle: {
            color: color
        },
        interval: axisLabel.interval || 0,// 间隔
        // 单位 添加在值的后面
        formatter: axisLabel.formatter ? axisLabel.formatter : `{value}${axisLabel.unit || ''}`,// 单位
        show: axisLabel.show,
        rotate: function () {
            let defaultRotate = 0;
            if (type == 'x') defaultRotate = 45;
            return axisLabel.rotate || defaultRotate;
        }(), // 顺时针 旋转 // x默认值不同
    }
    return {
        // 单位 添加在值旁边
        name: name,
        nameLocation: nameLocation, // 单位位置
        nameTextStyle: { // 单位样式
            color: color,
            // fontSize: "13",
        },
        axisLabel: defaultAxisLabel,
        axisTick: { // 刻度
            show: false
        },
        axisLine: { // 轴线
            show: false
        },
        min, // 轴最小值
        max, // 轴最大值
        // splitArea: {  // 相间条纹 默认为true ，设置在数值轴上
        //     show: false
        // },
    }
}


/**
 * axis属性
 * 
 * name系列： 单位
 * - 名称
 * - 位置
 * - 样式
 * 等等
 * 
 * axisLabel系列： 轴值
 * - 样式
 * - 其他配置
 * 
 * axisLine系列： 轴线
 * 
 * axisTick系列： 轴刻度
 * 
 * splitArea系列： 区域分割
 * 
 * 
 */





