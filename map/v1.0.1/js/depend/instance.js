// 实例类
export default class Instance {
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
  
}