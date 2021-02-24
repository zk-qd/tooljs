/*
 * @Author: zk 
 * @Date: 2021-01-26 14:08:16 
 * @Last Modified by: zk
 * @Last Modified time: 2021-02-24 09:55:02
 */
/**
 * TODO 依赖
 * * $user
 */
(function (global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document
            ? window.$adaptive = factory(global)
            : factory(global);
    } else {
        window.$adaptive = factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (global) {
    const isMobile = $user.isMobile();

    // 常见的字体大小: 12px、14px、16px、18px、
    const PC_NORMAL_WIDTH = 1920; // 以1920为基准
    const PC_NORMAL_SIZE = 12; // 以1920为基准下的字体大小

    // 常见的字体大小: 24px、26px、28px、30px、32px、34px，36px等等。记住是偶数的。最小字号20px。
    const MOBILE_NORMAL_WIDTH = 750;
    const MOBILE_NORMAL_SIZE = 24;

    const NORMAL_REMS = 10; // 浏览器分成10个rem等分
    const PC_NORMAL_FULL = false; // 是否全屏适配字体
    const PC_NORMAL_ZOOM = false; // 是否缩放适配字体


    /* 不同屏幕下浏览器的标准 */
    const PC_NORMAL_SCREEN = [
        {
            min: PC_NORMAL_WIDTH * 0.8, // 允许最小宽度 1536
            max: PC_NORMAL_WIDTH, // 允许最大宽度
            dp: PC_NORMAL_WIDTH, // 设备宽度
            description: '小屏',
            size: PC_NORMAL_SIZE, // 字体大小
            rem: PC_NORMAL_WIDTH / NORMAL_REMS, // 1rem多少像素
        },
        {
            min: 2560 * 0.8, // 2048
            max: 2560,
            dp: 2560,
            description: '大屏',
            size: PC_NORMAL_SIZE * 2560 / PC_NORMAL_WIDTH, // 16
            rem: 2560 / NORMAL_REMS,
        },
        {
            min: 3840 * 0.8, // 2048
            max: 3840,
            dp: 3840,
            description: '超大屏',
            size: PC_NORMAL_SIZE * 3840 / PC_NORMAL_WIDTH, // 16
            rem: 3840 / NORMAL_REMS,
        },
    ]
    /**
     * @description mobile or pc下的标准参数
     * @todo 移动端和pc端设计稿的属性
     */
    function draft() {
        if (isMobile) return {
            width: MOBILE_NORMAL_WIDTH,
            size: MOBILE_NORMAL_SIZE,
            rems: NORMAL_REMS,
        };
        else return {
            width: PC_NORMAL_WIDTH,
            size: PC_NORMAL_SIZE,
            rems: NORMAL_REMS,
        };
    }
    /**
     * @description 各种情况下的当前浏览器的``虚拟宽度``
     * @param {Number} width 当前浏览器的宽度
     * @param {Boolean} full 如果为false，那么字体大小和是否全屏无关
     * @param {Boolean} zoom 如果为false，那么字体大小和是否缩放无关
     * @return {Number} 转换后的宽度
     * @todo 移动端会返回传入的宽度-因为移动端不能缩放并且全屏
     * @todo 如果全屏和缩放字体都要变 那么可以设置full和zoom为true -- 非常不建议，可能会引起其他问题，如果做媒体布局不会兼容这种方式，resize会兼容
     * @todo full_width, zoom_width都是假设下得出来的宽度，虚拟的
     */
    function virtualWidth(width/* 浏览器的实际宽度全屏或者非全屏 */, full = false, zoom = false) {
        let dp_width,
            full_innerWidth,// 全屏下的浏览器实际宽度
            full_width, // 100%缩放的实际宽度，全屏或非全屏
            zoom_width, // 全屏的实际宽度，各种缩放状态下
            screen_width = screen.width,
            dpr = window.devicePixelRatio || 1;
        if (isMobile || full && zoom) return width; // 最新移动端和dpr没有关系
        // 获取物理像素
        let index = PC_NORMAL_SCREEN.findIndex(item => width >= item.min && width <= item.max); // pc
        if (index == -1) dp_width = width; // 这里暂时没想到好的办法
        else dp_width = PC_NORMAL_SCREEN[index].dp;

        if (full) { // 100%缩放时的虚拟宽度，字体和设备以及是否全屏有关，和是否缩放无关
            return width * dpr;
        } else if (zoom) { // 全屏的虚拟宽度，字体和设备以及是否缩放有关，和是否全屏无关
            return dp_width / dpr;
        }
        else if (!full && !zoom) { //当前设备的物理像素，字体只和设配有关
            return dp_width;
        }
    }
    /**
     * @description px转rem
     * @param {Number} pixel 像素数值
     * @return {Number} 返回转成rem的数值
     * @todo 该方法在以 MOBILE_NORMAL_WIDTH or PC_NORMAL_WIDTH 为参照物使用的
     * @todo 用于pxtorem插件无法转换的地方 如行内样式
     * @todo 建议不要rem转px，因为px某种程度来说是绝对值
     * @todo 适用于mobile和pc
     * @todo 在1920或者750像素下事先转好,px转rem本就是在设计稿的宽度下事先转好
     */
    function pxtorem(pixel) {
        return pixel / (draft().width / NORMAL_REMS)
    }
    /**
     * @description 以1920 or 750 为基的标准像素得到其他不同分辨率的像素
     * @param {Number} pixel 参考px 
     * @return {Number} 返回当前屏幕下的实际px
     * @todo 用于无法使用rem的地方，如echart
     * @todo 适用于mobile和pc
     * @todo 注意的是： pc端用的full或者zoom，那么缩放或者非全屏的时候没办法实时转换，只能刷新页面才行，
     * @todo 能用pxtorem尽量用 
     */
    function realpx(pixel) {
        let px = pixel * virtualWidth(window.innerWidth, PC_NORMAL_FULL, PC_NORMAL_ZOOM) / draft().width;
        // if (isMobile) {//移动端需要dpr
        //     let dpr = window.devicePixelRatio || 1;
        //     return px * dpr;
        // } else {/* dpr因为我virtualWidth处理过了所以不要dpr了 */
        //     return px;
        // }
        return px;
    };
    /**
     * @description 根据屏幕浏览器大小调整html的字体大小
     * @param {Boolean} isMedia 是否使用媒体布局
     * @todo 适用于pc端的rem布局
     * //移动端不需要调整，因为有flexible
     * @todo 移动端已合并进来
     * @todo 移动端不支持媒体布局
     */
    function adapt(isMedia = false) {
        if (isMedia && !isMobile) media();
        else resize();
    }


    /**
     * @description 根据屏幕大小变化实时调整
     */
    function resize() {
        const docEl = document.documentElement;
        setRemUnit(), window.addEventListener('resize',
            $tool.throttle(setRemUnit, 400),
            {
                once: false,
                passive: true,
                capture: false,
            }), window.addEventListener('pageshow', e => e.persisted && setRemUnit()); // 为true则是读取缓存
        // 1rem = 多少px?
        function setRemUnit() {
            let width = virtualWidth(window.innerWidth, PC_NORMAL_FULL, PC_NORMAL_ZOOM);
            docEl.style.fontSize = width / NORMAL_REMS + 'px !important'
        }
    }
    /**
     * @description 媒体布局
     * @todo 还可以创建style用内联样式媒体布局，适用于full和zoom都为false的情况
     */
    function media() {
        const styleEl = document.createElement('style'), headEL = document.head;
        styleEl.innerHTML = PC_NORMAL_SCREEN.reverse().map(screen => `@media screen and (max-width: ${screen.dp}) {html { font-size: ${screen.rem}px!important; }}`).join('').trim();
        headEL.insertAdjacentElement('afterend', styleEl);
    }

    /**
     * @description 设置字体的默认大小，因为字体是继承的，
     * @todo 这个lib-flexible的 一般没必要使用
     */
    function setBodyFontSize() {
        if (document.body) {
            var dpr = window.devicePixelRatio || 1;
            document.body.style.fontSize = (12 * dpr) + 'px'
        }
        else {
            document.addEventListener('DOMContentLoaded', setBodyFontSize)
        }
    }
    /**
     * @description detect 0.5px supports
     * @todo 判断是否支持0.5px
     * @todo 一般没必要使用
     */
    function hairlines() {
        const dpr = window.devicePixelRatio || 1,
            docEl = document.documentElement;
        if (dpr >= 2) {
            var fakeBody = document.createElement('body')
            var testElement = document.createElement('div')
            testElement.style.border = '.5px solid transparent'
            fakeBody.appendChild(testElement)
            docEl.appendChild(fakeBody)
            if (testElement.offsetHeight === 1) {
                docEl.classList.add('hairlines')
            }
            docEl.removeChild(fakeBody)
        }
    }

    return {
        // 方法
        draft,
        pxtorem,
        realpx,
        adapt,
        // 属性
        /* PC_NORMAL_WIDTH,
        PC_NORMAL_SIZE,
        PC_NORMAL_FULL,
        PC_NORMAL_ZOOM,
        MOBILE_NORMAL_WIDTH,
        MOBILE_NORMAL_SIZE,
        NORMAL_REMS, */
    }

});

