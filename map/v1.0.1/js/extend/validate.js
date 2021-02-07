// 经纬度正则
const lng_regxep = /^-?(0|[0-9]?|([0-9]?[0-9]?)|(1?[0-7]?[0-9]?))(([.][0-9]+)?)|180(([.][0]+)?)$/
const lat_regxep = /^-?((0|[0-9]?|[1-8]?[0-9]?)(([.][0-9]+)?)|90(([.][0]+)?))$/

export function validateLngLat(lng, lat) {
    /* 不能为空 且校验通过 */
    if (lng && lat && lng_regxep.test(lng) && lat_regxep.test(lat)) return true;
    return false;
}
export function validateLng(lng) /* 校验经度 */ {
    /* 不能为空 且校验通过 */
    if (lng && lng_regxep.test(lng)) return true;
    return false;
}
export function validateLat(lat) /* 校验纬度 */ {
    /* 不能为空 且校验通过 */
    if (lat && lat_regxep.test(lat)) return true;
    return false;
}







