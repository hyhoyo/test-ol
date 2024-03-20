<template>
  <div></div>
</template>
<script>
import { defaultStyleConfig } from '@/assets/config/mapConfig'
import { getUuid } from '@/utils'
import { createStyleFn, createVectorLayer, mergaPolygonStyleFn } from '@/utils/olFn'
import { LineString } from 'ol/geom'
import { Feature } from 'ol'
import { fromLonLat } from 'ol/proj'
// 地图线元素组件
// @group 基础地图组件
export default {
  name: 'UcenOlLineString',
  props: {
    positions: {
      type: Array,
      default: () => undefined
    },
    styles: {
      type: Object,
      default: () => defaultStyleConfig
    },
    extend: {
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
      id: `LineString-${getUuid()}`,
      collectionLineStringLayer: undefined
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
            const data = newVal.map(item => fromLonLat(item))
            feature.getGeometry().setCoordinates(data)
          } else {
            this.load()
          }
        } else {
          this.removeLineString()
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
      this.drawLineString()
    },
    getFeature() {
      return this.getFeatureById(this.id)
    },
    getFeatureById(id) {
      return this.collectionLineStringLayer.getSource().getFeatureById(id)
    },
    getLayer() {
      if (this.baseVectorLayer) {
        this.collectionLineStringLayer = this.baseVectorLayer
      } else {
        this.baseMap.getLayers().forEach(item => {
          if (item.get('name') === 'defaultcollectionLineStringLayer') {
            this.collectionLineStringLayer = item
          }
        })
        if (!this.collectionLineStringLayer) {
          this.collectionLineStringLayer = createVectorLayer()
          this.collectionLineStringLayer.set('name', 'defaultcollectionLineStringLayer')
          this.baseMap.addLayer(this.collectionLineStringLayer)
        }
      }
    },
    drawLineString() {
      const lineString = new Feature({
        geometry: new LineString(this.positions).transform('EPSG:4326', 'EPSG:3857')
      })
      lineString.setId(this.id)
      this.setStyle(lineString)
      lineString.set('extends', this.extends)
      this.collectionLineStringLayer.getSource().addFeature(lineString)
      this.getExtent()
    },
    setStyle(feature) {
      if (feature) {
        const styles = mergaPolygonStyleFn(this.styles)
        const style = createStyleFn(styles)
        feature.setStyle(style)
      }
    },
    removeLineString() {
      if (this.collectionLineStringLayer) {
        const feature = this.getFeatureById(this.id)
        this.collectionLineStringLayer.getSource().removeFeature(feature)
      }
    },
    getExtent() {
      const extent = this.collectionLineStringLayer.getSource().getExtent()
      this.$emit('getExtent', extent)
    }
  },
  beforeDestroy() {
    this.removeLineString()
  }
}
</script>
