// 通过中心点 距离 获取 四个点
export function getGridByCenter(lnglat, distanceX, distanceY) {
    var x = Math.abs(distanceX);
    var y = Math.abs(distanceY);
    var leftTop = lnglat.offset(-x, y);
    var rightTop = lnglat.offset(x, y);
    var rightBottom = lnglat.offset(x, -y);
    var leftBottom = lnglat.offset(-x, -y);
    return [leftTop, rightTop, rightBottom, leftBottom];
}

// 通过左上角 距离获取中心点
export function getCenterByTopLeftPoint(lnglat, distance) {
    const d = Math.abs(distance);
    let center;
    try {
        center = lnglat.offset(d, -d);
    } catch (e) {
        throw new Error("lnglat error: It's not an object !")
    }
    return center;
}