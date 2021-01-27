/* 
    依赖：
*/


void function (window) {
    function Mixin(...mixins) {
        class Mix {
            constructor() {
                for (let mixin of mixins) {
                    copyProperties(this, new mixin());
                }
            }
        }
        for (let mixin of mixins) {
            copyProperties(Mix, mixin);
            copyProperties(Mix.prototype, mixin.prototype);
        }
        function copyProperties(target, source) {
            for (let key of Reflect.ownKeys(source)) {
                if (key !== 'constructor'
                    && key !== 'prototype'
                    && !(key === 'name' && typeof source === 'function')
                    && !(key === 'length' && typeof source === 'function')
                ) {
                    let desc = Object.getOwnPropertyDescriptor(source, key);
                    Object.defineProperty(target, key, desc);
                }
            }
        }
        return Mix;
    }
    const MapScheme = {
        config3callback/* verify config and callback */(config, callback) {
            if (config && typeof config === 'function') {
                callback = config;
                config = {};
            } else if (!onfig.Object.create.toString() === ['Object object']) MapError.config3callbackExeception();
            return {
                callback,
                config,
            }
        }
    }
    // 无地图也能使用  静态方法
    class Static {
        static STATE = 'unstart' // unstart 初始值 starting 已开始 success 成功 error 结束  
        static GEOCODER = null
        // 蓝色定位点
        static IMAGE_BLUE = '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png'
        static IMAGE_START = '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png'
        static IMAGE_END = '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png'
        // 高德地图公交线的颜色
        static STROKECOLOR_BLUE = '#25C2F2' // #5b91fd
        // 海量点样式
        static STYLE = () => {
            return [
                {
                    url: KMap.IMAGE_BLUE,
                    // 该属性为抛瞄属性  和offset不一样  xy轴正负和offset的正好相反
                    anchor: new KMap.AMap.Pixel(12, 30),
                    size: new KMap.AMap.Size(24, 30),
                    /*   anchor: new AMap.Pixel(15, 15),
                      size: new AMap.Size(30, 30) */
                    // rotation
                    /*          url: 'https://a.amap.com/jsapi_demos/static/images/mass2.png',
                anchor: new AMap.Pixel(3, 3),
                size: new AMap.Size(5, 5) */
                }
            ]
        }
        static CENTER(type) {
            switch (type) {
                case '长沙县':
                    return [113.08081, 28.24615];
                case '长沙市':
                    return [112.938888, 28.228272];
            }
        }
        static THEME(type) {
            switch (type) {
                case 'tocc':
                    return 'amap://styles/2e77546dafb78229c439e72882973302';
                case 'default':
                    return 'amap://styles/normal'
            }
        }
        static POLYGON = {
            strokeColor: "#FF33FF",
            strokeWeight: 6,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            fillColor: '#1791fc',
            zIndex: 333,
        }
    }
    // 项目相关的方法
    class Context {
        constructor() {
            if (new.target === KMap) throw TypeError('本类不能实例化');
        }
        // 获取两点的中心点  线路修改的时候使用
        /** 
         * @param {Lnglat} 点1
         * @param {Lnglat} 点二
         * @returns {LngLat} 中心坐标
          */
        getTwoLnglatCenter(a, b) {
            // 分别获取xy的距离
            let ax = a.getLng(),
                ay = a.getLat(),
                bx = b.getLng(),
                by = b.getLat(),
                x = a.distance(this.createLngLat(bx, ay)),
                y = a.distance(this.createLngLat(ax, by));
            console.log(x, y);
            // 判断走向
            x = bx - ax >= 0 ? x : -x;
            y = by - ay >= 0 ? y : -y;
            let center = this.offset(a, x / 2, y / 2);
            return center;
        }
    }
    // 数据转换类
    class Transform {
        constructor() {
            if (new.target === KMap) throw TypeError('本类不能实例化');
        }
        /**
         * path转换
         * @param {Array} path  [{P:,Q,lng,lat}]
         * @returns {Array}  [[],[]]
         */
        path2Two(path) {
            return path.map(item => [item.lng, item.lat])
        }
        path2LngLat(path) {
            return path.map(item => this.createLngLat(item.lng, item.lat))
        }
    }
    // 事件绑定
    class Event {
        constructor() {
            if (new.target === KMap) throw TypeError('本类不能实例化');
        }
        /**
         * 事件绑定
         * @param {String} eventName 事件名称
         * @param {Function} handler 回调函数
         * @returns {Function} thunk函数
         * context.on('click',function(e) {})(binder)
         * @param {Object} binder 绑定者 */
        on(eventName, handler) {
            return (binder) => {
                // 桥接
                if (this.validateEventName.call(binder, eventName)) {
                    this.bind.call(binder, eventName, handler)
                }
            }
        }
        /**
         * 事件解绑
         * @param {String} eventName 事件名称
         * @param {Function} handler 回调函数
         * @returns {Function} thunk函数
         * context.on('click',function(e) {})(binder)
         * @param {Object} binder 绑定者 */
        off(eventName, handler) {
            return (binder) => {
                // 桥接
                if (this.validateEventName.call(binder, eventName)) {
                    this.unbind.call(binder, eventName, handler)
                }
            }
        }
        /**
            * 校验绑定者是否存在该对象逻辑
            * @returns {String} eventName
            * @returns {Boolean}  */
        validateEventName(eventName) {
            let context = this,
                name = context.CLASS_NAME,
                { events } = [
                    {
                        // 构造函数名称  
                        // AMap就是c
                        name: 'AMap.Map',
                        events: [
                            {
                                name: 'click',
                                describe: '点击事件',
                            },
                            {
                                name: 'moveend',
                                describe: '地图平移完成事件'
                            },
                            {
                                name: 'zoomend',
                                describe: '地图缩放完成事件'
                            },
                        ]
                    },
                    {
                        // 构造函数名称  点标记
                        name: 'AMap.Marker',
                        events: [
                            {
                                name: 'click',
                                describe: '点击事件',
                            },
                            {
                                name: 'moving',
                                describe: '车图标运行事件'
                            },
                            {
                                name: 'dragstart',
                                describe: '开始拖拽点标记时触发事件',
                            },
                            {
                                name: 'dragging',
                                describe: '鼠标拖拽移动点标记时触发事件',
                            },
                            {
                                name: 'dragend',
                                describe: '点标记拖拽移动结束触发事件',
                            },
                        ]
                    },
                    {
                        // 构造函数名称  海量点
                        name: 'AMap.MassMarks',
                        events: [
                            {
                                name: 'click',
                                describe: '点击事件',
                            },
                        ]
                    },
                    {
                        // 构造函数名称  海量点
                        name: 'AMap.PolyEditor',
                        events: [
                            {
                                name: 'addnode',
                                describe: '添加节点事件',
                            },
                            {
                                name: 'adjust',
                                describe: '节点位置变化事件',
                            },
                            {
                                name: 'removenode',
                                describe: '删除节点事件',
                            },
                            {
                                name: 'end',
                                describe: '关闭编辑事件',
                            },
                        ]
                    },
                    {
                        // 构造函数名称  海量点
                        name: 'AMap.MouseTool',
                        events: [
                            {
                                name: 'draw',
                                describe: '画覆盖物完成后事件,单击右键会关闭',
                            },

                        ]
                    },
                ].find(item => name === item.name) || {};
            // 判断是否存在该事件
            if (events && events.find(item => item.name === eventName)) {
                return true;
            } else {
                throw new TypeError(name + '无' + eventName + '事件')
            }
        }
        /**
         * 事件绑定逻辑 
         * @param {String} eventName 事件名称
         * @param {Function} handler 回调函数
         * */
        bind(eventName, handler) {
            let context = this;
            context.on(eventName, handler);
        }
        /**
           * 事件解绑逻辑 
           * @param {String} eventName 事件名称
           * @param {Function} handler 回调函数
           * */
        unbind(eventName, handler) {
            let context = this;
            context.off(eventName, handler);
        }
    }
    // 操作方法  
    class Operation {
        constructor() {
            if (new.target === KMap) throw TypeError('本类不能实例化');
        }
        // 添加基础工具
        addBasicTools() {
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
        createGeocoder(config) {
            KMap.GEOCODER = new KMap.AMap.Geocoder({
                city: "长沙", //城市设为北京，默认：“全国”
                radius: 1000, //范围，默认：500
                lnag: 'zh-CN',
                batch: true,
                extensions: 'all',
                ...config,
            });
        }
        // 地理编码
        getLocation(address, config, callback) {
            const result = MapScheme.config3callback(config, callback);
            config = result.config;
            callback = result.callback
            if (!KMap.GEOCODER)
                this.createGeocoder(config);
            // 传入数组批量查询 传入字符串查单个
            KMap.GEOCODER.getLocation(address, function (status, result) {
                if (status === 'complete' && result.geocodes.length)
                    callback && callback(result.geocodes[0].location)
                else {
                    console.error('根据地址查询经纬度失败');
                    callback && callback(null)
                }
            });
        }
        // 逆向地理编码
        getAddress(lnglat, config, callback) {
            const result = MapScheme.config3callback(config, callback);
            config = result.config;
            callback = result.callback
            if (!KMap.GEOCODER)
                this.createGeocoder(config);
            // 传入[[],[]]批量查或者 传入[]查询单个
            KMap.GEOCODER.getAddress(lnglat, function (status, result) {
                if (status === 'complete' && result.regeocode)
                    callback && callback(result.regeocode.formattedAddress);
                else {
                    console.error('根据经纬度查询地址失败');
                    callback && callback('')
                }

            });
        }
        // 设置中心点
        /**  
            ([,lnaglt][,lng,lat])
            @param {LngLat} 经纬度对象
            @param {Number} 经度
            @param {Number} 纬度
        */
        setCenter(...args) {
            if (args.length === 2) {
                this.$map.setCenter(this.createLngLat(...args))
            } else if (args.length === 1) {
                this.$map.setCenter(...args)
            } else {
                throw new TypeError('KMap', 'setCenter方法参数传递错误')
            }
        }
        /**
         * 获取地图中心点
         * @returns {Array} [lng,lat] */
        getCenter() {
            return this.$map.getCenter();
        }
        // 设置视野
        setFitView(overlay) {
            this.$map.setFitView(overlay)
        }
        // 删除覆盖物 传入单个或者数组
        remove(overlay) {
            this.$map.remove(overlay);
        }
        // 添加覆盖物
        add(overlay) {
            this.$map.add(overlay);
        }
        // 清除所有覆盖物
        clearMap() {
            this.$map.clearMap();
        }
        // 获取所有覆盖物 传入type获取指定覆盖物  如marker
        getAllOverlays(type) {
            this.$map.getAllOverlays(type);
        }
        // 设置缩放等级
        setZoom(num) {
            this.$map.setZoom(num);
        }
        // 坐标偏移的到新的坐标
        offset(lnglat, x, y) {
            return lnglat.offset(x, y);
        }
        // 计算两坐标点之间的距离
        distance(a, b) {
            return a.distance(b);
        }
        /**
         * 获取地图西北 和 东南角
         * @returns {Object}  {northeast: [lng,lat],southwest: [lag,lat]} 
         *  */
        getBounds() {
            return this.$map.getBounds();
        }
        /**
         * 获取当前视图对角线半径
         * @returns {Number} 半径
         * */
        getViewRadius() {
            let { northeast, southwest } = this.getBounds();
            return Math.round(northeast.distance(southwest) / 2);
        }
        /**
         * 获取地图级别 
         * @returns {Number} zoom */
        getZoom() {
            return this.$map.getZoom();
        }
        /**
         * 设置地图级别 
         * @param {Number} zoom */
        setZoom(zoom) {
            return this.$map.setZoom(zoom);
        }
        // path: [LngLat]
        distanceOfLine(path) {
            return KMap.AMap.GeometryUtil.distanceOfLine(path);
        }
    }
    // 工具对象
    class Tool {
        constructor() {
            if (new.target === KMap) throw new TypeError('本类不能实例化')
        }

        // 覆盖物编辑
        createPolyEditor(overlay) {
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
         * 
         * todo 过程 1. 创建鼠标工具 2. 绑定画覆盖物事件 3. 打开何种类型鼠标工具 4. 画覆盖物 5. 关闭鼠标工具
         *  */
        createMouseTool() {
            let kmap = this,
                mouseTool = new KMap.AMap.MouseTool(this.$map),
                proxy = new Proxy(mouseTool, { // 代理
                    set(target, key, value, receiver) {
                        if (key === 'draw') {
                            // 如果设置draw方法，那么就
                            kmap.on('draw', function (e) {
                                mouseTool.draw(e.obj, e);
                            })(mouseTool);
                        }
                        return Reflect.set(target, key, value);
                    }
                });

            // 装饰者
            let originOpen = mouseTool.open;
            mouseTool.open = function (...args) {
                originOpen && originOpen.call(this, ...args);
                open(...args);
            }
            return proxy;
            // 选择type类型覆盖物
            function open(type) {
                switch (type) {
                    case 'marker': {
                        mouseTool.marker({
                            //同Marker的Option设置
                        });
                        break;
                    }
                    case 'polyline': {
                        mouseTool.polyline(KMap.POLYGON);
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

    }
    // 创建对象
    class Instance {
        constructor() {
            if (new.target === KMap) throw new TypeError('本类不能实例化')
        }
        // 创建点标记
        createMarker(options) {
            let w = options.w || 24;
            let h = options.h || 30;
            let image = options.image || KMap.IMAGE_BLUE;
            let default_options = {
                offset: this.createPixel(-w / 2, -h),
                icon: this.createIcon({
                    image: image,
                    imageSize: this.createSize(w, h),
                    size: this.createSize(w, h)
                })
            };
            return new KMap.AMap.Marker(Object.assign(default_options, options));
        }
        /**
         * *创建 指定的点标记
         * @param {String} type 点标记类型
         * @param {Object} options 配置信息
         * @return {AMap.Marker} 点标记对象
         * ! 对于图标大小在这里是固定了的
         * ! dir-marker 有三个点，a. start b. via c. end
         * ? 关于via点标记可能偏移取背景图片有些问题
         * todo 以后有新的可以往里面添加
         *  */
        createMarkerFactory(type, options) {
            let image = 'https://a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png', // 图片
                size = new AMap.Size(25, 34), // 容器大小
                imageSize = new AMap.Size(135, 40), // 图片大小
                imageOffset, // 图片偏移
                offset = new AMap.Pixel(-13, -30); // 容器偏移
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
            return new KMap.AMap.Marker({
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
        // 轨迹播放车图标
        createMarkerCar(options) {
            let default_options = {
                icon: "https://webapi.amap.com/images/car.png",
                offset: new AMap.Pixel(-26, -13),
                autoRotation: true,
                angle: -90,
            }
            return new KMap.AMap.Marker(Object.assign(default_options, options));
        }
        /**
         **内容点标记
         * @param {Object} options 配置信息
         * @return {Marker} 点标记
         * !对于内容点标记来说 offset以及icon好像都是无效的
         * !因此定位的话，是直接通过内容div定位的 
         *  */
        createMarkerContent(options) {
            return new KMap.AMap.Marker(options);
        }
        // 创建像素
        createPixel(...pixel) {
            return new KMap.AMap.Pixel(...pixel)
        }
        // 创建坐标
        createLngLat(...lnglat) {
            return new KMap.AMap.LngLat(...lnglat);
        }
        // 创建容器大小对象
        createSize(...size) {
            return new KMap.AMap.Size(...size);
        }
        // 创建图标对象
        createIcon(options) {
            return new KMap.AMap.Icon(options);
        }
        // 创建连线
        createLine(options) {
            let default_options = {
                // outlineColor: '#ffeeff',
                strokeColor: KMap.STROKECOLOR_BLUE,
                strokeOpacity: 1,
                strokeWeight: 6,
                // 折线样式还支持 'dashed'
                strokeStyle: "solid",
                // strokeStyle是dashed时有效
                strokeDasharray: [10, 5],
                lineJoin: 'round',
                lineCap: 'round',
                zIndex: -1,
                // 折线反向
                showDir: true,
                dirColor: 'white',
            };
            return new KMap.AMap.Polyline(Object.assign(default_options, options));
        }
        // 创建多边形
        createPolygon(options) {
            let default_options = KMap.POLYGON;
            return new KMap.AMap.Polygon(Object.assign(default_options, options));
        }
        createCircle(options = {}) {
            let default_options = {
                borderWeight: 3,
                strokeColor: "#FF33FF",
                strokeOpacity: 1,
                strokeWeight: 6,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                strokeStyle: 'dashed',
                strokeDasharray: [10, 10],
                // 线样式还支持 'dashed'
                fillColor: '#1791fc',
                zIndex: 50,
            }
            return new KMap.AMap.Circle(Object.assign(default_options, options));
        }
        createMass(data, options = {}) {
            let default_options = {
                opacity: 1,
                zIndex: 111,
                cursor: "pointer",
                style: KMap.STYLE(),
                // 表示是否在拖拽缩放过程中实时重绘，默认true，建议超过10000的时候设置false
                alwaysRender: true,
            };
            return new KMap.AMap.MassMarks(data, Object.assign(default_options, options));

        }
        /** 创建海量点
         * @param {Array} data 海量点数据
         * @param {Object} options 海量点配置
         * @returns {Object} 返回海量点对象
         * 小于14 点聚合  14,15 小点  16及以上 车图标
         */
        createMassMarker(data, {
            zIndex = 900,
            opacity = 0.8,
            zooms = [14, 15],
            cursor = 'pointer',
            /* {
                url: '../../../img/bus/ucar.png',
                anchor: new AMap.Pixel(10, 20),
                size: new AMap.Size(36, 36)
                },
            */
            style = [],
            // 表示是否在拖拽缩放过程中实时重绘，默认true，建议超过10000的时候设置false
            alwaysRender = true,
        }

        ) {
            let mass = new KMap.AMap.MassMarks(data, {
                zIndex, //图层层级
                opacity, //透明度
                zooms,
                cursor,
                style, //海量点样式
                alwaysRender,
            });
            // 海量点常用的方法
            /*  context: mass,
             setMap: mass.setMap,
             getStyle: mass.getStyle,
             setStyle: mass.setStyle,
             setData: mass.setData,
             getData: mass.getData,
             // 显示 隐藏 清除
             show: mass.show,
             hide: mass.hide,
             clear: mass.clear, */
            return mass;
        }
        /** 创建点聚合
        * @param {Array} data 点聚合数据
        * @param {Object} options 点聚合配置
        * @returns {Object} 返回点聚合对象
        */
        createClusterMarker(data, {
            // 点聚合配置
            gridSize = 70,
            styles = null,
            // 点标记配置
            topWhenMouseOver = true,
            content = '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
            autoRotation = true,
            zIndex = 980,
            offset = new AMap.Pixel(-8, -13),
            // 点聚合 zooms是无效的
            // zooms: [3, 13],
        }) {
            // 1. 创建所需的点标记  
            let cluster = new KMap.AMap.MarkerClusterer(this.$map, createMarker(data), { gridSize, styles });
            // 外观模式 
            cluster.setData = function (data) {
                // 切换数据需要先清除 再设置 不然会变成叠加状态
                cluster.clearMarkers();
                cluster.setMarkers(/* 适配数据;将数据变成点标记 */createMarker(data));
            };
            // 初始化会 设置数据
            return cluster;
            /* 
            clearMarkers: 清除点数据  
            setMarkers: 设置点数据
            setMap: 
            getMap:  
            */
            function createMarker(data) {
                return data && data.map(item => new KMap.AMap.Marker({
                    position: item.lnglat,
                    topWhenMouseOver,
                    content, autoRotation, zIndex, offset
                }));
            }
        }

    }

    // 错误
    class MapError extends Error {
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
        // id
        static containerExeception(id) {
            throw new MapError('selector "#' + id +
                '" element is not undefiend', '\nbuild map fail')
        }
        // config and callback
        static config3callbackExeception() {
            throw new MapError('Wrong second parameter', 'geocoder or ...')
        }

    }

    class KMap extends Mixin(Operation, Tool, Instance, Static, Context, Transform, Event) {
        constructor() {
            super();
            // 地图
            this.$map = null;
        }
        // 地图类
        static AMap
        // 回调
        static loader({
            key = 'a1aba2049ce8ef3ed0dd419dd839b4bb',
            plugin = [],
            // map
            id = null,
            center = null,
            zoom = 14,
            style = KMap.THEME('default'),
        } = {}) {
            return new Promise((resolve, reject) => {
                // basic plugin
                // var basicPlugins = ['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView', 'AMap.MapType', 'AMap.Geolocation'];
                var basicPlugins = [
                    'Map3D', 'AMap.Heatmap', 'AMap.Geocoder',
                    'AMap.Geolocation', 'AMap.MapType', 'AMap.ToolBar',
                    'AMap.PlaceSearch', 'AMap.GraspRoad', 'AMap.Autocomplete',
                    'AMap.Scale', 'AMap.OverView', 'AMap.MouseTool', 'AMap.PolyEditor',
                    'AMap.Driving', 'AMap.LineSearch'
                ];

                // success callback
                window.createMap = function () {
                    // static
                    let kmap = null;
                    // save AMap Class
                    KMap.AMap = window.AMap;
                    // static to singleton
                    function Static2Singleton() {
                        // build instance 
                        kmap = new KMap();
                        // build map, save inner
                        kmap.$map = new AMap.Map(id, {
                            center,
                            zoom,
                            style,
                        })
                    }
                    if (id) {
                        document.getElementById(id) || MapError.containerExeception(id);
                        // start singleton
                        Static2Singleton();
                    }
                    // setTimeout(() => resolve(kmap))
                    KMap.STATE = 'success';
                    resolve(kmap)
                }

                function createScript() {
                    KMap.STATE = 'starting';
                    // dynamic build
                    var script = document.createElement('script'),
                        src = 'http://webapi.amap.com/maps?v=1.4.14&key=' + key +
                            '&plugin=' + extensionPlugins() + '&callback=createMap';
                    script.type = 'text/javascript';
                    script.src = src;
                    script.async = true;
                    script.className = 'kmap_map-script-loader';
                    document.body.appendChild(script);
                    // error callback
                    script.addEventListener('error', function (e) {
                        KMap.STATE = 'error';
                        reject(e);
                    }, {
                        capture: false,
                        once: true,
                        passive: false,
                    });
                };
                // extensions plugin
                function extensionPlugins() {
                    // 之前的
                    /*   // all plugin
                      if (plugin === 'all') plugin = ['AMap.Geocoder', 'AMap.PolyEditor']
                      // not array
                      else if (!plugin instanceof Array)
                          MapError.pluginExeception(); */
                    // 由于地图js只加载一次，但是又有多个页面会用到，因此，强制加载全部插件
                    plugin = ['AMap.Geocoder', 'AMap.PolyEditor', 'AMap.MarkerClusterer']
                    return basicPlugins.concat(plugin).join(',').trim();
                }

                /* 有个Bug就是同一个页面  不能同一时间创建两次，如果是依次有间隔创建两次那么就没有问题，已通过安全模式处理 */
                // 加载安全处理
                function safetyLoading() {
                    if (KMap.STATE === 'starting') {
                        setTimeout(() => {
                            return safetyLoading();
                        }, 1 * 1000);
                    } // 前一个处于加载中状态 那么延迟加载
                    if (KMap.STATE === 'success') return createMap(); // AMap已存在
                    if (KMap.STATE === 'error') return console.error("地图加载失败");
                    if (KMap.STATE === 'unstart') return createScript(); // 第一次加载 AMap不存在
                }
                safetyLoading();
            })
        }
    }
    window.KMap = KMap;
    // KMap.loader({ plugin: 'all',script: true });
}(window)
