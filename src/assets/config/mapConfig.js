const mapDefaultConfig = {
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
    // {
    //   id: 'cityjson',
    //   name: 'geojson',
    //   visible: true,
    //   source: {
    //     url: 'http://172.39.8.63:8000/assets/city.json'
    //   }
    // styles: {
    //   fill: 'transparent',
    //   stroke: 'red'
    // }
    // }
  ]
}

const defaultStyleConfig = {
  areaCompare: {
    stroke: '#3399CC'
  },
  scatter: {
    circle: {
      stroke: '#319FD3',
      fill: 'rgba(255, 255, 255, 0.6)',
      radius: 5,
      width: 1
    }
  },
  point: {
    circle: {
      stroke: '#319FD3',
      fill: 'rgba(255, 255, 255, 0.6)',
      radius: 5,
      width: 1
    }
  },
  polygon: {
    stroke: '#319FD3',
    fill: 'rgba(255, 255, 255, 0.6)',
    width: 1
  }
}

export { mapDefaultConfig, defaultStyleConfig }
