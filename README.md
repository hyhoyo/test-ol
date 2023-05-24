# he-ol-map-test

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
{
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

}
```
