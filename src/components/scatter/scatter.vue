<template>
  <div></div>
</template>
<script>
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { setStyleFn } from '../../utils/olFn.js';

export default {
  name: 'UcenOlScatter',
  data() {
    return {};
  },
  inject: ['map'],
  computed: {
    map: function () {
      return this.map();
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.vertifyMap();
      this.setFeatures('#fff', 100);
    },
    vertifyMap() {
      if (!this.map) {
        throw new Error('未实例化地图');
      }
    },
    setFeatures(data) {
      let features = [];
      data.forEach((item, index) => {
        features.push(new Feature(new Point(item.coord)));
        features[index].set('name', item.name);
        features[index].set('value', item.value);
        const featureStyle = setStyleFn(item.style);
        console.log('=========>>>fff', featureStyle);
      });
    }
  }
};
</script>
