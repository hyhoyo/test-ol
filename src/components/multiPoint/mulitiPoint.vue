<template>
  <div></div>
</template>
<script>
import { defaultStyleConfig } from '@/assets/config/mapConfig'
import { getUuid } from '@/utils'
import { createStyleFn, createVectorLayer, mergaPointStyleFn } from '@/utils/olFn'
import { Feature } from 'ol'
import { MultiPoint } from 'ol/geom'
// 地图多线元素组件
// @group 基础地图组件
export default {
  name: 'UcenOlMultiPoint',
  props: {
    positions: {
      type: Array,
      default: () => undefined
    },
    styles: {
      type: Object,
      default: () => defaultStyleConfig
    },
    extends: {
      type: [Array, Number, Object, String],
      default: () => undefined
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
      return this.vectorLayer && this.vectorLayer()
    },
    baseMap: function () {
      return this.map && this.map()
    }
  },
  data() {
    return {
      id: `MultiLineString-${getUuid()}`,
      collectionMultiPoint: undefined
    }
  },
  watch: {
    styles: {
      handler(newVal) {
        if (!newVal || Object.keys(newVal).length > 0) {
          const feature = this.getFeatureById(this.id)
          if (feature) {
            this.setStyle(feature)
          }
        }
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.baseMap) {
        throw '未实例化地图'
      }
      this.load()
    },
    load() {
      this.getLayer()
      this.drawMultiPoint()
    },
    getFeature() {
      return this.getFeatureById(this.id)
    },
    getFeatureById(id) {
      return this.collectionMultiPoint.getSource().getFeatureById(id)
    },
    getLayer() {
      if (this.baseVectorLayer) {
        this.collectionMultiPoint = this.baseVectorLayer
      } else {
        this.baseMap.getLayers().forEach(item => {
          if (item.get('name') === 'defaultcollectionMultiLineString') {
            this.collectionMultiPoint = item
          }
        })
        if (!this.collectionMultiPoint) {
          this.collectionMultiPoint = createVectorLayer()
          this.collectionMultiPoint.set('name', 'defaultcollectionMultiLineString')
          this.baseMap.addLayer(this.collectionMultiPoint)
        }
      }
    },
    drawMultiPolygon() {
      const polygon = new Feature({
        geometry: new MultiPoint(this.positions).transform('EPSG:4326', 'EPSG:3857')
      })
      polygon.setId(this.id)
      this.setStyle(polygon)
      polygon.set('extends', this.extends)
      this.collectionMultiPoint.getSource().addFeature(polygon)
      this.getExtent()
    },
    setStyle(feature) {
      if (feature) {
        const styles = mergaPointStyleFn(this.styles)
        const style = createStyleFn(styles)
        feature.setStyle(style)
      }
    },
    removeMultiPolygon() {
      if (this.collectionMultiPoint) {
        const feature = this.getFeatureById(this.id)
        this.collectionMultiPoint.getSource().removeFeature(feature)
      }
    },
    getExtent() {
      const extent = this.collectionMultiPoint.getSource().getExtent()
      this.$emit('getExtent', extent)
    }
  },
  beforeDestroy() {
    this.removeMultiPolygon()
  }
}
</script>
