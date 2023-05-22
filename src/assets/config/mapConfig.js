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
    {
      id: 'cityjson',
      name: 'geojson',
      visible: true,
      source: {
        url: 'http://172.39.8.63:8000/assets/city.json'
      }
    }
  ]
};

export { mapDefaultConfig };
