// 图层类
// 图层一般不需要插件
// 注：addLayer，添加图层获取返回的图层，直接就可以调用方法 移除 显示 隐藏，一般还是建议走这里的方法
export default class Layer {
    static LAYER = {
        TileLayer: {
            describ: '标准图层', // 描述
            target: null, // 图层对象
            options: {}, // 配置
        },
        'TileLayer.Satellite': {
            describ: '卫星图层',
        },
        'TileLayer.RoadNet': {
            describ: '路网图层'
        },
        'TileLayer.Traffic': {
            describ: '实时交通图层', // 有实时路况
        },
        'Buildings': {
            describ: '楼块图层'
        },
        'IndoorMap': {
            describ: '室内地图'
        },
        // 瓦片
        'TileLayer.WMS': {
            describ: 'wms图层',
        },
        'TileLayer.WMTS': {
            describ: 'wmts图层',
        }
    }
    constructor() { }
    /**
     * @param {string} className 图层类名
     * @param {options} 图层配置
     * @returns {layer} 图层
     */
    addLayer(className, options) {
        let layer = getLayer(className);
        if (!layer.target)
            layer.target = new $object.valueAt(KMap.AMap, className)(Object.assign(layer.options, options));
        layer.target.setMap(this.$map);
        return layer.target;
    }
    /**
     * @param {string} className 图层类名
     * @returns {*} 图层 or false
     */
    rmLayer(className) {
        let layer = getLayer(className);
        if (layer.target) {
            layer.target.setMap(null);
            return layer.target; // 移除成功
        } else {
            return false;// 移除失败
        };
    }
    showLayer(className) {
        let layer = getLayer(className);
        if (layer.target) {
            layer.target.show()
            return layer.target; // 显示成功
        } else {
            return false;// 显示失败
        };
    }
    hideLayer(className) {
        let layer = getLayer(className);
        if (layer.target) {
            layer.target.hide()
            return layer.target; // 隐藏成功
        } else {
            return false;// 隐藏失败
        };
    }
}

function getLayer(className) {
    let layer = this.LAYER[className];
    if (!layer) throw new TypeError('不存在该图层', className);
    return layer;
}


/*
通用属性
map	Map	要显示该图层的地图对象
zIndex	Number	图层叠加的顺序值，0表示最底层，默认zIndex：2
opacity	Float	图层的透明度，取值范围[0,1]，1代表完全不透明，0代表完全透明
zooms	Array	支持的缩放级别范围，默认范围为[3,18],取值范围[3-18]
detectRetina	Boolean	是否在高清屏下进行清晰度适配，默认为false。
将根据移动设备屏幕设备像素比，采用相应的技术手段，保证图层在不同设备像素比下的清晰度。


标准图层的切片属性
tileSize：	Number	切片大小，取值：
256，表示切片大小为256*256，
128，表示切片大小为128*128，
64，表示切片大小为64*64。默认值为256
tileUrl： String	切片取图地址(自1.3版本起，该属性与getTileUrl属性合并)
如：'https://abc.amap.com/tile?x=[x]&y=[y]&z=[z]'
[x]、[y]、[z]分别替代切片的xyz。
errorUrl	String	取图错误时的代替地址
getTileUrl	String/Function(x,y,z)	获取图块取图地址，该属性值为一个字符串或者一个函数
字符串如：'https://abc.amap.com/tile?x=[x]&y=[y]&z=[z]'
函数参数z为地图缩放级别，x,y分别为相应缩放级别下图块横向、纵向索引号，
该属性可以用来改变取图地址，实现自定义栅格图。
*/