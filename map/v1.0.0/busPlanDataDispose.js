// 公交车换乘方案 的数据处理代码 
//  通过两点获取换乘方案 
// 转换成的数据结构
import { busType } from "./mapConst";
export default {
    convertLinePlanData(route) {
        // 换乘方案
        const transits = route.transits;
        const distancePoint = route.distance;
        const origin = route.origin;
        const destination = route.destination;
        return transits.map(item => {
            return {
                // 总价格
                price: item.cost,
                // 总距离
                distance: item.distance,
                // 步行总距离
                walkingDistance: item.walking_distance,
                // 花费总时间
                duration: item.duration,
                // 系数 总距离和直线之比
                coef: (item.distance / distancePoint).toFixed(2),
                // 出发站
                departureStop: this.getDepartureStop(item),
                // 原点
                origin: origin,
                // 终点
                destination: destination,

                // 线路
                line: this.getLineInfo(item.segments)
            };
        });

    },
    // 获取出发站
    getDepartureStop(item) {
        const bus = item.segments[0].bus.buslines[0];
        try {
            if (bus) {
                return bus.departure_stop.name;
            } else {
                return "";
            }
        } catch (e) {
            return "";
        }
    },
    // 线路数据 公交名称
    getLineInfo(segments) {
        const buslineNames = [];
        const walkingPolylines = [];
        const busPolylines = [];
        segments.forEach(item => {
            const walking = item.walking.steps;
            const bus = item.bus.buslines;
            if (walking && walking.length > 0) {
                const walkingPolyline = walking
                    .map(item => item.polyline.split(/;/g)
                        .map(item => item.split(/,/g)))
                    .reduce((total, item) => total.concat(item), []);
                walkingPolylines.push(walkingPolyline);
            }
            if (bus && bus.length > 0) {
                const busPolyline = bus
                    .map(item => item.polyline.split(/;/g)
                        .map(item => item.split(/,/g)))
                    .reduce((total, item) => total.concat(item), []);
                busPolylines.push(busPolyline);
                
                let type = bus[0].type;
                // 判断 什么公交
                type = busType.find(item => {
                    if (type == item.value) {
                        return true;
                    }
                }).index;

                let name = bus[0].name;
                name = name.slice(0, name.indexOf("("));

                buslineNames.push({
                    type: type,
                    name: name
                });
            }
        });
        return {
            buslineNames: buslineNames,
            polylines: {
                walkingPolylines: walkingPolylines,
                busPolylines: busPolylines,
            },
        }
    }
}