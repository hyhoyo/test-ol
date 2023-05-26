<template>
  <UcenOlVectorLayer :styles="styles" :name="'customPoints-' + id">
    <UcenOlPoint v-for="(item, index) in positions" :key="'points-' + index" :position="item.position" :styles="item.styles" />
  </UcenOlVectorLayer>
</template>
<script>
import { getUuid } from '@/utils'
import UcenOlPoint from '../point/point.vue'
import UcenOlVectorLayer from '../vectorLayer/vectorLayer.vue'
export default {
  name: 'UcenOlPoints',
  components: {
    UcenOlVectorLayer,
    UcenOlPoint
  },
  inject: {
    map: {
      from: 'map',
      default: undefined
    }
  },
  computed: {
    baseMap: function () {
      return this.map && this.map()
    }
  },
  data() {
    return {
      id: getUuid()
    }
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
  },
  beforeDestroy() {
    this.baseMap.getLayers().forEach(item => {
      if (item.get('name') === `customPoints-${this.id}`) {
        item.getSource().clear()
        this.baseMap.removeLayer(item)
      }
    })
  }
}
</script>
