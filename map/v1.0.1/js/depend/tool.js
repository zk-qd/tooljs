// 工具类
export default class Tool {
    /** 
     * @description 获取两点的中心点  线路修改的时候使用
     * @param {Lnglat} 点1
     * @param {Lnglat} 点二
     * @returns {LngLat} 中心坐标
      */
    getBetweenLnglat(a, b) {
        // 分别获取xy的距离
        let ax = a.getLng(),
            ay = a.getLat(),
            bx = b.getLng(),
            by = b.getLat(),
            x = a.distance(this.createLngLat(bx, ay)),
            y = a.distance(this.createLngLat(ax, by));
        // 判断走向
        x = bx - ax >= 0 ? x : -x;
        y = by - ay >= 0 ? y : -y;
        let center = this.offset(a, x / 2, y / 2);
        return center;
    }
    // [{P:,Q,lng,lat}] => [[],[]]
    path2array(path) {
        return path.map(item => [item.lng, item.lat])
    }
    // [{P:,Q,lng,lat}] => [LngLat,LngLat]
    path2lnglat(path) {
        return path.map(item => this.createLngLat(item.lng, item.lat))
    }
    // 通过中心点 半对角线 获取 四个点
    getGridByCenter(lnglat, distanceX, distanceY) {
        var x = Math.abs(distanceX);
        var y = Math.abs(distanceY);
        var leftTop = lnglat.offset(-x, y);
        var rightTop = lnglat.offset(x, y);
        var rightBottom = lnglat.offset(x, -y);
        var leftBottom = lnglat.offset(-x, -y);
        return [leftTop, rightTop, rightBottom, leftBottom];
    }
    // 通过左上角 距离获取中心点
    getCenterByTopLeftPoint(lnglat, distance) {
        const d = Math.abs(distance);
        let center;
        try {
            center = lnglat.offset(d, -d);
        } catch (e) {
            throw new Error("lnglat error: It's not an object !")
        }
        return center;
    }
}