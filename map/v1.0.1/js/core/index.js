/* 
    依赖：
    index.js
    $objct.mixin
    layer.js
    $object.valueAt
*/
import mixins from "./main";
console.log(mixins)
~function (window, mixins) {
    class KMap extends $object.mixin(...Object.values(mixins)) {
        constructor() {
            super();
            this.$map = null;// 地图
        }
        static AMap// 地图类
        static complete// 脚本完成
        static loader({
            id = null,
            zoom = 14,
            mode,
            extendPlugin = [], // 扩展插件
            center = KMap.CENTER('default'),
            key = KMap.KEY('default'),
            mapStyle = KMap.THEME('default'),
            version = KMap.VERSION('default'),
        } = {}) {
            initState();// 初始化状态
            return new Promise((resolve, reject) => {
                // 脚本加载完成回调
                function complete() {
                    KMap.complete = function () {
                        KMap.AMap = window.AMap, create();
                    };
                    return 'KMap.complete';
                }
                // 加载脚本
                function script() {
                    KMap.STATE = 'starting';
                    var script = document.createElement('script'),
                        src = `http://webapi.amap.com/maps?v=${version}&key=${key}&plugin=${plugin()}&callback=${complete()}`;
                    script.type = 'text/javascript', script.src = src, script.async = true;
                    script.className = 'kmap-script__core';
                    document.body.appendChild(script);
                    script.addEventListener('error', error, {
                        capture: false,
                        once: true,
                        passive: false,
                    });
                    function error(e) {
                        KMap.STATE = 'error';
                        reject(e);
                    }
                };
                // 创建地图
                function create() {
                    id && document.getElementById(id) || MapError.containerExeception(id);
                    const kmap = new KMap();
                    // build map, save inner
                    kmap.$map = new AMap.Map(id, {
                        center,
                        zoom,
                        mapStyle,
                    });
                    KMap.STATE = 'success', resolve(kmap)
                };
                // 扩展插件
                function plugin() {
                    let total = KMap.LOADEDPLUGINS = KMap.PLUGIN(KMap.MODE).concat(extendPlugin);
                    return total.join(',').trim();
                };
                /* 有个Bug就是 不能创建两次脚本，安全模式已处理 */
                // 加载安全处理
                function safemode() {
                    if (KMap.STATE === 'unstart') return script(); // 处于未加载状态加载脚本
                    if (KMap.STATE === 'starting') setTimeout(safemode, 1 * 1000);// 前一个处于加载中状态 那么延迟加载
                    if (KMap.STATE === 'success') return create(); // 处于成功状态，直接创建地图
                    if (KMap.STATE === 'error') return console.error("地图加载失败");
                };
                safemode();
            })
            function initState() {
                if (mode) { KMap.MODE = mode };
            }
        }

    }

    window.KMap = KMap;
    // KMap.loader({ id });
}(window, mixins)
