/**
 * TODO 依赖
 * * $adaptive
 */

// adapt
import adapt from './adapt';
const {
    resize,
    ipx
} = adapt
// variable
import * as variable from './variable'

// general
import tooltip from './general/tooltip'
import axis from './general/axis'
import grid from './general/grid'
import animation from './general/animation'
import dataZoom from "./general/dataZoom";

// category
import pie from './category/pie'
import radar from './category/radar'

// const ipx = Math.floor(adapt.ipx * 12 / 15)/* 15 * 12 / 15  = 12* 之前误解了/;

// decorate
const xAxis = function (params = {}) { return axis({ ...params, type: 'x' }) }
const yAxis = function (params = {}) { return axis({ ...params, type: 'y' }) }

export default {
    // 变量
    resize, // echart内容调整方法事件
    ipx: ipx,
    ipx2: 2 * ipx,
    ipx3: 3 * ipx,
    ipx4: 4 * ipx,
    ipx5: 5 * ipx,
    ...variable,

    // 通用
    tooltip,
    gird: grid(ipx),
    xAxis,
    yAxis,
    animation,
    dataZoom,

    // 分类
    pie,
    radar,
    /*  // xy轴  以及饼图label
     label: ipx,
     // 柱状图宽度
     barW: ipx / 2,
     // 统计字体大小
     legend: ipx,
     // 提示字体大小
     tip: ipx,
     // 饼图中间大小
     pie_c: ipx,
     // 饼图中间字体定位
     pic_t: ipx * 25,
     pic_l: ipx * 31, */
}