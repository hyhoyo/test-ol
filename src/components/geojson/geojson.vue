<template>
  <div></div>
</template>
<script>
import { defaultStyleConfig } from '@/assets/config/mapConfig'
import { createStyleFn, createVectorLayer, mergaPolygonStyleFn } from '@/utils/olFn'
import GeoJSON from 'ol/format/GeoJSON.js'
import { getUuid } from '@/utils'
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
      collectionGeojsonLayer: undefined
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
          this.collectionGeojsonLayer.set('id', this.id)
          this.collectionGeojsonLayer.set('name', 'defaultcollectionGeojsonLayer')
          this.baseMap.addLayer(this.collectionGeojsonLayer)
        }
      }
    },
    drawGeojson() {
      const geojson = new GeoJSON().readFeatures(this.geojson, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })
      console.log(geojson)
      geojson.forEach(geo => {
        this.setStyle(geo)
      })
      this.collectionGeojsonLayer.getSource().addFeatures(geojson)
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
        const id = this.collectionGeojsonLayer.getSource().get('id')
        if (id === this.id) {
          this.collectionGeojsonLayer.getSource().clear()
        }
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
