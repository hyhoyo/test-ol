<template>
  <div class="home">
    <div v-for="item in routes" :key="item.name" class="tempClass" v-show="item.name !== 'home'" @click="handleClick(item)">
      {{ item.name }}
    </div>
  </div>
</template>

<script>
import { routes } from '@/router';
export default {
  name: 'HomeView',
  components: {},
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
