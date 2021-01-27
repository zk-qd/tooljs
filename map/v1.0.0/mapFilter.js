export default {
    install(Vue) {

        // second转化
        Vue.filter('filterDuration',(duration)=> {
            if(duration>3600) {
                const hours = duration/3600
                const minute = duration%3600/60;
                return Math.floor(hours) + '小时' + Math.ceil(minute);
            }else if(duration > 60) {
                return Math.ceil(duration/60) + '分钟'
            }else {
                return '1分钟';
            }
        });

        // 米转化
        Vue.filter('filterDistance',(distance)=> {
            if(distance >= 1000) {
                return (distance/1000).toFixed(1) + '公里';
            }else if(distance > 1){
                return distance + '米';
            }else {
                return '1米';
            }
        });

        Vue.filter('filterPrice',(price)=> {
            return price + '元';
        })
    }
}