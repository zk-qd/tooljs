// 覆盖物类
/**
 * zIndex： 
 * 图层100-200
 * 多边形200-300
 * 连线300-400
 * 点标记 400-500
 * 弹窗900-1000
 * 
 */
export default class Overlay {
    /**
   * 创建点标记
   * options = {width,height,image} 
   * kmap.createMarker({...KMap.MARKER_SIZE('position'),image: KMap.MARKER_IMAGE('default')})
   * 扩展需要在size和image中添加，
   */
    overlay(type, ...args) {
        return this['create' + type](...args);
    }
    createMarker(options) {
        let size = KMap.MARKER_SIZE('position');
        let w = options.width || size.width;
        let h = options.height || size.height;
        let image = options.image || KMap.MARKER_IMAGE('default');
        let default_options = {
            offset: this.createPixel(-w / 2, -h),
            icon: this.createIcon({
                image: image, // 图片
                imageSize: this.createSize(w, h), // 背景图片大小
                size: this.createSize(w, h), // 容器大小
                // imageOffset: sprite图
            }),
            zIndex: 400,
        };
        return new KMap.AMap.Marker(Object.assign(default_options, options));
    }
    /**
     * 点标记工厂
     * @param {*} type 产出类型
     * @param {*} options 扩展配置
     */
    createMarkerFactory(type = 'default', options = {}) {
        let default_options = {};
        switch (type) {
            case 'default': // 基本的
                Object.assign(default_options, {
                    image: KMap.MARKER_IMAGE(type),
                    ...KMap.MARKER_SIZE('position'),
                });
                break;
            case 'start':
                Object.assign(default_options, {
                    image: KMap.MARKER_IMAGE(type),
                    ...KMap.MARKER_SIZE('position'),
                });
                break;
            case 'end':
                Object.assign(default_options, {
                    image: KMap.MARKER_IMAGE(type),
                    ...KMap.MARKER_SIZE('position'),
                });
                break;
        }
        return this.createMarker({ ...default_options, ...options })
    }
    /**
     * 起终点和途经点工厂
     * @param {String} type 点标记类型
     * @param {Object} options 配置信息
     * @return {AMap.Marker} 点标记对象
     * ! 对于图标大小在这里是固定了的
     * ! dir-marker 有三个点，a. start b. via c. end
     * ? 关于via点标记可能偏移取背景图片有些问题
     *  */
    createMarkerDirFactory(type, options = {}) {
        let { width, height } = KMap.MARKER_SIZE('position');
        let image = 'https://a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png', // 图片
            size = new AMap.Size(width, height), // 容器大小
            imageSize = new AMap.Size(135, 40), // 图片大小
            imageOffset, // 图片偏移
            // offset = new AMap.Pixel(-13, -30); // 容器偏移
            offset = new AMap.Pixel(-width / 2, -height); // 容器偏移
        switch (type) {
            case 'start': // 起点
                imageOffset = new AMap.Pixel(-9, -3);
                break;
            case 'end': // 终点
                imageOffset = new AMap.Pixel(-95, -3);
                break;
            case 'via': // 途经点
                imageOffset = new AMap.Pixel(-52, -3);
                break;
        }
        return this.createMarker({
            ...options,
            icon: new KMap.AMap.Icon({
                size,
                image,
                imageSize,
                imageOffset,
            }),
            offset,
        });
    }
    /**
     * 轨迹播放车图标工厂
     * @param {*} type 
     * @param {*} options 
     */
    createMarkerVehicleFactory(type = 'car', options = {}) {
        let default_options = {
            autoRotation: true,
        }
        switch (type) {
            case 'car': //汽车
                Object.assign(default_options, {
                    icon: "https://webapi.amap.com/images/car.png",
                    offset: new AMap.Pixel(-26, -13),
                    angle: -90,
                });
                break;
            case 'bus':// 公交车
                Object.assign(default_options, {
                    icon: "https://webapi.amap.com/images/car.png", // 暂无图片
                    offset: new AMap.Pixel(-26, -13),
                    angle: -90,
                });
                break;
        }
        return this.createMarker(Object.assign(default_options, options));
    }
    /**
     * 内容点标记
     * @param {Object} options 配置信息
     * @return {Marker} 点标记
     * !对于内容点标记来说 offset以及icon好像都是无效的
     * !因此定位的话，是直接通过内容div定位的 
     *  */
    createMarkerContent(options) {
        return new KMap.AMap.Marker({ zIndex: 900, ...options });
    }
    createMarkerContentFactory(type, options = {}) {
        let contents = KMap.MARKER_CONTENT[type];
        if (toString.call(contents) !== '[object Array]') contents = [contents];
        let markers = contents.map(content => this.createMarkerContent({
            content,
            ...options,
        }))
        if (markers.length == 1) return markers[0];
        else return markers;
    }

