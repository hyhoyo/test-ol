<template>
  <div>
    <slot v-if="layer" />
  </div>
</template>
<script>
import { createVectorLayer } from '@/utils/olFn';

export default {
  name: 'UcenOlVectorLayer',
  data() {
    return {
      layer: undefined
    };
  },
  inject: {
    map: {
      from: 'map',
      default: undefined
    }
  },
  provide: function () {
    return {
      vectorLayer: () => this.layer
    };
  },
  computed: {
    baseMap: function () {
      return this.map && this.map();
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (!this.baseMap) {
        throw '未实例化地图';
      }
      this.createLayer();
    },
    createLayer() {
      if (!this.layer) {
        this.layer = createVectorLayer();
        this.baseMap.addLayer(this.layer);
      }
    },
    clear() {
      if (this.layer) {
        this.layer.getSource().clear();
      }
    },
    remove() {
      if (this.layer) {
        this.baseMap.removeLayer(this.layer);
        this.layer = undefined;
      }
    }
  }
};
</script>
