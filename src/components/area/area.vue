<template>
  <div></div>
</template>
<script>
import { ArrayToObject, getUuid } from '@/utils';
import { createStyleFn, createVectorLayer } from '@/utils/olFn';
import { Feature } from 'ol';
import { MultiPolygon, Polygon } from 'ol/geom';
import { Fill, Stroke, Style } from 'ol/style';

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

      if (!data.data || data.data.length === 0) {
        const json = require(`../../assets/map/${data.level}.json`);
        let features = json.features;
        if (data.code) {
          features = features.filter(item => data.code === item.properties.id);
        }
        this.drawAera(features, this.data.styles);
      }
      if (data.data) {
        const itemJson = require(`../../assets/map/${data.level}/${data.code}.json`);
        const dataObj = ArrayToObject(data.data, 'code');
        itemJson.features.forEach(item => {
          const d = dataObj[item.properties.id];
          if (d) {
            item.styles = d.styles;
          }
        });
        this.drawAera(itemJson.features, data.styles);
      }
    },
    drawAera(geo, styles) {
      const features = [];
      if (styles) {
        const style = createStyleFn(styles);
        this.areaVectorLayer.setStyle(style);
      }
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
        if (feature && item.styles) {
          const style = createStyleFn(item.styles);
          feature.setStyle(style);
        }
        features.push(feature);
      });

      this.areaVectorLayer.getSource().addFeatures(features);
    }
  }
};
</script>
