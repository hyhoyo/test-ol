<template>
  <div></div>
</template>
<script>
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { data, geoCoordMap } from './test.js';
import { fromLonLat } from 'ol/proj';
import { Fill, Stroke, Style, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { easeOut } from 'ol/easing';
import { getVectorContext } from 'ol/render';
import { getUuid } from '@/utils/index.js';
import { unByKey } from 'ol/Observable.js';
import { createVectorLayer } from '@/utils/olFn.js';

export default {
  name: 'UcenOlScatter',
  data() {
    return {
      scatterLayer: null,
      uid: getUuid()
    };
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
      return this.map && this.map();
    },
    baseVectorLayer: function () {
      return this.vectorLayer && this.vectorLayer();
    }
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      if (!this.baseMap) {
        throw '未实例化地图';
      }
      this.destroy();
      this.load();
    },
    load() {
      this.scatterLayer = this.baseVectorLayer;
      if (!this.scatterLayer) {
        this.scatterLayer = createVectorLayer();
        this.scatterLayer.set('layerName', `scatterLayer-${this.uid}`);
        this.baseMap.addLayer(this.scatterLayer);
      }
      var poi = [];
      data.forEach((item, index) => {
        item.position = geoCoordMap[item.name];
        poi.push(new Feature(new Point(fromLonLat(item.position))));
        poi[index].set('name', item.name || '');
        poi[index].set('value', item.value || 0);
        var bdStyle = new Style({
          image: new CircleStyle({
            fill: new Fill({
              color: [128, 0, 128]
            }),
            radius: item.value / 20
          })
        });
        poi[index].setStyle(bdStyle);
      });
      this.scatterLayer.getSource().addFeatures(poi);
      this.render(poi, 100);
    },
    render(poi, value) {
      var duration = 2000;
      var n = 3;
      var flashGeom = new Array(5 * n);
      if (!value) return;
      this.eventLayer = this.scatterLayer.on('postrender', evt => {
        var vc = getVectorContext(evt);
        var frameState = evt.frameState;
        const poiLiist = poi.filter(item => item.get('value') >= value);
        for (var i = 0, len = poiLiist.length; i < len; i++) {
          for (var j = 0; j < n; j++) {
            if (flashGeom[j + i * n] == undefined) flashGeom[j + i * n] = poiLiist[i].clone();
            if (flashGeom[j + i * n].get('start') == undefined) flashGeom[j + i * n].set('start', new Date().getTime() + 600 * j);

            var elapsed = frameState.time - flashGeom[j + i * n].get('start');
            if (elapsed >= duration) {
              flashGeom[j + i * n].set('start', flashGeom[j + i * n].get('start') + duration);
              elapsed = 0;
            }

            var elapsedRatio = elapsed / duration;
            elapsedRatio = elapsedRatio > 0 ? elapsedRatio : 0;
            elapsedRatio = elapsedRatio > 1 ? elapsedRatio - 1 : elapsedRatio;

            var radius = (easeOut(elapsedRatio) * flashGeom[j + i * n].get('value')) / 8;
            radius = radius > 0 ? radius : 0;
            var opacity = easeOut(1 - elapsedRatio * 1.3);
            var style = new Style({
              image: new CircleStyle({
                radius: radius,
                stroke: new Stroke({
                  color: 'rgba(128, 0, 128, ' + opacity + ')',
                  width: 0.1 + opacity
                })
              })
            });
            vc.drawFeature(flashGeom[j + i * n], style);
          }
        }
        this.baseMap.render();
      });
    },
    vertifyMap() {
      if (!this.baseMap) {
        throw '未实例化地图';
      }
    },
    destroy() {
      if (this.scatterLayer) {
        this.scatterLayer.getSource().clear();
        this.baseMap.removeLayer(this.scatterLayer);
        this.scatterLayer = undefined;
      }
      if (this.eventLayer) {
        unByKey(this.eventLayer);
        this.eventLayer = undefined;
      }
    }
  },
  beforeDestroy() {
    this.destroy();
  }
};
</script>
