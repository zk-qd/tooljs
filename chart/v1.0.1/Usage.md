# series

### type 的值

```
1. bar 柱状图
2. line 线图
3. pie 饼图

```

# y 轴如何两边显示

1. yAxis 的 position 属性为 right，默认为 left
2. 如果 yAxis 有多个，那么 series 就要设置 yAxisIndex 为指定索引，默认 yAxisIndex 为 0，同理 xAxisIndex 也是一样的

# series 如何和 axis 的数值轴对应

1. series 默认都是对应到 axis 的第一个，当然具体的需要自己调控，他们是多对多关系

# 值堆叠

1. 如 bar，柱状图的堆叠，加上这个 stack: "vistors", 属性，就可以实现

# 条纹

1. axis 的 splitArea 属性，设置在数值轴上

# tooltip 显示的垂直线的样式

1. axis 的 axisPointer，设置在数值轴上

# tooltip 显示轴上蓝色的块值

1. 这是 tooltip 的 axisPointer: { // 交叉显示 type: "cross" },设置成这样就行了
