// 静态类
export default class Static {
    // 点标记图标
    static MARKER_IMAGE(type) {
        switch (type) {
            case 'default':
                return '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png';
            case 'start':
                return '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png';
            case 'end':
                return '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png';
        }
    }
    // 点标记大小
    static MARKER_SIZE(type) {
        switch (type) {
            case 'position':
                return {
                    width: 25,
                    height: 34,
                }
            case 'site':
                return {

                }
            case 'mass-car':
                return {
                    width: 30,
                    height: 30,
                }
            case 'mass-dot':
                return {
                    width: 10,
                    height: 10,
                }
        }
    }
    // 点标记内容
    static MARKER_CONTENT(type) {
        switch (type) {
            case 'busstop':
                return [
                    "<div class='marker-busstop'></div>",
                    "<div class='marker-busstop-warning'></div>",
                    "<div class='marker-busstop-danger'></div>",
                ]
            case 'cluster': // 点聚合
                return [
                    '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>'
                ]
        }
    }

    // 海量点样式
    static MASS_STYLE(type) {
        switch (type) {
            case 'default':
                let { width, height } = this.MARKER_SIZE('position');
                return [
                    {
                        url: this.MARKER_IMAGE('default'),
                        anchor: new KMap.AMap.Pixel(width / 2, height),// 该属性为抛瞄属性  和offset不一样  xy轴正负和offset的正好相反
                        size: new KMap.AMap.Size(width, height),
                    }
                ]
        }
    }
    // 海量点zoom
    static MASS_ZOOM(type) {
        switch (type) {
            case 'default':
                return [0, 20];
            case 'car':
                return [16, 20];
            case 'dot':
                return [14, 15];
            case 'cluster':
                return [0, 13]

        }
    }
    // 点聚合样式
    static CLUSTER_STYLE(type) {
        switch (type) {
            case 'default':
                return null; // 默认样式，也可以自定义，和海量点style一样
        }
    }
    // 折线
    static POLYLINE() {
        switch (type) {
            case 'default': //高德地图公交线的颜色
                return {
                    strokeColor: '#25C2F2',
                    strokeOpacity: 1,
                    strokeWeight: 6,
                    strokeStyle: "solid",// 折线样式还支持 'dashed'
                    strokeDasharray: [10, 5],// strokeStyle是dashed时有效
                }
            case '':
                return {}
        }
    }
    // 多边形样式
    static POLYGON(type) {
        switch (type) {
            case 'default':
                return {
                    strokeColor: "#FF33FF",
                    strokeWeight: 6,
                    strokeOpacity: 0.2,
                    fillOpacity: 0.4,
                    fillColor: '#1791fc',
                }
        }
    }
    // 圆样式
    static CIRCLE(type) {
        switch (type) {
            case 'default':
                return {
                    strokeColor: "#FF33FF",
                    strokeOpacity: 1,
                    strokeWeight: 6,
                    strokeOpacity: 0.2,
                    strokeStyle: 'dashed',
                    strokeDasharray: [10, 10],// 线样式还支持 'dashed'
                    fillOpacity: 0.4,
                    fillColor: '#1791fc',
                }
        }
    }
    // 基础插件
    static PLUGIN(type) {
        // https://lbs.amap.com/api/javascript-api/guide/abc/loadPlugins/?sug_index=0
        const plugin = {
            lazy: ['AMap.Map3D'],
            hungry: [
                // 初始地图需要加载的，不能异步
                'AMap.Map3D', // 3d
                // 控件
                'AMap.MapType',//地图类型切换插件，用来切换固定的几个常用图层
                'AMap.OverView',//地图鹰眼插件，默认在地图右下角显示缩略图
                'AMap.Scale',//地图比例尺插件
                'AMap.ToolBar',//地图工具条插件，可以用来控制地图的缩放和平移
                'AMap.Geolocation', // 定位
                'AMap.ControlBar',//组合了旋转、倾斜、复位、缩放在内的地图控件，在3D地图模式下会显示
                'AMap.Heatmap', // 热力
                'AMap.Hotspot',//热点插件，地图热点已默认开启，不用手动添加，由Map的 isHotspot 属性替代
                'AMap.Geocoder', // 地理编码
                'AMap.Autocomplete',//输入提示，提供了根据关键字获得提示信息的功能
                'AMap.PlaceSearch',//地点搜索服务，提供了关键字搜索、周边搜索、范围内搜索等功能
                'AMap.GraspRoad',//轨迹纠偏
                'AMap.MouseTool',// 鼠标工具
                'AMap.PolyEditor',// 覆盖物编辑
                'AMap.CircleEditor',//圆编辑插件
                'AMap.Driving',// 驾车路线规划服务，提供按照起、终点进行驾车路线的功能
                'AMap.TruckDriving',//货车路线规划
                'AMap.Transfer',//公交路线规划服务，提供按照起、终点进行公交路线的功能
                'AMap.Walking',//步行路线规划服务，提供按照起、终点进行步行路线的功能
                'AMap.Riding',//骑行路线规划服务，提供按照起、终点进行骑行路线的功能
                'AMap.LineSearch', // 公交路线服务，提供公交路线相关信息查询服务
                'AMap.StationSearch',//公交站点查询服务，提供途经公交线路、站点位置等信息
                'AMap.MarkerClusterer', // 点聚合
                'AMap.ElasticMarker', //灵活点标记，可以随着地图级别改变样式和大小的 Marker
                'AMap.AdvancedInfoWindow', //高级信息窗体，整合了周边搜索、路线规划功能
                'AMap.DistrictSearch',//行政区查询服务，提供了根据名称关键字、citycode、adcode 来查询行政区信息的功能
                'AMap.DragRoute',//拖拽导航插件，可拖拽起终点、途经点重新进行路线规划
                'AMap.ArrivalRange',//公交到达圈，根据起点坐标，时长计算公交出行是否可达及可达范围
                'AMap.CitySearch',//城市获取服务，获取用户所在城市信息或根据给定IP参数查询城市信息
                'AMap.IndoorMap',//室内地图，用于在地图中显示室内地图
                'AMap.RangingTool', //测距插件，可以用距离或面积测量
                'AMap.CloudDataLayer',//云图图层，用于展示云图信息
                'AMap.CloudDataSearch',//云图搜索服务，根据关键字搜索云图点信息
                'AMap.Weather',//天气预报插件，用于获取未来的天气信息
                'AMap.RoadInfoSearch',//道路信息查询，已停止数据更新，反馈信息仅供参考
            ]
        }
        return plugin[type]
    }
}




