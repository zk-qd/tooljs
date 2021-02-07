
// 元素相关类
window.$dom = {
    // 复制元素文本
    copyText(dom) {
        return new Promise((resolve, reject) => {
            try {
                if (document.body.createTextRange) {
                    let range = document.body.createTextRange();
                    range.moveToElementText(dom);
                    range.select();
                } else if (window.getSelection) {
                    let selection = window.getSelection();
                    let range = document.createRange();
                    range.selectNodeContents(dom);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                document.execCommand("copy");
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    },

    /**
     * @description 图片封面适应
     * @param {object} 
     * @return {dom} 图片对象
     * @todo 图片宽度任何情况都等于容器宽度，宽度缩放到100%，高度等比例缩放，这时如果高度小于容器高度，那么高度设为100%，反之不变
     * @todo 根据以上需求，图片高度可能会拉升，但是不会出现图片没有占满容器
     */
    adaptImgCover({
        width,// 容器宽度
        height,// 容器高度
        url, // 图片地址
    }) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = url;
            img.onload = function () {
                resolve(adapt(img));
            }
            img.onerror = reject;
        })
        function adapt(img) {
            let w = img.width,
                h = img.height,
                zoomW = width, // 图片宽度等于容器宽度
                zoomH = h * width / w; // 图片高度等比例缩放
            if (zoomH < height) zoomH = height;
            img.width = zoomW;
            img.height = zoomH;
            return img;
        }
    },
    

}