# 创建公交线路

```js
// 2. 创建点标记
let marker = this.kmap.createMarkerContent({
  position: position,
  map: this.kmap.$map,
  content: "<div class='marker-busStop'></div>",
  zooms: [16, 18]
});
// 3. 创建内容点标记
let contentMarker = this.kmap.createMarkerContent({
  position: position,
  map: this.kmap.$map,
  content: `<div class="marker-station-name">${index + 1}.${item.name}</div>`,
  zIndex: 999,
  zooms: [17, 18]
});
// 连线
let line = this.kmap.createLine({
  map: this.kmap.$map,
  path: path,
});
```
