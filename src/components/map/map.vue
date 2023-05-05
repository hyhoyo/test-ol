<template>
  <div class="map-container" :id="id"></div>
</template>
<script>
import { getUuid } from '../../utils/index.js';
import { Map, View } from 'ol';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import { cloneDeep } from 'lodash';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTile from 'ol/source/VectorTile.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { mapDefaultConfig } from './config.js';
export default {
  name: 'UcenOlMap',
  props: {
    id: {
      type: String,
      default: () => getUuid()
    },
    mapConfig: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      map: undefined,
      mapConf: cloneDeep(mapDefaultConfig)
    };
  },
  watch: {
    mapConfig: {
      handler(newVal) {
        if (newVal) {
          this.mapConf = Object.assign(this.mapConfig, this.mapConf);
          if (document.getElementById(this.id)) {
            this.initMap();
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const layers = this.getLayers();
      this.map = new Map({
        target: this.id,
        layers: layers,
        view: new View({
          center: fromLonLat(this.mapConf.center),
          zoom: this.mapConf.zoom,
          maxZoom: this.mapConf.maxZoom,
          minZoom: this.mapConf.minZoom
        })
      });
      this.setGeojsonLayers();
      this.setVectorLayers();
      this.$emit('ready', this.map);
    },
    getLayers() {
      const baseMapConf = this.mapConf.basemap;
      const layers = baseMapConf.map(item => {
        let layer;
        if (item.name === 'xyz') {
          layer = new TileLayer({
            source: new XYZ({
              ...item
            }),
            visible: item.visible
          });
        }
        return layer;
      });
      return layers.filter(item => item);
    },
    setVectorLayers() {
      const vectorMapConf = this.mapConf.vectormap;
      if (vectorMapConf && this.map) {
        for (let item of vectorMapConf) {
          if (!item.source) {
            continue;
          }
          const source = cloneDeep(item.source);
          delete item.source;
          const layer = new VectorTileLayer({
            ...item,
            source: new VectorTile({
              ...source
            })
          });
          this.map.addLayer(layer);
        }
      }
    },
    setGeojsonLayers() {
      const geoMapConf = this.mapConf.geojson;
      if (geoMapConf && this.map) {
        for (let item of geoMapConf) {
          if (!item.source) {
            continue;
          }
          const source = cloneDeep(item.source);
          console.log(source);
          delete item.source;
          if (source.url) {
            source.format = new GeoJSON();
          }
          const layer = new VectorLayer({
            ...item,
            source: new VectorSource({
              ...source
            })
          });
          this.map.addLayer(layer);
        }
      }
    },
    setCenter(center) {
      if (this.map) {
        this.map.setCenter(center);
      } else {
        new Error('未找到实例化地图');
      }
    }
  }
};
</script>
<style scoped></style>
