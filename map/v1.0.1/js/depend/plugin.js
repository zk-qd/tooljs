// 插件操作类  
export default class Plugin {
    static LOADEDPLUGINS = [] // 已经加载的插件
    /**
     * @description 插件加载方法
     * @param {*} pluginName 插件名称
     * @param  {...any} args 参数
     * @returns {*} 需要返回的会有返回
     */
    load(pluginName, ...args) {
        let fnName;
        switch (pluginName) {
            case 'control':
                fnName = 'loadControl';// 添加基础工具
                pluginName = ['toolBar', 'scale', 'overView', 'MapType', 'Geolocation'];
                break;
            case 'geocoder':
                fnName = 'loadGeocoder';// 地理编码对象
                break;
            case 'polyEditor':
                fnName = 'loadPolyEditor'; // 覆盖物编辑
                break;
            case 'mouseTool':
                fnName = 'loadMouseTool'; // 鼠标工具
                break;
            case 'markerClusterer':
                fnName = 'loadMarkerClusterer'; // 点聚合
                break;
        }
        if (typeof pluginName == 'string') pluginName = [pluginName];
        return new Promise((resolve, reject) => {
            this.loadPlugins(pluginName, () => {
                resolve(this[fnName](...args))
            });
        })
    }
    loadPlugins(pluginName, callback) {
        /**
         * 1. 判断如果是懒加载，
         * 2. 那么获取全部插件
         * 3. 用name获取插件完整名称
         * 4. 筛选出未加载的插件
         * 5. 加载插件
         * 6. 将加载的插件名称存入，并回调
         **/
        if (KMap.MODE = 'lazy') {
            let allPluginName = KMap.PLUGIN('hungry'),
                LOADEDPLUGINS = KMap.LOADEDPLUGINS,
                fullPluginName = pluginName.map(nitem =>
                    allPluginName.find(pitem =>
                        pitem.toLowerCase().includes(nitem.toLowerCase())));
            fullPluginName = fullPluginName.filter(pitem => !LOADEDPLUGINS.includes(pitem))
            KMap.AMap.plugin(fullPluginName, () => {
                KMap.LOADEDPLUGINS = [...LOADEDPLUGINS, ...fullPluginName];
                callback();
            });
        } else callback();
    }
    loadControl() {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        this.$map.addControl(new KMap.AMap.ToolBar());

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        this.$map.addControl(new KMap.AMap.Scale());

        // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
        this.$map.addControl(new KMap.AMap.OverView({ isOpen: true }));

        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        this.$map.addControl(new KMap.AMap.MapType());

        // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
        this.$map.addControl(new KMap.AMap.Geolocation());
    }
    loadGeocoder(config = {}) {
        const geocoder = new KMap.AMap.Geocoder({
            city: "长沙", //城市设为北京，默认：“全国”
            radius: 1000, //范围，默认：500 单位km
            lnag: 'zh-CN',
            batch: true,
            extensions: 'all',
            ...config,
        });
        return {
            target: geocoder,
            // 地理编码
            getLocation(address) {
                // 传入数组批量查询 传入字符串查单个
                new Promise((resolve, reject) => {
                    geocoder.getLocation(address, (status, result) => {
                        if (status === 'complete' && result.geocodes.length) resolve(result.geocodes[0].location)
                        else reject('经纬度查询失败');
                    });
                }).catch(console.error)

            },
            // 逆向地理编码
            getAddress(lnglat) {
                new Promise((resolve, reject) => {
                    // 传入[[],[]]批量查或者 传入[]查询单个
                    geocoder.getAddress(lnglat, (status, result) => {
                        if (status === 'complete' && result.regeocode) resolve(result.regeocode.formattedAddress)
                        else reject('地址查询失败');
                    });
                }).catch(console.error)
            }
        }
    }
    loadPolyEditor(overlay) {
        return new KMap.AMap.PolyEditor(this.$map, overlay);
        /* 
        open()
        close() 
        polyEditor.on('addnode', function (event) { // 添加节点
            log.info('触发事件：addnode')
        })
        polyEditor.on('adjust', function (event) { // 节点位置变化
            log.info('触发事件：adjust')
        })
        polyEditor.on('removenode', function (event) { // 删除节点
            log.info('触发事件：removenode')
        })
        polyEditor.on('end', function (event) {  // 关闭编辑
            log.info('触发事件： end')
            // event.target 即为编辑后的多边形对象
        }) */
    }
    /**
    * todo鼠标工具
    * @returns {Proxy} mouseTool 返回鼠标对象
    * *open(type)
    * @param {String} type 画覆盖物类型
    * *close(boolean)
    * @param {Boolean} boolean 关闭鼠标工具  传入true同时清除鼠标工具画的覆盖物
    * *draw(overlay,event) 
    * @param {Object} overlay 画出来的覆盖物对象
    * @param {Event} event 事件对象
    * @todo 过程 1. 创建鼠标工具 2. 绑定画覆盖物事件 3. 打开何种类型鼠标工具 4. 画覆盖物 5. 关闭鼠标工具
    * @todo MouseTool没有draw和open方法
    *  */
    loadMouseTool() {
        let kmap = this,
            mouseTool = new KMap.AMap.MouseTool(this.$map),
            proxy = new Proxy(mouseTool, { // 代理
                set(target, key, value, receiver) {
                    if (key === 'draw') {
                        // 如果设置draw方法，那么就
                        kmap.on('draw', mouseTool, function (e) {
                            mouseTool.draw(e.obj, e);
                        });
                    }
                    return Reflect.set(target, key, value);
                }
            });
        // 装饰者
        // let originOpen = mouseTool.open;
        mouseTool.open = function (...args) {
            // originOpen && originOpen.call(this, ...args);
            open(...args);
        }
        return proxy;
        // 选择type类型覆盖物
        function open(type) {
            switch (type) {
                case 'marker': {
                    mouseTool.marker({//同Marker的Option设置
                    });
                    break;
                }
                case 'polyline': {
                    mouseTool.polyline(KMap.POLYGON('default'));
                    break;
                }
                case 'polygon': {
                    mouseTool.polygon({
                        fillColor: '#00b0ff',
                        strokeColor: '#80d8ff'
                        //同Polygon的Option设置
                    });
                    break;
                }
                case 'rectangle': {
                    mouseTool.rectangle({
                        fillColor: '#00b0ff',
                        strokeColor: '#80d8ff',
                        //同Polygon的Option设置
                    });
                    break;
                }
                case 'circle': {
                    mouseTool.circle({
                        fillColor: '#00b0ff',
                        strokeColor: '#80d8ff'
                        //同Circle的Option设置
                    });
                    break;
                }
            }
        }
    }
    loadMarkerClusterer(markers, config) {
        return new KMap.AMap.MarkerClusterer(this.$map, markers, config);
    }
}