<template>
  <div></div>
</template>
<script>
import { createVectorLayer } from '@/utils/olFn';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
export default {
  name: 'UcenOlPoint',
  props: {
    position: {
      type: Array,
      default: () => [0, 0]
    },
    styles: {
      type: Object,
      default: () => {
        return {};
      }
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
      defaultCollectionPointsLayer: undefined
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (!this.baseMap) {
        throw new Error('未实例化地图');
      }
      this.load();
    },
    load() {
      this.getLayer();
      this.drawPoint();
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
      point.setStyle({});
      this.collectionPointsLayer.getSource().addFeature(point);
    }
  }
};
</script>
