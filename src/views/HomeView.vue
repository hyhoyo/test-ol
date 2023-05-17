<template>
  <div class="home">
    <div v-for="item in routes" :key="item.name" class="tempClass" v-show="item.name !== 'home'" @click="handleClick(item)">
      {{ item.name }}
    </div>
    <ucen-ol-map></ucen-ol-map>
  </div>
</template>

<script>
import { UcenOlMap } from '../components/index';
import { routes } from '@/router';
export default {
  name: 'HomeView',
  components: {
    UcenOlMap
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
</style>
