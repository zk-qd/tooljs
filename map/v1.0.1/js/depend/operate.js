export default class Operate {
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