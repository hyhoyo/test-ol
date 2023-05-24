<template>
  <div class="home">
    <div v-for="item in routes" :key="item.name" class="tempClass" v-show="item.name !== 'home'" @click="handleClick(item)">
      {{ item.name }}
    </div>
    <ucen-ol-map>
      <!-- <ucen-ol-vector-layer>
        <ucen-ol-scatter></ucen-ol-scatter>
      </ucen-ol-vector-layer> -->
      <ucen-ol-area :data="areaData"></ucen-ol-area>
      <!-- <ucen-ol-point :position="[103.6, 35]" :styles="styles"></ucen-ol-point> -->
    </ucen-ol-map>
  </div>
</template>

<script>
import { UcenOlMap, UcenOlScatter, UcenOlVectorLayer, UcenOlPoint, UcenOlArea } from '../index';
import { routes } from '@/router';
export default {
  name: 'HomeView',
  components: {
    UcenOlMap,
    UcenOlScatter,
    UcenOlVectorLayer,
    UcenOlPoint,
    UcenOlArea
  },
  data() {
    return {
      areaData: {},
      routes,
      styles: undefined
    };
  },
  created() {
    this.setAreaData();
  },
  mounted() {
    setTimeout(() => {
      this.styles = {
        text: {
          text: '100',
          padding: [4, 7, 4, 7],
          fill: '#000000',
          backgroundFill: 'red'
        }
      };
    }, 3000);
  },
  methods: {
    handleClick(item) {
      this.$router.push({ name: item.name });
    },
    setAreaData() {
      const areaData = {
        level: 'province',
        code: '51',
        features: [],
        styles: {
          fill: 'transparent',
          stroke: '#000000'
        },
        data: [
          {
            code: '510100',
            value: '1000m',
            styles: {
              fill: '#27ff0080',
              stroke: 'red'
            }
          }
        ]
      };
      areaData.features = require(`../assets/map/${areaData.level}/${areaData.code}.json`).features;
      this.areaData = areaData;
    }
  }
};
</script>
<style scoped>
.tempClass {
  display: inline-block;
  margin-right: 20px;
}
.home {
  width: 100%;
  height: 100%;
}
</style>
