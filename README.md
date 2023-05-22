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
		level: 'province', // province || regioncity
		data: [
			// 区域内
			{
				code: 'xx',
				value: '1000m',
				color: 'green'
			}
		]
	}
}
```

### 点-styles中参数与openlayers文档保持一致

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
