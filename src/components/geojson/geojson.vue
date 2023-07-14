<template>
  <div></div>
</template>
<script>
import { defaultStyleConfig } from '@/assets/config/mapConfig'
import { createStyleFn, createVectorLayer, mergaPolygonStyleFn } from '@/utils/olFn'
import GeoJSON from 'ol/format/GeoJSON.js'
import { getUuid } from '@/utils'
// Geojson地图图层组件
// @group 基础地图组件
export default {
  name: 'UcenOlGeoJSON',
  props: {
    geojson: {
      type: Object,
      default: () => undefined
    },
    styles: {
      type: Object,
      default: () => defaultStyleConfig
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
      id: `Geojson-${getUuid()}`,
      collectionGeojsonLayer: undefined,
      features: []
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
      this.drawGeojson()
    },
    getFeature() {
      return this.getFeatureById(this.id)
    },
    getFeatureById(id) {
      return this.collectionGeojsonLayer.getSource().getFeatureById(id)
    },
    getLayer() {
      if (this.baseVectorLayer) {
        this.collectionGeojsonLayer = this.baseVectorLayer
      } else {
        this.baseMap.getLayers().forEach(item => {
          if (item.get('name') === 'defaultcollectionGeojsonLayer') {
            this.collectionGeojsonLayer = item
          }
        })
        if (!this.collectionGeojsonLayer) {
          this.collectionGeojsonLayer = createVectorLayer()
          this.collectionGeojsonLayer.set('name', 'defaultcollectionGeojsonLayer')
          this.baseMap.addLayer(this.collectionGeojsonLayer)
        }
      }
    },
    drawGeojson() {
      this.features = new GeoJSON().readFeatures(this.geojson, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })
      this.features.forEach(geo => {
        this.setStyle(geo)
      })
      this.collectionGeojsonLayer.getSource().addFeatures(this.features)
      this.getExtent()
    },
    setStyle(feature) {
      if (feature) {
        const styles = mergaPolygonStyleFn(this.styles)
        const style = createStyleFn(styles)
        feature.setStyle(style)
      }
    },
    removeGeojson() {
      if (this.collectionGeojsonLayer) {
        ;(this.features || []).forEach(item => {
          this.collectionGeojsonLayer.getSource().removeFeature(item)
        })
      }
    },
    getExtent() {
      const extent = this.collectionGeojsonLayer.getSource().getExtent()
      this.$emit('getExtent', extent)
    }
  },
  beforeDestroy() {
    this.removeGeojson()
  }
}
</script>
