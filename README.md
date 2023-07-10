# ucen-map

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### 地图 config 设置

styles 为可选-参数与文档保持一致

```
{
  center: [104.1823, 35.8147],
  zoom: 4,
  basemap: [
    {
      id: 'china',
      name: 'xyz',
      visible: true,
      title: '矢量地图',
      maxZoom: 9,
      minZoom: 4,
      url: 'http://172.39.8.63:8000/services/quanguo/tiles/{z}/{x}/{y}.png'
    }
  ],
  vectormap: [],
  geojson: [
    {
      id: 'cityjson',
      name: 'geojson',
      visible: true,
      source: {
        url: 'http://172.39.8.63:8000/assets/city.json'
      },
      styles: {
        fill: 'transparent',
        stroke: 'red'
      }
    }
  ],
	extends: any // 扩展数据, 点击查询返回
}
```

### 区域-对比图（area）

```
{
	data: {
		// 选中区域
		code: 'xxx',
		features: [],
		styles: {
          fill: 'transparent',
          stroke: '#000000'
        },
		data: [
			// 区域内
			{
				code: 'xx',
				value: '1000m',
				features: [],
				styles: {
							// font 生效需要指定字体
							text: {
								font: '20px Calibri,sans-serif',
								fill: '#315efb'
							},
              fill: '#27ff0080',
              stroke: 'red' || {color: 'red', width: 10}
            }
			}
		]
	}
}
```

### 点-styles 中参数与 openlayers 文档保持一致

```
	position: [0, 0],
	styles: {
		text: {
			font: '12px PingFang SC',
			justify: 'center',
			textAlign:'center',
			fill: '#000',
			stroke: '#fff'
		},
		icon: {
			fill: '#000',
			stroke: '#fff',
			radius: '15px'
		},
		image: {
			src: 'http://www.baidu.com'
		}
	}
```

### 多点-styles 中参数与 openlayers 文档保持一致

外部 styles 为统一设置
内部 styles 为单个 position 设置样式

```
  positions: [
    {
      position: [],
      styels: {}
    },
    ...
  ],
  styles: {
    text: {
			font: '12px PingFang SC',
			justify: 'center',
			textAlign:'center',
			fill: '#000',
			stroke: '#fff'
		},
		icon: {
			fill: '#000',
			stroke: '#fff',
			radius: '15px'
		},
		image: {
			src: 'http://www.baidu.com'
		}
  }

```
### 工具
```
Grid					格网类
HexGrid				六边形类
getArea				获取多边形面积
getDistance		获取点到点的距离
getPerimeter	获取多边形周长

### 坐标转换函数
gcj02Tobd09		
bd09Togcj02,
bd09Towgs84,
wgs84Togcj02,
wgs84Tobd09,
gcj02Towgs84 

### 地图方法
renderXYZ 自定义切片地图加载
const xyzCongif = {
		mapProxyUrl: 'http://172.39.8.63:16501/mapproxy',
		url: 'http://172.39.8.63:8000/services/quanguo/tiles',
		param: '',
		render: 'color',
		renderopt: {
			reverse: true,
			graylevel: [0.63, 0.3, 0.1],
			coloroffset: [0, 0, 80]
		}
}
renderXYZ(map, xyzConfig) // map对象
```

