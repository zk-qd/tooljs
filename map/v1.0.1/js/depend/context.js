export default class Context {
    static STATE = 'unstart' // unstart 初始值 starting 已开始 success 成功 error 结束  
    static MODE = 'lazy' // 加载模式 'lazy' or 'hungry' 默认 lazy 作用是加快地图显示，之后的性能可能用的更多
    // 中心点
    static CENTER(type) {
        const center = {
            default: null,
            长沙县: [113.08081, 28.24615],
            长沙市: [112.938888, 28.228272],
        }
        center[type];
    }
    // 主题
    static THEME(type) {
        const theme = {
            default: 'amap://styles/normal',
            tocc: 'amap://styles/2e77546dafb78229c439e72882973302',
        }
        return theme[type];
    }
    // key
    static KEY(type) {
        const key = {
            default: 'a1aba2049ce8ef3ed0dd419dd839b4bb',
            tocc: 'a1aba2049ce8ef3ed0dd419dd839b4bb',
        }
        return key[type];
    }
    // 版本
    static VERSION(type) {
        const version = {
            default: '1.4.14',
        }
        return version[type];
    }
}