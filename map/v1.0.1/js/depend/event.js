// 事件类
export default class Event {
    /**
     * 事件绑定
     * @param {String} eventName 事件名称
     * @param {Any} target 目标对象
     * @param {Function} handler 回调函数
     * context.on('click',target,function(e) {})
     */
    on(eventName, target, handler) {
        if (this.validateEventName.call(target, eventName))
            this.bind.call(target, eventName, handler)
    }
    /**
     * 事件解绑
     * @param {String} eventName 事件名称
     * @param {Any} target 目标对象
     * @param {Function} handler 回调函数
     * context.off('click',target,function(e) {})
     */
    off(eventName, target, handler) {
        if (this.validateEventName.call(target, eventName))
            this.unbind.call(target, eventName, handler)
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
    /**
     * 校验绑定者是否存在该对象逻辑
     * @returns {String} eventName
     * @returns {Boolean} 
     */
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
        if (events && events.find(item => item.name === eventName)) return true;
        else throw new TypeError(`${name}不存在${eventName}事件`)
    }
}