<template>
  <div class="home">
    <div v-for="item in routes" :key="item.name" class="tempClass" v-show="item.name !== 'home'" @click="handleClick(item)">
      {{ item.name }}
    </div>
    <ucen-ol-map>
      <!-- <ucen-ol-vector-layer>
        <ucen-ol-scatter></ucen-ol-scatter>
      </ucen-ol-vector-layer> -->
      <ucen-ol-point :position="[103.6, 35]"></ucen-ol-point>
    </ucen-ol-map>
  </div>
</template>

<script>
import { UcenOlMap, UcenOlScatter, UcenOlVectorLayer, UcenOlPoint } from '../components/index';
import { routes } from '@/router';
export default {
  name: 'HomeView',
  components: {
    UcenOlMap,
    UcenOlScatter,
    UcenOlVectorLayer,
    UcenOlPoint
  },
  data() {
    return {
      routes
    };
  },
  mounted() {},
  methods: {
    handleClick(item) {
      this.$router.push({ name: item.name });
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
