<template>
  <div></div>
</template>
<script>
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
import { Stroke, Style } from 'ol/style'
import { hexToRgba } from '@/utils/color.js'
import CircleStyle from 'ol/style/Circle'
import { linear } from 'ol/easing'
import { getVectorContext } from 'ol/render'
import { getUuid } from '@/utils/index.js'
import { unByKey } from 'ol/Observable.js'
import { createStyleFn, createVectorLayer, mergaScatterStyleFn } from '@/utils/olFn.js'

export default {
  name: 'UcenOlScatter',
  data() {
    return {
      scatterLayer: null,
      uid: getUuid()
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    styles: {
      type: Object,
      default: () => {
        return {}
      }
    },
    range: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.clear()
        if (newVal.length > 0) {
          this.init()
        }
      },
      deep: true
    },
    styles: {
      handler(newVal) {
        this.clear()
        if (Object.keys(newVal).length > 0) {
          this.init()
        }
      },
      deep: true
    }
  },
  inject: {
    map: {
      from: 'map',
      default: undefined
    },
    vectorLayer: {
      from: 'vectorLayer',
      default: undefined
    }
  },
  computed: {
    baseMap: function () {
      return this.map && this.map()
    },
    baseVectorLayer: function () {
      return this.vectorLayer && this.vectorLayer()
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      if (!this.baseMap) {
        throw '未实例化地图'
      }
      this.destroy()
      this.load()
    },
    load() {
      this.scatterLayer = this.baseVectorLayer
      if (!this.scatterLayer) {
        this.scatterLayer = createVectorLayer()
        this.scatterLayer.set('layerName', `scatterLayer-${this.uid}`)
        this.baseMap.addLayer(this.scatterLayer)
      }
      var poi = []

      this.data.forEach((item, index) => {
        // item.position = geoCoordMap[item.name]
        poi.push(new Feature(new Point(fromLonLat(item.position))))
        poi[index].set('name', item.name || '')
        poi[index].set('color', item.color)
        poi[index].set('value', item.value || 0)
        let styles = item.styles || {}
        styles = mergaScatterStyleFn(styles, this.styles)
        const bdStyle = createStyleFn(styles)
        if (bdStyle) {
          poi[index].setStyle(bdStyle)
        }
      })
      this.scatterLayer.getSource().addFeatures(poi)
      let poiLiist = poi.filter(item => item.active)
      if (poiLiist.length === 0) poiLiist = poi
      if (this.eventLayer) {
        unByKey(this.eventLayer)
        this.eventLayer = undefined
      }
      if (poiLiist.length !== 0) {
        this.render(poiLiist)
      }
    },
    render(poiLiist) {
      var duration = 3000
      var n = 1
      var flashGeom = new Array(5 * n)
      if (!this.eventLayer) {
        this.eventLayer = this.scatterLayer.on('postrender', evt => {
          var vc = getVectorContext(evt)
          var frameState = evt.frameState
          for (var i = 0, len = poiLiist.length; i < len; i++) {
            for (var j = 0; j < n; j++) {
              if (flashGeom[j + i * n] == undefined) flashGeom[j + i * n] = poiLiist[i].clone()
              if (flashGeom[j + i * n].get('start') == undefined) flashGeom[j + i * n].set('start', new Date().getTime() + (duration / 3) * j)
              var elapsed = frameState.time - flashGeom[j + i * n].get('start')
              if (elapsed >= duration) {
                flashGeom[j + i * n].set('start', flashGeom[j + i * n].get('start') + duration)
                elapsed = 0
              }
              var elapsedRatio = elapsed / duration
              elapsedRatio = elapsedRatio > 0 ? elapsedRatio : 0
              elapsedRatio = elapsedRatio > 1 ? elapsedRatio - 1 : elapsedRatio
              var radius = linear(elapsedRatio) * (this.styles.circle ? (this.styles.circle.radius || 10) * 2 : 20)
              radius = radius > 0 ? radius : 0
              var opacity = linear(1 - elapsedRatio * 0.8)
              let color = this.styles.circle ? this.styles.circle.fill : '#319FD3'
              let color2 = flashGeom[j + i * n].get('color')
              if (color2) {
                color = color2
              }
              var style = new Style({
                image: new CircleStyle({
                  radius: radius,
                  stroke: new Stroke({
                    color: hexToRgba(color, opacity),
                    width: 1 + opacity
                  })
                })
              })
              vc.drawFeature(flashGeom[j + i * n], style)
            }
          }
          this.baseMap.render()
        })
      }
    },
    vertifyMap() {
      if (!this.baseMap) {
        throw '未实例化地图'
      }
    },
    clear() {
      if (this.scatterLayer) {
        this.scatterLayer.getSource().clear()
      }
    },
    destroy() {
      if (this.scatterLayer) {
        this.scatterLayer.getSource().clear()
        this.baseMap.removeLayer(this.scatterLayer)
        this.scatterLayer = undefined
      }
      if (this.eventLayer) {
        unByKey(this.eventLayer)
        this.eventLayer = undefined
      }
    }
  },
  beforeDestroy() {
    this.destroy()
  }
}
</script>