    // 创建连线
    createLine(options = {}) {
        let default_options = {
            ...KMap.POLYLINE('default'),
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 300,
            showDir: true, // 折线方向
            dirColor: 'white',
            ...options,
        };
        return new KMap.AMap.Polyline(default_options);
    }
    createLineFactory(type = 'default', options = {}) {
        let default_options = {};
        switch (type) {
            case 'default':
                Object.assign(default_options, {
                    ...KMap.POLYLINE(type),
                })
                break;
            case '':
                Object.assign(default_options, {
                    ...KMap.POLYLINE(type),
                })
                break;
        }
        return this.createLine({ ...default_options, options })
    }
    // 创建多边形
    createPolygon(options = {}) {
        let default_options = {
            ...KMap.POLYGON('default'),
            zIndex: 200,
            ...options,
        }
        return new KMap.AMap.Polygon({ ...default_options, ...options });
    }
    createPolygonFactory(type = 'default', options = {}) {
        let default_options = {}
        switch (type) {
            case 'default':
                Object.assign(default_options, {
                    ...KMap.POLYGON('default'),
                })
                break;
            case '':
                Object.assign(default_options, {
                    ...KMap.POLYGON('default'),
                })
                break;

        }
        return this.createPolygon({ ...default_options, options })
    }
    // 创建圆
    createCircle(options = {}) {
        let default_options = {
            // center: [],
            // radius: 1000, 
            zIndex: 200,
        }
        return new KMap.AMap.Circle({ ...default_options, ...options });
    }
    createCircleFactory(type = 'default', options = {}) {
        let default_options = {}
        switch (type) {
            case 'default':
                Object.assign(default_options, {
                    ...KMap.CIRCLE(type),
                })
                break;
            case '':
                Object.assign(default_options, {
                    ...KMap.CIRCLE(type),
                })
                break;

        }
        return this.createCircle({ ...default_options, options })
    }
    /** 创建海量点
     * @param {Object} options 海量点配置
     * @returns {Object} 返回海量点对象
     * @todo 小于14 点聚合  14,15 小点  16及以上 车图标
     * @todo 初始化创建海量点并赋值数据，更新数据调用setData
     */
    createMassMarker(options = {}) {
        let default_options = {
            opacity: 0.9,
            zIndex: 400,
            cursor: "pointer",
            alwaysRender: true,// 表示是否在拖拽缩放过程中实时重绘，默认true，建议超过10000的时候设置false
            style: KMap.MASS_STYLE('default'),
            zooms: KMap.MASS_ZOOM('default'),
            ...options,
        };
        let mass = new KMap.AMap.MassMarks(null, default_options);
        /* 海量点常用的方法
         setMap: mass.setMap,getStyle: mass.getStyle, setStyle: mass.setStyle, setData: mass.setData,getData: mass.getData,
         显示 隐藏 清除
         show: mass.show,
         hide: mass.hide,
         clear: mass.clear,
          */
        return mass;
    }

    /** 创建点聚合
    * @param {Object} options 点聚合配置
    * @returns {Object} 返回点聚合对象
    * @method setData
    * @todo 1. 创建海量点  createMarkerCluster({})  2. 更新数据 markerCluster.setData(data);
    * @todo 因为需要使用插件所以返回的是promise
    * @todo 初始化不设置数据
    */
    async createMarkerCluster(options = {}) {
        let default_options = {
            // 点标记
            topWhenMouseOver: true,
            autoRotation: true,
            content: KMap.MARKER_CONTENT('cluster')[0],// offset: new AMap.Pixel(-8, -13),
            // zooms: [3, 13], //点聚合 zooms是无效的
            zIndex: 400,
            ...options,
        }
        let createMarker = data => {
            return data && data.map(item => this.createMarkerContent({
                position: item.lnglat,
                ...default_options,
            }));
        },
            cluster = await this.load('MarkerClusterer', createMarker(null),
                { gridSize: 70, styles: KMap.CLUSTER_STYLE('default'), ...options }
            );
        cluster.setData = function (data) {// 外观模式
            cluster.clearMarkers();// 切换数据需要先清除 再设置 不然会变成叠加状态
            cluster.setMarkers(createMarker(data));
        };
        cluster.setStyle = function (styles) {
            cluster.setStyles(styles);
        }
        /*clearMarkers: 清除点数据,setMarkers: 设置点数据,setStyles: 设置样式*/
        return cluster;

    }
}