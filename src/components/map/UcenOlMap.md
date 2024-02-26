<template>
<div style="width: 100%;height: 400px">
  <ucen-ol-map :mapConfig="mapConfig" @ready="onReady"></ucen-ol-map>
</div>
</template>

#  docute 可以 mixins vue的代码,相当于 import 下面这段代码并混入,并不会被展示
```js {mixin:true}
{
  data() {
    return {
      mapConfig: {
        basemap: [
          {
            id: 'china',
            name: 'xyz',
            visible: false,
            title: '矢量地图',
            maxZoom: 9,
            minZoom: 4,
            url: 'http://172.39.8.63:8000/services/quanguo/tiles/{z}/{x}/{y}.png'
          },
          {
            id: 'china1',
            name: 'xyz',
            title: '卫星地图',
            visible: true,
            maxZoom: 9,
            minZoom: 4,
            url: 'http://172.39.8.63:8000/services/quanguo/tiles/{z}/{x}/{y}.png?render=tech'
          }
        ]
      }
    }
  },
  methods:{
    onReady() {
      
    }
  }
}
```

# 用来作为 markdown 代码的示例部分
```html
<template>
  <ucen-ol-map :mapConfig="mapConfig" @ready="onReady"></ucen-ol-map>
</template>
<script>
export default {
  data() {
    return {
      mapConfig: {
        basemap: [
          {
            id: 'china',
            name: 'xyz',
            visible: false,
            title: '矢量地图',
            maxZoom: 9,
            minZoom: 4,
            url: 'http://172.39.8.63:8000/services/quanguo/tiles/{z}/{x}/{y}.png'
          },
          {
            id: 'china1',
            name: 'xyz',
            title: '卫星地图',
            visible: true,
            maxZoom: 9,
            minZoom: 4,
            url: 'http://172.39.8.63:8000/services/quanguo/tiles/{z}/{x}/{y}.png?render=tech'
          }
        ]
      }
    }
  },
  methods:{
    onReady(){
      alert('map ready!')
    }
  }
}
</script>

```
