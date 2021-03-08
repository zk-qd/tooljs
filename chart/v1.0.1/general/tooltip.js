/*
 * @Author: zk 
 * @Date: 2021-01-14 18:14:07 
 * @Last Modified by: zk
 * @Last Modified time: 2021-02-26 10:35:23
 */
/**
 * @param {String} trigger `axis,item`
 * @param {String or Array} unit 单位  (如果单位全部是一样的，那么就是String，如果单位不一样那么就要数组了)
 * @param {Function} formatAxisValue 作用是格式化axisValue的值（使用场景： 如果axisValue需要显示和label标签值不一样的时候用到）
 * @param {Function} formatSeriesValue 同上
 * @returns {Object} tooltip 
 * 格式: axisValue(类别名称 type=category的值) <br /> 颜色(span) seriesName(系列名称): value(seriesValue type=value的值)
 * */
export default function ({ trigger = 'axis', unit = '', formatAxisValue, formatSeriesValue } = {}) {
    // line bar
    if (trigger === 'axis') {
        return {
            trigger: "axis",
            axisPointer: { // 交叉显示
                type: "cross"
            },
            padding: [5, 10],
            /*
                可以给最终结构也可以给这种模板'{b}<br>{a}:{c}'
                如果给的模板echarts也还是将元素以及值通过模板拼接起来的，
            */
            formatter(config) {
                return config.reduce((t, v, i) => {
                    // 获取颜色
                    let color, container = document.createElement('div'), marker = v.marker, markerDom, type = Object.prototype.toString.call(v.color);
                    // 颜色类型  
                    if (type === "[object String]") {
                        color = v.color // 普通颜色
                    } else if (type === "[object Object]") {
                        // 渐变色
                        color = v.color.colorStops.reduce((ct, cv) => {
                            ct = ct + cv.color;
                            ct = ct + ' ';
                            ct = ct + cv.offset * 100 + '%';
                            ct = ct + ','
                            return ct;
                        }, 'linear-gradient(to right,').replace(/,$/, ')');
                    }
                    container.insertAdjacentHTML('afterBegin', marker);
                    markerDom = container.children[0]
                    markerDom.style.background = color;
                    if (i === 0) {
                        // type: category 的轴的值
                        let value = formatAxisValue ? formatAxisValue(v.axisValue) : v.axisValue;
                        t.push(value);
                        t.push(`<br />`);
                    }
                    t.push(markerDom.outerHTML);
                    // legend
                    t.push(v.seriesName + ": ");
                    // type: value 的轴的值
                    {
                        let value = formatSeriesValue ? formatAxisValue(v.value) : v.value;
                        if (typeof unit === 'string')
                            t.push(value + unit); //unit是String
                        else if (Object.prototype.toString.call(unit) === '[object Array]')
                            t.push(value + unit[i]); // unit是Array
                    }
                    t.push(`<br />`);
                    return t;
                }, []).join('').trim();
            }
        }
    }
    // pie
    else if (trigger === 'item') {
        return {
            trigger: 'item',
            formatter: `{b}: {c}${unit} ({d}%)`
        }
    }
}

/*
模板变量有 {a}, {b}，{c}，{d}，{e}，分别表示系列名，数据名，数据值等。 在 trigger 为'axis' 的时候，会有多个系列的数据，此时可以通过{a0}, {a1}, {a2} 这种后面加索引的方式表示系列的索引。 不同图表类型下的{a}，{b}，{c}，{d}含义不一样。 其中变量{a}, {b}, {c}, {d}在不同图表类型下代表数据含义为：

u 折线（区域）图、柱状（条形）图、K线图: {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）

u 散点图（气泡）图 : {a}（系列名称），{b}（数据名称），{c}（数值数组）, {d}（无）

u 地图 : {a}（系列名称），{b}（区域名称），{c}（合并数值）, {d}（无）

u 饼图、仪表盘、漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）


seriesName: 系列名称
axisValue: 类目值，因为类别值都是写在axis中，因此以axis开头
seriesValue: 数值 因为数值都是写在series中，因此以series开头

*/