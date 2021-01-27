/*
 * @Author: zk 
 * @Date: 2021-01-14 11:31:46 
 * @Last Modified by: zk
 * @Last Modified time: 2021-01-26 15:06:19
 */
(function (global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document
            ? (window.$user = factory(global))
            : function (window) {
                if (!window)
                    throw new Error("plugin requires a window with a document");
                return factory(global);
            };
    } else {
        window.$user = factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (global) {
    /**
    * @description 判断mobile or pc
    */
    function isMobile() {
        return /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)
    }
    /**
     * @description 判断浏览器类型
     */
    function browser() {
        let agent = window.navigator.userAgent,
            name, nickname;
        // document.write(agent)
        // 注意顺序 因为Edge也有谷歌的标识符
        if (agent.indexOf('Edge') > -1) {
            // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393 
            // alert('为保障您的正常的使用，请使用谷歌浏览器!');
            nickname = 'edge浏览器', name = 'Edge';
        } else if (agent.indexOf('Trident') > -1) {
            // Mozilla/5.0 (Windows NT 10.0; Win64; x64; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko
            // alert('为保障您的正常的使用，请使用谷歌浏览器!');
            nickname = 'ie浏览器', name = 'Trident'
        } else if (agent.indexOf('Opera') > -1) {
            nickname = 'Opera浏览器', name = 'Opera'
        } else if (agent.indexOf('Chrome') > -1) {
            // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36
            nickname = '谷歌浏览器', name = 'Chrome'
        } else if (agent.indexOf('Firefox') > -1) {
            // Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:71.0) Gecko/20100101 Firefox/71.0 
            nickname = '火狐浏览器', name = 'Firefox'
        } else if (agent.indexOf('Safari') > -1) {
            nickname = 'Safari浏览器', name = 'Safari'
        }
        return {
            name, nickname
        }
    }
    return {
        isMobile,
        browser,
    }
});
