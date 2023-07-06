<template>
  <div></div>
</template>
<script>
import { ArrayToObject, getUuid } from '@/utils'
import { createStyleFn, createVectorLayer, mergaAreaCompareStyleFn, recusionStyleFn } from '@/utils/olFn'
import { Feature } from 'ol'
import { MultiPolygon, Polygon } from 'ol/geom'
import { defaultStyleConfig } from '@/assets/config/mapConfig'

export default {
  name: 'UcenOlArea',
  props: {
    data: {
      type: Object,
      default: () => undefined
    },
    styles: {
      type: Object,
      default: () => defaultStyleConfig
    },
    extent: {
      type: Boolean,
      default: () => false
    }
  },
  inject: ['map'],
  computed: {
    baseMap: function () {
      return this.map && this.map()
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.clear()
        if (!newVal.features) {
          return
        }
        this.getAreaJson(newVal)
      },
      deep: true
    },
    styles: {
      handler(newVal) {
        if (Object.keys(newVal).length > 0) {
          this.clear()
          this.getAreaJson(this.data)
        }
      },
      deep: true
    }
  },
  data() {
    return {
      id: `Area-${getUuid()}`,
      areaVectorLayer: undefined,
      itemVectorLayer: undefined
    }
  },
  created() {
    this.init()
    this.getLayer()
    this.getAreaJson(this.data)
  },
  methods: {
    init() {
      if (!this.baseMap) {
        throw '未实例化地图'
      }
    },
    getLayer() {
      if (!this.areaVectorLayer) {
        this.areaVectorLayer = createVectorLayer()
        this.areaVectorLayer.set('_id', this.id)
        this.baseMap.addLayer(this.areaVectorLayer)
      }
    },
    getAreaJson(data) {
      if (!data || !data.features || data.features.length === 0) return
      if (!data.data || data.data.length === 0) {
        let styles = this.data.styles
        styles = mergaAreaCompareStyleFn(styles, this.styles)
        console.log(styles)
        this.drawAera(data.features, styles)
      }
      if (data.data) {
        const dataObj = ArrayToObject(data.data, 'code')
        data.features.forEach(item => {
          const d = dataObj[item.properties.id]
          if (d) {
            item.styles = d.styles
          }
        })
        let styles = data.styles
        styles = mergaAreaCompareStyleFn(styles, this.styles)
        this.drawAera(data.features, styles)
      }
    },
    drawAera(geo, styles) {
      const features = []
      if (styles) {
        const style = createStyleFn(styles)
        this.areaVectorLayer.setStyle(style)
      }
      geo.forEach(item => {
        let feature
        if (item.geometry.type === 'MultiPolygon') {
          feature = new Feature({
            geometry: new MultiPolygon(item.geometry.coordinates).transform('EPSG:4326', 'EPSG:3857')
          })
        } else if (item.geometry.type === 'Polygon') {
          feature = new Feature({
            geometry: new Polygon(item.geometry.coordinates).transform('EPSG:4326', 'EPSG:3857')
          })
        }
        if (feature && item.styles) {
          let styles = item.styles
          styles = mergaAreaCompareStyleFn(styles, this.styles)
          const style = createStyleFn(styles)
          feature.setStyle(style)
        }
        features.push(feature)
      })

      this.areaVectorLayer.getSource().addFeatures(features)
      if (this.extent) {
        this.getExtent()
      }
    },
    clear() {
      this.areaVectorLayer.getSource().clear()
    },
    getExtent() {
      const extent = this.areaVectorLayer.getSource().getExtent()
      this.$emit('getExtent', extent)
    }
  },
  beforeDestroy() {
    if (this.areaVectorLayer) {
      this.baseMap.removeLayer(this.areaVectorLayer)
      this.areaVectorLayer = undefined
    }
  }
}
</script>
