<template>
  <UcenOlVectorLayer :styles="styles" name="customPoints">
    <UcenOlPoint v-for="(item, index) in positions" :key="'points-' + index" :position="item.position" :styles="item.styles" />
  </UcenOlVectorLayer>
</template>
<script>
import UcenOlPoint from '../point/point.vue'
import UcenOlVectorLayer from '../vectorLayer/vectorLayer.vue'
export default {
  name: 'UcenOlPoints',
  components: {
    UcenOlVectorLayer,
    UcenOlPoint
  },
  props: {
    positions: {
      type: Array,
      default: () => []
    },
    styles: {
      type: Object,
      default: () => undefined
    }
  }
}
</script>
