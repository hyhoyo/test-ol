<template>
  <div></div>
</template>
<script>
import { defaultStyleConfig } from '@/assets/config/mapConfig'
import { getUuid } from '@/utils'
import { createStyleFn, createVectorLayer, mergaLineStringStyleFn } from '@/utils/olFn'
import { Feature } from 'ol'
import { MultiLineString } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
// 地图多线元素组件
// @group 基础地图组件
export default {
  name: 'UcenOlMultiLineString',
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
      collectionMultiLineString: undefined
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
    },
    positions: {
      handler(newVal) {
        if (newVal) {
          const feature = this.getFeatureById(this.id)
          if (feature) {
            const data = newVal.map(item => {
              item = item.map(m => fromLonLat(m))
              return item
            })
            feature.getGeometry().setCoordinates(data)
          } else {
            this.load()
          }
        } else {
          this.removeMultiPolygon()
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
      this.drawMultiLineString()
    },
    getFeature() {
      return this.getFeatureById(this.id)
    },
    getFeatureById(id) {
      return this.collectionMultiLineString.getSource().getFeatureById(id)
    },
    getLayer() {
      if (this.baseVectorLayer) {
        this.collectionMultiLineString = this.baseVectorLayer
      } else {
        this.baseMap.getLayers().forEach(item => {
          if (item.get('name') === 'defaultcollectionMultiLineString') {
            this.collectionMultiLineString = item
          }
        })
        if (!this.collectionMultiLineString) {
          this.collectionMultiLineString = createVectorLayer()
          this.collectionMultiLineString.set('name', 'defaultcollectionMultiLineString')
          this.baseMap.addLayer(this.collectionMultiLineString)
        }
      }
    },
    drawMultiLineString() {
      const polygon = new Feature({
        geometry: new MultiLineString(this.positions).transform('EPSG:4326', 'EPSG:3857')
      })
      polygon.setId(this.id)
      this.setStyle(polygon)
      polygon.set('extends', this.extends)
      this.collectionMultiLineString.getSource().addFeature(polygon)
      this.getExtent()
    },
    setStyle(feature) {
      if (feature) {
        const styles = mergaLineStringStyleFn(this.styles)
        const style = createStyleFn(styles)
        feature.setStyle(style)
      }
    },
    removeMultiPolygon() {
      if (this.collectionMultiLineString) {
        const feature = this.getFeatureById(this.id)
        this.collectionMultiLineString.getSource().removeFeature(feature)
      }
    },
    getExtent() {
      const extent = this.collectionMultiLineString.getSource().getExtent()
      this.$emit('getExtent', extent)
    }
  },
  beforeDestroy() {
    this.removeMultiPolygon()
  }
}
</script>
