<template>
  <div></div>
</template>
<script>
import { ArrayToObject, getUuid } from '@/utils'
import { createStyleFn, createVectorLayer, mergaAreaCompareStyleFn } from '@/utils/olFn'
import { Feature } from 'ol'
import { MultiPolygon, Polygon } from 'ol/geom'
import { defaultStyleConfig } from '@/assets/config/mapConfig'
// 区域对比图组件
// @group 地图展示组件
export default {
  name: 'UcenOlArea',
  props: {
    data: {
      type: Object,
      // {
      //   label: '00全国',
      //   id: '00',
      //   name: '全国',
      //   features: [
      //     {
      //       type: 'Feature',
      //       properties: {
      //         id: '65'
      //       },
      //       geometry: {
      //         type: 'Polygon',
      //         coordinates: [区域数据]
      //       }
      //     }
      //   ]
      // }
      default: () => undefined
    },
    /**
     * @vuese
     *
     * @type Object
     */
    styles: {
      type: Object,
      // {
      //   text: {
      //     font: '12px PingFang SC',
      //     justify: 'center',
      //     textAlign: 'center',
      //     fill: '#000',
      //     stroke: '#fff'
      //   },
      //   fill: '#000',
      //   stroke: '#fff'
      // }
      default: () => defaultStyleConfig
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
      itemVectorLayer: undefined,
      features: []
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
        this.baseMap.addLayer(this.areaVectorLayer)
      }
    },
    getAreaJson(data) {
      if (!data || !data.features || data.features.length === 0) return
      if (!data.data || data.data.length === 0) {
        let styles = this.data.styles
        styles = mergaAreaCompareStyleFn(styles, this.styles)
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
      this.features = []
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
        this.features.push(feature)
      })

      this.areaVectorLayer.getSource().addFeatures(this.features)
      this.getExtent()
    },
    clear() {
      if (this.areaVectorLayer) {
        ;(this.features || []).forEach(item => {
          this.areaVectorLayer.getSource().removeFeature(item)
        })
      }
    },
    /**
     * @vuese
     * 获取图层范围
     * @returns [xmin, ymin, xmax, ymax]
     */
    // 获取图层范围
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
