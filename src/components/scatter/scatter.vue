<template>
  <div></div>
</template>
<script>
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { setStyleFn } from '../../utils/olFn.js';
import { data, geoCoordMap } from './test.js';
import { fromLonLat } from 'ol/proj';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { easeOut } from 'ol/easing';
import { getVectorContext } from 'ol/render';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export default {
  name: 'UcenOlScatter',
  data() {
    return {
      tileLayer: null
    };
  },
  inject: ['map'],
  computed: {
    map: function () {
      return this.map();
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.load();
  },
  methods: {
    init() {
      this.vertifyMap();
    },
    load() {
      if (!this.tileLayer) {
        this.tileLayer = new VectorLayer({
          source: new VectorSource()
        });
      }
      var poi = [];
      data.forEach((item, index) => {
        item.coord = geoCoordMap[item.name];
        poi.push(new Feature(new Point(fromLonLat(item.coord))));
        poi[index].set('name', item.name);
        poi[index].set('value', item.value);
        var bdStyle = new Style({
          image: new CircleStyle({
            fill: new Fill({
              color: [128, 0, 128]
            }),
            radius: item.value / 20
          })
        });
        poi[index].setStyle(bdStyle);
        var duration = 2000;
        var n = 3;
        var flashGeom = new Array(5 * n);

        this.tileLayer.on('postrender', evt => {
          var vc = getVectorContext(evt);
          var frameState = evt.frameState;
          poi.forEach((item, index) => {
            vc.drawFeature(item, item.getStyle());
          });
          for (var i = 0; i < 5; i++) {
            for (var j = 0; j < n; j++) {
              if (flashGeom[j + i * n] == undefined) flashGeom[j + i * n] = poi[i].clone();
              if (flashGeom[j + i * n].get('start') == undefined) flashGeom[j + i * n].set('start', new Date().getTime() + 600 * j);

              var elapsed = frameState.time - flashGeom[j + i * n].get('start');
              if (elapsed >= duration) {
                flashGeom[j + i * n].set('start', flashGeom[j + i * n].get('start') + duration);
                elapsed = 0;
              }

              var elapsedRatio = elapsed / duration;
              elapsedRatio = elapsedRatio > 0 ? elapsedRatio : 0;
              elapsedRatio = elapsedRatio > 1 ? elapsedRatio - 1 : elapsedRatio;

              var radius = (easeOut(elapsedRatio) * flashGeom[j + i * n].get('value')) / 7;
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
          this.map.render();
        });
      });
    },
    vertifyMap() {
      if (!this.map) {
        throw new Error('未实例化地图');
      }
    },
    setFeatures(data) {
      let features = [];
      data.forEach((item, index) => {
        features.push(new Feature(new Point(item.coord)));
        features[index].set('name', item.name);
        features[index].set('value', item.value);
        const featureStyle = setStyleFn(item.style);
        console.log('=========>>>fff', featureStyle);
      });
    }
  }
};
</script>
