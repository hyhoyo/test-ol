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
  ]
}
```

### 区域-对比图（area）

```
{
	data: {
		// 选中区域
		code: 'xxx',
		level: 'province', // province || regioncity,
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
				styles: {
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
