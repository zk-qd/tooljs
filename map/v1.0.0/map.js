export default (function MapLoader() {
    return new Promise((resolve, reject) => {
        if (window.AMap) {
            resolve(window.AMap);
        } else {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = 'http://webapi.amap.com/maps?v=1.4.8&callback=initAMap&key=d2525acd90b55df8049b586027971d93&' +
                'plugin=AMap.MouseTool,AMap.Geocoder,AMap.ToolBar,AMap.PlaceSearch,AMap.GraspRoad,AMap.Autocomplete,'+
                'AMap.Scale,AMap.OverView,AMap.ToolBar,AMap.MouseTool,AMap.PolyEditor,AMap.Driving,AMap.LineSearch'
            script.onerror = reject;
            document.body.appendChild(script);
        }
        window.initAMap = () => {
            resolve(window.AMap);
        }
    });
})();