<template>
  <div></div>
</template>
<script>
import { createVectorLayer, mergaPointStyleFn } from '@/utils/olFn'
import { Feature } from 'ol'
import { fromLonLat } from 'ol/proj'
import { Point } from 'ol/geom'
import { createStyleFn } from '@/utils/olFn'
import { getUuid } from '@/utils'
// 地图点元素组件
// @group 基础地图组件
export default {
  name: 'UcenOlPoint',
  props: {
    position: {
      type: Array,
      default: () => [0, 0]
    },
    extends: {
      type: [Array, Number, Object, String],
      default: () => undefined
    },
    styles: {
      type: Object,
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
    position: {
      handler(newVal) {
        if (newVal) {
          const feature = this.getFeatureById(this.id)
          if (feature) {
            feature.getGeometry().setCoordinates(fromLonLat(newVal))
            this.setStyle(feature)
          }
        }
      }
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
      id: `Point-${getUuid()}`,
      collectionPointsLayer: undefined
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
      this.drawPoint()
    },
    getFeature() {
      return this.getFeatureById(this.id)
    },
    getFeatureById(id) {
      return this.collectionPointsLayer.getSource().getFeatureById(id)
    },
    getLayer() {
      if (this.baseVectorLayer) {
        this.collectionPointsLayer = this.baseVectorLayer
      } else {
        this.baseMap.getLayers().forEach(item => {
          if (item.get('name') === 'defaultCollectionPointsLayer') {
            this.collectionPointsLayer = item
          }
        })
        if (!this.collectionPointsLayer) {
          this.collectionPointsLayer = createVectorLayer()
          this.collectionPointsLayer.set('name', 'defaultCollectionPointsLayer')
          this.baseMap.addLayer(this.collectionPointsLayer)
        }
      }
    },
    drawPoint() {
      const point = new Feature(new Point(fromLonLat(this.position)))
      point.setId(this.id)
      point.set('extends', this.extends)
      this.setStyle(point)
      this.collectionPointsLayer.getSource().addFeature(point)
      this.getExtent()
    },
    setStyle(feature) {
      if (feature) {
        const styles = mergaPointStyleFn(this.styles)
        const bdStyle = createStyleFn(styles)
        feature.setStyle(bdStyle)
      }
    },
    removePoint() {
      if (this.collectionPointsLayer) {
        const feature = this.getFeatureById(this.id)
        this.collectionPointsLayer.getSource().removeFeature(feature)
      }
    },
    getExtent() {
      const extent = this.collectionPointsLayer.getSource().getExtent()
      /**
       * 获取点范围
       * @arg 地图范围
       */
      this.$emit('getExtent', extent)
    }
  },
  beforeDestroy() {
    this.removePoint()
  }
}
</script>
