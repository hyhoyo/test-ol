<template>
  <div></div>
</template>
<script>
import { defaultStyleConfig } from '@/assets/config/mapConfig'
import { getUuid } from '@/utils'
import { createStyleFn, createVectorLayer, mergaPolygonStyleFn } from '@/utils/olFn'
import { Feature } from 'ol'
import { Polygon } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
// 地图面元素组件
// @group 基础地图组件
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
        if (newVal && newVal.length > 0) {
          const feature = this.getFeatureById(this.id)
          if (feature) {
            const data = newVal[0].map(item => fromLonLat(item))
            feature.getGeometry().setCoordinates([data])
            this.setStyle(feature)
          } else {
            this.load()
          }
        } else {
          this.removePolygon()
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
      this.drawPolygon()
    },
    getFeature() {
      return this.getFeatureById(this.id)
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
      this.setStyle(polygon)
      this.collectionPolygonsLayer.getSource().addFeature(polygon)
      this.getExtent()
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
    },
    getExtent() {
      const extent = this.collectionPolygonsLayer.getSource().getExtent()
      this.$emit('getExtent', extent)
    }
  },
  beforeDestroy() {
    this.removePolygon()
  }
}
</script>
