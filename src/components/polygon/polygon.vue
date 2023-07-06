<template>
  <div></div>
</template>
<script>
import { defaultStyleConfig } from '@/assets/config/mapConfig'
import { getUuid } from '@/utils'
import { createStyleFn, createVectorLayer, mergaPolygonStyleFn } from '@/utils/olFn'
import { Feature } from 'ol'
import { Polygon } from 'ol/geom'
export default {
  name: 'UcenOlPolygon',
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
      id: `Polygon-${getUuid()}`,
      collectionPolygonsLayer: undefined
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
      this.drawPolygon()
    },
    getFeatureById(id) {
      return this.collectionPolygonsLayer.getSource().getFeatureById(id)
    },
    getLayer() {
      if (this.baseVectorLayer) {
        this.collectionPolygonsLayer = this.baseVectorLayer
      } else {
        this.baseMap.getLayers().forEach(item => {
          if (item.get('name') === 'defaultCollectionPolygonsLayer') {
            this.collectionPolygonsLayer = item
          }
        })
        if (!this.collectionPolygonsLayer) {
          this.collectionPolygonsLayer = createVectorLayer()
          this.collectionPolygonsLayer.set('name', 'defaultCollectionPolygonsLayer')
          this.baseMap.addLayer(this.collectionPolygonsLayer)
        }
      }
    },
    drawPolygon() {
      const polygon = new Feature(new Polygon(this.positions).transform('EPSG:4326', 'EPSG:3857'))
      polygon.setId(this.id)
      polygon.set('extends', this.extends)
      console.log(polygon)
      this.setStyle(polygon)
      this.collectionPolygonsLayer.getSource().addFeature(polygon)
    },
    setStyle(feature) {
      if (feature) {
        const styles = mergaPolygonStyleFn(this.styles)
        const style = createStyleFn(styles)
        feature.setStyle(style)
      }
    },
    removePolygon() {
      if (this.collectionPolygonsLayer) {
        const feature = this.getFeatureById(this.id)
        this.collectionPolygonsLayer.getSource().removeFeature(feature)
      }
    }
  },
  beforeDestroy() {
    this.removePolygon()
  }
}
</script>
