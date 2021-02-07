
// 地图异常类
export default class MapError extends Error {
    constructor(message, location = '') {
        super();
        this.name = 'MapError';
        this.message = message;
        // Map.js:104 Uncaught MapError:selector[object HTMLDivElement]element is not undefiend
        this.stack = this.name + ': \n' + this.message + location;
    }
    // plugin
    static pluginExeception() {
        throw new MapError('Please pass in the correct one "plugin"', '\nloader');
    }
    // 地图容器错误
    static containerExeception(id) {
        throw new MapError(`id:${id}不存在,或者容器还未挂载`);
        throw new MapError('selector "#' + id +
            '" element is not undefiend', '\nbuild map fail')
    }
}
