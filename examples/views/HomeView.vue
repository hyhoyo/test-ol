<template>
  <div class="home">
    12132
    <ucen-map />
  </div>
</template>

<script>
import UcenMap from '@src/map/map.vue';

export default {
  name: 'HomeView',
  components: {
    UcenMap
  }
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
}
</style>
