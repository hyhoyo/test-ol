<template>
  <div></div>
</template>
<script>
import { getUuid } from '@/utils';
import { createStyleFn, createVectorLayer } from '@/utils/olFn';
import { Feature } from 'ol';
import { MultiPolygon, Polygon } from 'ol/geom';

export default {
  name: 'ucenOlArea',
  props: {
    data: {
      type: Object,
      default: () => undefined
    }
  },
  inject: ['map'],
  computed: {
    baseMap: function () {
      return this.map && this.map();
    }
  },
  watch: {
    data: {
      handler(newVal) {
        if (!newVal.code) {
          return;
        }
      },
      deep: true
    }
  },
  data() {
    return {
      id: `Area-${getUuid()}`,
      areaVectorLayer: undefined,
      itemVectorLayer: undefined
    };
  },
  created() {
    this.init();
    this.getLayer();
    this.getAreaJson(this.data);
  },
  methods: {
    init() {
      if (!this.baseMap) {
        throw '未实例化地图';
      }
      this.load();
    },
    load() {},
    getLayer() {
      this.baseMap.getLayers().forEach(item => {
        if (item.getName === 'defaultCollectionAreaLayer') {
          this.areaVectorLayer = item;
        }
      });
      if (!this.areaVectorLayer) {
        this.areaVectorLayer = createVectorLayer();
        this.areaVectorLayer.set('name', 'defaultCollectionAreaLayer');
        this.baseMap.addLayer(this.areaVectorLayer);
      }
    },
    getAreaJson(data) {
      if (!data) return;
      const json = require(`../../assets/map/${data.level}.json`);
      this.drawAera(json.features);
    },
    drawAera(geo) {
      const features = [];
      geo.forEach(item => {
        let feature;
        if (item.geometry.type === 'MultiPolygon') {
          feature = new Feature({
            geometry: new MultiPolygon(item.geometry.coordinates).transform('EPSG:4326', 'EPSG:3857')
          });
        } else if (item.geometry.type === 'Polygon') {
          feature = new Feature({
            geometry: new Polygon(item.geometry.coordinates).transform('EPSG:4326', 'EPSG:3857')
          });
        }
        if (feature && this.data.styles) {
          const style = createStyleFn(this.data.styles);
          feature.setStyle(style);
        }
        features.push(feature);
      });

      this.areaVectorLayer.getSource().addFeatures(features);
    }
  }
};
</script>
