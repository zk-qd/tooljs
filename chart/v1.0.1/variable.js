/*
 * @Author: zk 
 * @Date: 2021-01-15 11:39:15 
 * @Last Modified by: zk
 * @Last Modified time: 2021-01-15 11:41:08
 */
import echarts from 'echarts';

// adapt
import adapt from './adapt';
const {
    realpx,
    resize,
    ipx
} = adapt

// 字体颜色
export const color = '#999';

// 字体大小
export const fontSize = ipx;

/* type=bar 柱状图的宽度 */
export const barWidth = 15;

/* yAxis: {position: 'right'} y轴在右侧 */
export const positionRight = 'right'

/* 值堆叠，如柱状图 折线图堆叠 */
export const stack = "vistors";






/**
 * 获取中心点和半径
 * @param {String} place `left,right,top,bottom,center` 位置
 * !如果place不传参的话，那么进入default，取的全是默认值
 * @param {Array} radius  半径自定义  有默认值
 * @returns {Object} */
export function centerAndRadius(place = ['50%', '50%'], radius = ["0%", "60%"]) {
    switch (place) {
        case 'left':
            return {
                radius,
                center: ['40%', '50%'],
            }
        case 'right':
            return {
                radius,
                center: ['60%', '50%'],
            }
        case 'top':
            return {
                radius,
                center: ['50%', '40%'],
            }
        case 'bottom':
            return {
                radius,
                center: ['50%', '60%'],
            }
        case 'center':
            return {
                radius,
                center: ['50%', '50%'],
            }
        default:
            if (place && place.length == 2)
                return {
                    radius,
                    place,
                }
            else hintError('centerAndRadius', 'place', place);
    }
}
/**
 * todo: 渐变色  图表通用
 * @param {String or Array} color 
 * *为String类型时，取的是具体颜色
 * @param {String or Array} direction
 * *为String是单方向，Array为多方向 [left,right,top,bottom]
 * @returns {Object} 渐变色配置
 * todo： offset0是浅颜色 offset1是深颜色
 *  */
export function gradient(color, direction = 'top') {
    let dirConfig; // 方向配置
    dirConfig = dirToConfig(direction);

    // 颜色
    switch (color) {
        case 'red':
            return generator('#F8CD8B', '#F6957A', '#F35C6A');
        case 'green':
            return generator('#44DED6', '#2BBDD4', '#119AD1');
        case 'blue':
            return generator('#7853FD', '#8E8EFD', '#A5C9FE');
        default: //自定义颜色
            if (color && color.length >= 3)
                return generator(...color);
            else hintError('gradient', 'color', color);

    }


    /**
     * 生成渐变色配置项
     * @param {String} c1 颜色  
     * @param {String} c2 颜色  
     * @param {String} c3 颜色  
     * @return {Object} config 
     * */
    function generator(c1, c2, c3) {
        return {
            itemStyle: {
                color: new echarts.graphic.LinearGradient(...dirConfig, [
                    { offset: 0, color: c1 },
                    { offset: 0.5, color: c2 },
                    { offset: 1, color: c3 }
                ])
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(...dirConfig, [
                        { offset: 0, color: c1 },
                        { offset: 0.7, color: c2 },
                        { offset: 1, color: c3 }
                    ])
                }
            }
        }
    }

    /**
     * a 中的颜色右到左 
     * b 中的颜色左到右
     * c 中的颜色下到上
     * d 中的颜色上到下
     * [向左,向右,向上,向下] 
     * !下不一定是x轴，y轴也有可能，如果y轴为category，那么下就是y轴，由此可知下为柱状图的底部，上为顶部，同理左右为柱状图以底部为基，分别为左侧右侧
     * */
    function dirToConfig(direction) { //算法
        let dirs = ['left', 'right', 'top', 'bottom']
        // 判断是否为数组
        if (!(Object.prototype.toString.call(direction) === '[object Array]')) {
            direction = [direction];
        }
        return dirs.map(item => {
            if (direction.find(citem => citem === item)) return 1;
            else return 0;
        }) // 返回配置，如果不存在那么则返回0，反之返回1  默认 [0,0,1,0] 也就是说下为offset0 上为offset1，左右不参与渐变，如果全部为0，那么全部不参与渐变
    }

}


/**
 * todo: areaStyle用于折线图区域渐变样式
 * @param {String or Array} color
 * *为String类型时，取的是具体颜色
 * @param {String or Array} direction
 * *为String是单方向，Array为多方向 ['left', 'top', 'right', 'bottom']
 * @returns {Object} 渐变色配置
 * todo: 这里颜色offset0 是浅颜色 offset1 是深颜色 默认向上
 * todo: 不需要注意方向，为1的用offset1的颜色，为0的用offset0的颜色
 * * 这个对向同为1或0，这个对向不参与渐变，相当于没有设置颜色一样，
 * * 这个对向相反，这个对向才会有渐变
 * * 这个对向有渐变不会影响另一个对向是否有渐变
 *  */
export function areaStyle(color, direction = 'top') {
    const dir = adapterDir(direction);
    color = adapterColor(color)
    return {
        areaStyle: {
            color: {
                type: 'linear',
                x: dir[0],
                y: dir[1],
                x2: dir[2],
                y2: dir[3],
                colorStops: [{
                    offset: 0, color: color[0] // 0% 处的颜色
                }, {
                    offset: 1, color: color[1] // 100% 处的颜色
                }],
                global: false // 缺省为 false
            }
        }
    }
    // 方向适配
    function adapterDir(direction) { //算法
        const dirs = ['left', 'top', 'right', 'bottom'] // 和gradient的不一样
        // 判断是否为数组
        if (!(Object.prototype.toString.call(direction) === '[object Array]')) {
            direction = [direction];
        }
        return dirs.map(item => {
            if (direction.find(citem => citem === item)) return 1;
            else return 0;
        }) // 返回配置，如果不存在那么则返回0，反之返回1  
    }
    // 颜色适配
    function adapterColor(color) {
        if (typeof color === 'string') {
            return isString(color);
        } else if (color instanceof Array) {
            return isArray(color);
        }
        function isString(color) {
            if (color.length === 4) {
                return [color + '0', color]
            } else if (color.length === 7) {
                return [color + '00', color]
            } else {
                hintError('areaStyle', 'color', color)
            }
        }
        function isArray(color) {
            if (color.length === 1) {
                return isString(color[0])
            } else if (color.length !== 2) {
                hintError('areaStyle', 'color', color)
            }
        }
    }
}



/**
 * todo: 参数错误提示 方法
 * @param {String} fnName 报错的方法名称
 * @param {String} paramName 错误的参数名称
 * @param {String} paramValue 错误的参数值
 *  */
function hintError(fnName, paramName, paramValue) {
    throw TypeError(fnName + '参数传入错误,' + `reason: ${paramName}=` + paramValue.toString());
}




