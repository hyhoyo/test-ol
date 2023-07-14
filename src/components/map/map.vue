<template>
  <div class="map-container" :id="id">
    <!-- 地图元素插槽 -->
    <slot v-if="map">
      <!-- `<ucen-ol-points></ucen-ol-points>` -->
    </slot>
  </div>
</template>
<script>
import { getUuid } from '../../utils/index.js'
import { Map, View } from 'ol'
import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'
import cloneDeep from 'lodash/cloneDeep'
import { fromLonLat } from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON.js'
import VectorTileLayer from 'ol/layer/VectorTile.js'
import VectorTile from 'ol/source/VectorTile.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import { mapDefaultConfig } from '../../assets/config/mapConfig.js'
import { createStyleFn } from '@/utils/olFn.js'
import Select from 'ol/interaction/Select.js'
// 基础地图元素组件
// @group 基础地图组件
export default {
  name: 'UcenOlMap',
  props: {
    //唯一标识
    id: {
      type: String,
      //UUID
      default: () => getUuid()
    },
    /**
     * 地图配置对象
     */
    mapConfig: {
      // `{"baseMap":{}}`
      type: Object,
      //{}
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      /**
       * @vuese
       * 地图对象
       * @Type object
       * @Default aadsfadsf
       */
      map: undefined,
      mapConf: cloneDeep(mapDefaultConfig),
      selectClick: undefined,
      selectFn: undefined
    }
  },
  provide: function () {
    return {
      map: () => this.map
    }
  },
  watch: {
    /**
     * @vuese
     * 地图配置对象监听
     * @arg newVal - 新地图配置
     */
    mapConfig: {
      handler(newVal) {
        if (newVal) {
          this.mapConf = Object.assign(this.mapConf, this.mapConfig)
          if (document.getElementById(this.id)) {
            this.initMap()
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.mapConf = Object.assign(this.mapConf, this.mapConfig)
    this.initMap()
  },
  methods: {
    onSelectClick() {
      if (!this.selectClick) {
        this.selectClick = new Select()
        this.map.addInteraction(this.selectClick)
        this.selectFn = e => {
          let features = e.target.getFeatures().getArray()
          if (features.length === 1 || features.length === 0) {
            features = features[0]
          }
          // 地图元素选择事件
          this.$emit('select', features)
        }
        this.selectClick.on('select', this.selectFn)
      }
    },
    /**
     *  @vuese
     * 初始化地图
     */
    initMap() {
      if (!this.map) {
        const layers = this.getLayers()
        this.map = new Map({
          target: this.id,
          layers: layers,
          view: new View({
            center: fromLonLat(this.mapConf.center),
            zoom: this.mapConf.zoom,
            maxZoom: this.mapConf.maxZoom,
            minZoom: this.mapConf.minZoom
          })
        })
        this.setGeojsonLayers()
        this.setVectorLayers()
        /**
         * 地图加载完成
         * @arg {map} 地图对象
         */
        this.$emit('ready', this.map)
        // this.onSelectClick()
      } else {
        const obj = {}
        this.mapConf.basemap.forEach(item => {
          obj[item.id] = item.visible || false
        })
        this.mapConf.vectormap.forEach(item => {
          obj[item.id] = item.visible || false
        })
        this.mapConf.vectormap.forEach(item => {
          obj[item.id] = item.visible || false
        })
        this.map.getLayers().forEach(item => {
          const id = item.get('id')
          const visible = obj[id] === false ? false : true
          item.setVisible(visible)
        })
      }
    },
    /**
     * @vuese
     * 获取地图图层列表
     * @returns {TileLayer<import("../source/Tile.js").default>[]}
     */
    getLayers() {
      const baseMapConf = this.mapConf.basemap
      let layers = baseMapConf.map(item => {
        let layer
        if (item.name === 'xyz') {
          layer = new TileLayer({
            source: new XYZ({
              ...item
            }),
            visible: item.visible || false
          })
        }
        layer.set('id', item.id)
        return layer
      })
      return layers.filter(item => item)
    },
    setVectorLayers() {
      const vectorMapConf = this.mapConf.vectormap
      if (vectorMapConf && this.map) {
        for (let item of vectorMapConf) {
          if (!item.source) {
            continue
          }
          const source = cloneDeep(item.source)
          delete item.source
          const layer = new VectorTileLayer({
            ...item,
            source: new VectorTile({
              ...source
            })
          })
          layer.set('_id', item.id)
          if (item.styles) {
            const style = createStyleFn(item.styles)
            layer.setStyle(style)
          }
          this.map.addLayer(layer)
        }
      }
    },
    setGeojsonLayers() {
      const geoMapConf = this.mapConf.geojson
      if (geoMapConf && this.map) {
        for (let item of geoMapConf) {
          if (!item.source || !item.visible) {
            continue
          }
          const source = cloneDeep(item.source)
          delete item.source
          if (source.url) {
            source.format = new GeoJSON()
          }
          const layer = new VectorLayer({
            ...item,
            source: new VectorSource({
              ...source
            })
          })
          layer.set('_id', item.id)
          if (item.styles) {
            const style = createStyleFn(item.styles)
            layer.setStyle(style)
          }
          this.map.addLayer(layer)
        }
      }
    },
    /**
     * @vuese
     * 设置地图中心点
     * @arg { center } 中心点坐标
     */
    setCenter(center) {
      if (this.map) {
        this.map.setCenter(center)
      } else {
        new Error('未找到实例化地图')
      }
    }
  },
  beforeDestroy() {
    if (this.selectClick) {
      this.selectClick.un('select', this.selectFn)
    }
  }
}
</script>
<style>
@import url('../../styles/olStyle.css');
</style>
