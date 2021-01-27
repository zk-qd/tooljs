
import { color } from '../variable';
export default {
    /**
     * 饼图的字体显示方式
     * @param {String} position 显示位置
     * @param {String} formatter 显示格式 
     * @returns {Object} 配置属性 
     * */
    label: function ({ position = 'inner', formatter = '{b}' } = {}) {
        return {
            label: {
                normal: {
                    position: position,
                    show: true,
                    formatter: formatter,
                    // 字体样式
                    textStyle: {
                        // 如果是内部 
                        color: position == 'inner' ? '' : color,
                    }
                },
                labelLine: {
                    normal: {
                        // inner不需要 线
                        show: position == 'inner' ? false : true,
                    }
                },
            },
        }
    },
}