<template>
  <div></div>
</template>
<script>
import { defaultStyleConfig } from '@/assets/config/mapConfig'
import { getUuid } from '@/utils'
import { createStyleFn, createVectorLayer, mergaPolygonStyleFn } from '@/utils/olFn'
import { Feature } from 'ol'
import { MultiPolygon } from 'ol/geom'
export default {
  name: 'UcenOlMultiPolygon',
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
    },
    extent: {
      type: Boolean,
      default: () => false
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
      id: `MultiPolygon-${getUuid()}`,
      collectionMultiPolygonsLayer: undefined
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
      this.drawMultiPolygon()
    },
    getFeatureById(id) {
      return this.collectionMultiPolygonsLayer.getSource().getFeatureById(id)
    },
    getLayer() {
      if (this.baseVectorLayer) {
        this.collectionMultiPolygonsLayer = this.baseVectorLayer
      } else {
        this.baseMap.getLayers().forEach(item => {
          if (item.get('name') === 'defaultcollectionMultiPolygonsLayer') {
            this.collectionMultiPolygonsLayer = item
          }
        })
        if (!this.collectionMultiPolygonsLayer) {
          this.collectionMultiPolygonsLayer = createVectorLayer()
          this.collectionMultiPolygonsLayer.set('name', 'defaultcollectionMultiPolygonsLayer')
          this.baseMap.addLayer(this.collectionMultiPolygonsLayer)
        }
      }
    },
    drawMultiPolygon() {
      const polygon = new Feature({
        geometry: new MultiPolygon(this.positions).transform('EPSG:4326', 'EPSG:3857')
      })
      polygon.setId(this.id)
      this.setStyle(polygon)
      polygon.set('extends', this.extends)
      this.collectionMultiPolygonsLayer.getSource().addFeature(polygon)
    },
    setStyle(feature) {
      if (feature) {
        const styles = mergaPolygonStyleFn(this.styles)
        const style = createStyleFn(styles)
        feature.setStyle(style)
      }
    },
    removeMultiPolygon() {
      if (this.collectionMultiPolygonsLayer) {
        const feature = this.getFeatureById(this.id)
        this.collectionMultiPolygonsLayer.getSource().removeFeature(feature)
      }
    }
  },
  beforeDestroy() {
    this.removeMultiPolygon()
  }
}
</script>
