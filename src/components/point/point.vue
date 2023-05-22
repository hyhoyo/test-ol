<template>
  <div></div>
</template>
<script>
import { createVectorLayer } from '@/utils/olFn';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { createStyleFn } from '@/utils/olFn';
import { getUuid } from '@/utils';
import { Fill, Style, Text } from 'ol/style';
export default {
  name: 'UcenOlPoint',
  props: {
    position: {
      type: Array,
      default: () => [0, 0]
    },
    styles: {
      type: Object,
      default: () => undefined
    }
  },
  inject: {
    vectorLayer: {
      from: 'vectorLayer',
      default: undefined
    },
    map: {
      from: 'map',
      default: undefined
    }
  },
  watch: {
    styles: {
      handler(newVal) {
        if (!newVal || Object.keys(newVal).length > 0) {
          let _style = createStyleFn(newVal);
          const feature = this.getFeatureById(this.id);
          if (feature) {
            feature.setStyle(_style);
          }
        }
      }
    }
  },
  computed: {
    baseVectorLayer: function () {
      return this.vectorLayer && this.vectorLayer();
    },
    baseMap: function () {
      return this.map && this.map();
    }
  },
  data() {
    return {
      id: `Point-${getUuid()}`,
      collectionPointsLayer: undefined
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (!this.baseMap) {
        throw '未实例化地图';
      }
      this.load();
    },
    load() {
      this.getLayer();
      this.drawPoint();
    },
    getFeatureById(id) {
      return this.collectionPointsLayer.getSource().getFeatureById(id);
    },
    getLayer() {
      if (this.baseVectorLayer) {
        this.collectionPointsLayer = this.baseVectorLayer;
      } else {
        this.baseMap.getLayers().forEach(item => {
          if (item.getName === 'defaultCollectionPointsLayer') {
            this.collectionPointsLayer = item;
          }
        });
        if (!this.collectionPointsLayer) {
          this.collectionPointsLayer = createVectorLayer();
          this.collectionPointsLayer.set('name', 'defaultCollectionPointsLayer');
          this.baseMap.addLayer(this.collectionPointsLayer);
        }
      }
    },
    drawPoint() {
      const point = new Feature(new Point(fromLonLat(this.position)));
      point.setId(this.id);
      if (this.styles) {
        const style = createStyleFn(this.styles);
        point.setStyle(style);
      }
      this.collectionPointsLayer.getSource().addFeature(point);
    }
  }
};
</script>
