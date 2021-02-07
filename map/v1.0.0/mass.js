const MASS = {
    props: {
        // 全部海量点数据
        allData: null,
        // 定时器
        timer: "",
        // 请求间隔
        interval: 10 * 1000,
        // 车
        car: null,
        // 点
        dot: null,
        // 点聚合
        cluster: null,
        // 点聚合点数据
        clusterMarkers: null,
        // 以后改变排列顺序需要改变这个
        order: ['city', 'ucar', 'rent', 'twone'],
        // 开启类型
        opens: {
            city: 1,
            ucar: 1,
            rent: 1,
            twone: 1,
            // 这个参数要改
            rentType: 0,
        },
        /* topens: {
            city: 1,
            ucar: 1,
            rent: 1,
            twone: 1,
            // 这个参数要改
            rentType: 0,
        } */
        // 信息窗口对象
        infoWin: null,
        // 用于获取信息窗口的车牌号  如果有这个车牌号那么信息窗口就是显示状态，如果没有那么就是关闭状态
        infoWinData: null,
    },
    // 初始化
    init() {
        this.bind();
        // 防抖动
        this.request = $tool.debounce(this.request, 400, true);
        this.requestDetail = $tool.debounce(this.requestDetail, 400, true);
      
        setTimeout(() => {
            this.DatasetInterval();
        }, this.props.interval);
    },
    // 请求海量点接口
    request: function ({ lng, lat, radius }) {
        let url = "http://172.16.150.100:9002/realTimeAnalysis/vehiclePosition"
        return new Promise
            ((resolve, reject) => {
                zkAjax.post({
                    url: url,
                    async: true,
                    noVeil: true,
                    app_key: 0,
                    timeout: 60 * 1000,
                    data: JSON.stringify({ ...this.props.opens, lng, lat, radius, }),
                    contentType: 'application/json',
                    success: (res) => {
                        resolve(this.formatData(res.data));
                    },
                    error(err) {
                        reject(err);
                    }
                })
            })

    },
    // 通过车牌号获取详情数据
    requestDetail({ plate, type }) {

        return new Promise((resolve, reject) => {
            switch (type) {
                // 公交
                case "city":
                    zkAjax.post({
                        url: "http://172.16.150.36:9113/cs.bus.basic.api/vehicle/query/getVehicleHashPerPlate",
                        noVeil: true,
                        app_key: 0,
                        data: JSON.stringify({ pla: plate }),
                        contentType: "application/json",
                        success(res) {
                            if (res.success) {
                                let { lina: title, com: company, pn: plate, spd: speed, lng: lng, lat: lat, } = res.data.vehicle;
                                resolve({ title, company, plate, speed, lng, lat });
                            } else {
                                reject(res);
                            }
                        },
                    })
                    break;
                // 网约
                case "ucar":
                    zkAjax.post({
                        url: "http://172.16.150.100:8009/vehicleCount/VehicleTrackball/VehicleSite?vehicleNo=" + plate,
                        noVeil: true,
                        success(res) {
                            let { id: title, companyName: company, id: plate, speed: speed, position: { coordinates: [lng, lat] } } = res[0];
                            resolve({ title, company, plate, speed, lng, lat });
                        },
                    })
                    break;
                // 出租
                case "rent":
                    zkAjax.post({
                        url: "http://172.16.150.36:9113/cs.taxi.basic.api//taxi/query/positionByPlf",
                        noVeil: true,
                        app_key: 1,
                        data: JSON.stringify({ plf: plate }),
                        contentType: "application/json",
                        success(res) {
                            if (res.success) {
                                let { pzhm: title, qymc: company, pzhm: plate, sp: speed, lng: lng, lat: lat } = res.data.position;
                                resolve({ title, company, plate, speed, lng, lat });
                            } else {
                                reject();
                            }
                        },
                    })
                    break;
                // 两客一危
                case "twone":
                    zkAjax.post({
                        url: "http://172.16.150.100:8011/passenger/selectByPlatnum?branum=" + plate,
                        noVeil: true,
                        success(res) {
                            if (res.success) {
                                // 速度不用处理
                                let { vehicle_no: title, cmcltName: company, vehicle_no: plate, vec1: speed, lon: lng, lat: lat, vec3:/* 运行总里程 */mileage, altitude:/* 海拔 米*/ altitude, coachType: twoneType } = JSON.parse(res.data);
                                resolve({ title, company, plate, speed, lng, lat, mileage, altitude, twoneType });
                            } else {
                                reject();
                            }

                        },
                    })
                    break;
            }
        })
    },
    // 获取全部数据
    /* getAllData: function () {
        // 获取中心点
        var center = webMapApp.mapObj.mapGetCenter();
        return this.request({ radius: 1000000000, ...center });
    }, */
    // 获取范围数据
    getRangeData: function () {
        // 获取中心点
        var center = webMapApp.mapObj.mapGetCenter();
        // 获取地图的边界
        var bounds = webMapApp.mapObj.mapGetBounds();
        // 获取两个点
        var sw = bounds.southwest;
        var ne = bounds.northeast;
        // 半径就是矩形对角线 的一半
        var radius = Math.round(sw.distance(ne)) / 2;
        return this.request({ radius: radius, ...center });
    },

    // 地图绑定事件
    bind: function () {
        webMapApp.mapObj.mapAddListenterEvent('zoomchange', this.zoomListen.bind(this));
        webMapApp.mapObj.mapAddListenterEvent('moveend', this.moveListen.bind(this));
    },
    // 平移
    moveListen: function () {
        var zoom = webMapApp.mapObj.mapGetZoom();
        // 如果是平移的话，海量点类型没有变化，因此就不需要清除点聚合
        if (zoom < 16) {
            // 清除窗口
            this.clearInfoWin();
            if (zoom < 14) { //显示点聚合
                this.onCreateClusterer();
            } else {
                //显示海量点普通图标
                this.onCreateDot();
                this.clearClusterer();
            }
        } else { //显示海量点车图标
            this.onCreateBusData();
            this.clearClusterer();
            if (this.props.infoWinData) {
                this.setInfoWin(this.props.infoWinData);
            }
        }
    },
    // 缩放
    zoomListen: function () {
        this.moveListen();
    },
    // 定时器调用 刷新海量点
    onShowMarker: function () {
        // 定时刷新 海量点  实际上和平移是一样的
        this.moveListen();
    },
    // 定时请求
    DatasetInterval: function () {
        this.props.timer && clearInterval(this.props.timer)
        // 刷新海量点
        this.props.timer = setInterval(() => {
            this.onShowMarker();
        }, this.props.interval);
    },

    async setInfoWin({ plate, type }) {
        /* 
            图片路径
            标题
            公司名称
            车牌号
            速度
            经纬度
            类型： 公交 网约 出租 两客
            两客一危类型
            两客一危运行总里程
            两客一危海拔高度
        */
        // 做一层限制 安全模式
        if (webMapApp.mapObj.mapGetZoom() < 16) return;
        // 接口请求失败的时候
        try {
            this.props.infoWinData = { plate, type };
            let src,
                { title, company/* , plate */, speed, lng, lat, twoneType, mileage, altitude } = await this.requestDetail(this.props.infoWinData),
                address = await new Promise((resolve, reject) => {
                    AMap.service(["AMap.Geocoder"], function () {
                        new AMap.Geocoder({
                            radius: 3000,
                            extensions: "all"
                        }).getAddress([lng, lat], (status, result) => {
                            if (status === 'complete' && result.info === 'OK') {
                                resolve(result.regeocode.formattedAddress)
                            } else {
                                reject()
                            }
                        });
                    });
                }).catch(res => {
                    console.error('逆向地理编码失败')
                });
            switch (type) {
                // 公交
                case "city":
                    src = '../../../img/bus/bus.png';
                    speed = speed && (speed * 0.036).toFixed(2) || '未知';
                    state = '正常';
                    break;
                // 网约
                case "ucar":
                    src = '../../../img/bus/ucar.png'
                    speed = speed && (speed * 1).toFixed(2) || '未知';
                    state = '正常';
                    break;
                // 出租
                case "rent":
                    src = '../../../img/bus/taxi.png'
                    speed = speed && (speed * 1).toFixed(2) || '未知';
                    state = '正常';
                    break;
                // 两客一危
                case "twone":
                    src = '../../../img/bus/keche.png'
                    speed = speed && (speed * 0.036).toFixed(2) || '未知'
                    state = '正常';
                    break;
            }
            content = '<div class="p_win" style="transform: scale(2) translate(0,-25%)">' +
                '<strong style="font-size:1.7rem;color:white">' +
                '<img style="width:33px;height:33px;margin: 0px 13px 0 5px;" src="' + src + '" />' + title +
                '<span class="win_close" style="position: absolute;right: 30px;" onclick="MASS.clearInfoWin();return;">×</span>' +
                '</strong>' +
                '<p><span class="col_w">所属公司: </span>' + company + '</p>' +
                '<p><span class="col_w">车牌号: </span>' + plate + '</p>' +
                '<p><span class="col_w">当前车速: </span>' + speed + 'km/h</p>' +
                '<p><span class="col_w">运营状态: </span>' + state + '</p>' +
                '<p><span class="col_w">经 纬 度: </span>' + parseInt(lng).toFixed(0) + 'N  ' + parseInt(lat).toFixed(0) + 'E</p>' +
                (twoneType ? '<p><span class="col_w">车辆类型: </span>' + twoneType + '</p>' : "") +
                (mileage ? '<p><span class="col_w">运营总里程: </span>' + mileage + '公里</p>' : "") +
                (altitude ? '<p><span class="col_w">海拔高度: </span>' + altitude + 'm</p>' : "") +
                '<p><span class="col_w">位置信息: </span>' + address + '</p>' +
                '</div>' +
                '<div class="triangle_wrap" style="width: 100%;position: absolute;left: 50%;transform: translate(-50%, -150%);"><div class="triangle-down"></div></div>';
            if (this.props.infoWinData) {
                this.props.infoWin.setContent(content);
                this.props.infoWin.open(webMapApp.mapObj.instance, [lng, lat]);
                //设置中心点
                webMapApp.mapObj.mapSetCenter(lng, (parseFloat(lat) + ((18 - webMapApp.mapObj.mapGetZoom()) * 0.0005 + 0.002)), webMapApp.mapObj.mapGetZoom());
            }
        } catch (err) {
            console.log(err, "该车辆没有上线");
            // 没有上线需要清除  主要清除 infoWinDat
            this.clearInfoWin();
        }

    },
    clearInfoWin() {
        if (this.props.infoWin && this.props.infoWinData) {
            this.props.infoWin.close();
            this.props.infoWinData = null;
        }
    },
    // 创建车辆图标海量点
    onCreateBusData: function () {
        if (!this.props.car) {
            this.getRangeData().then((data) => {
                this.props.car = new AMap.MassMarks(data, {
                    opacity: 1, //透明度
                    zIndex: 900, //图层层级
                    cursor: 'pointer',
                    style: this.getStyles('car'), //海量点样式
                    zooms: [16, 18],
                });
                this.props.car.setMap(webMapApp.mapObj.instance)
                this.props.car.on('click', (e) => {
                    let { id, style } = e.data;
                    this.setInfoWin({ plate: id, type: this.props.order[style] })
                });
                this.props.car.on('mouseover', e => {
                    let { id, style } = e.data;
                    console.log('触摸了', id);
                })
            })
        } else {
            this.getRangeData().then((data) => {
                this.props.car.setData(data);
            })
        }
    },

    // 创建小海量点
    onCreateDot: function () {
        this.getRangeData().then((data) => {
            if (!this.props.dot) {
                this.props.dot = new AMap.MassMarks(data, {
                    opacity: 0.8, //透明度
                    zIndex: 900, //图层层级
                    cursor: 'pointer',
                    style: this.getStyles('dot'), //海量点样式
                    zooms: [14, 15],
                });
                this.props.dot.setMap(webMapApp.mapObj.instance);
            } else {
                this.props.dot.setData(data);
            }
        })
    },
    // 创建点聚合
    onCreateClusterer() {
        // 点聚合就是all范围的数据
        // 保存所有数据作为点聚合数据
        this.getRangeData().then(data => {
            // 因为点聚合 数据过多请求接口太慢，操作太快点聚合渲染比海量点渲染要慢很多
            if (webMapApp.mapObj.mapGetZoom() >= 14) return;
            // 这里会出现 data = undefined的情况，不知道什么原因
            if (!data) return;
            this.props.allData = data;
            this.props.clusterMarkers = this.props.allData.map(item => new AMap.Marker({
                position: [item.lng, item.lat],
                topWhenMouseOver: true,
                content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
                autoRotation: true,
                // extData: ,
                zIndex: 980,
                offset: new AMap.Pixel(-8, -13),
                // 点聚合 zooms是无效的
                // zooms: [3, 13],
            }));
            // 切换数据需要先清除 再设置
            this.clearClusterer();
            if (!this.props.cluster) {
                webMapApp.mapObj.instance.plugin(["AMap.MarkerClusterer"], () => {
                    this.props.cluster = new AMap.MarkerClusterer(webMapApp.mapObj.instance, this.props.clusterMarkers, { gridSize: 70 });

                });
            } else {
                // 聚合点重新赋值  数据都是一样的
                // 数据不会变 因此不需要重复
                this.props.cluster.setMarkers(this.props.clusterMarkers);
            };

        })

    },
    getStyles(type) {
        let carStyle = [{
            // 普通车辆图标
            url: '../../../img/bus/bus.png',
            anchor: new AMap.Pixel(10, 20),
            size: new AMap.Size(36, 36)
        },
        {
            url: '../../../img/bus/ucar.png',
            anchor: new AMap.Pixel(10, 20),
            size: new AMap.Size(36, 36)
        },
        {
            url: '../../../img/bus/taxi.png',
            anchor: new AMap.Pixel(10, 20),
            size: new AMap.Size(36, 36)
        },
        {
            url: '../../../img/bus/keche.png',
            anchor: new AMap.Pixel(10, 20),
            size: new AMap.Size(36, 36)
        },
        ],
            dotStyle = [{
                url: '../../../img/bus/bus_min.png',
                anchor: new AMap.Pixel(8, 5),
                size: new AMap.Size(10, 10)
            }, {
                url: '../../../img/bus/ucar_min.png',
                anchor: new AMap.Pixel(8, 5),
                size: new AMap.Size(10, 10)
            }, {
                url: '../../../img/bus/taxi_min.png',
                anchor: new AMap.Pixel(8, 5),
                size: new AMap.Size(10, 10)
            }, {
                url: '../../../img/bus/keche_min.png',
                anchor: new AMap.Pixel(8, 5),
                size: new AMap.Size(10, 10)
            },];
        switch (type) {
            case 'car':
                return carStyle;
            case 'dot':
                return dotStyle;
        };
    },
    // 清除点聚合
    clearClusterer() {
        // 缩放一次 清除聚合点  其他时候并不需要
        if (this.props.cluster) {
            this.props.cluster.clearMarkers();
        };
    },
    // 格式化数据
    formatData: function (data) {
        // 返回数据
        return this.adapterData(data);
    },
    // 数据适配器
    adapterData: function (data) {
        /*  返回的数据
        */
        for (let [i, v] of data.entries()) {
            // 如果其中一个经纬度不存在 那么就不要
            if (!v.lng || !v.lat) continue;
            v.lnglat = [v.lng, v.lat];
            v.id = v.id.replace(/·/, '')
        }
        return data;
    },
}

