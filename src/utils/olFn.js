import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Circle as CircleStyle, Stroke } from 'ol/style';

// 需要创建的参数
const useCreate = ['fill', 'stroke'];

const isString = data => {
  return typeof data === 'string';
};

const createFillFn = color => {
  let rebuildColor = color;
  if (isString(color)) {
    rebuildColor = new Fill({
      color: color
    });
  }
  return rebuildColor;
};

const createStrokeFn = color => {
  let rebuildColor = color;
  if (isString(color)) {
    rebuildColor = new Stroke({
      color: color
    });
  }
  return rebuildColor;
};

const createCircle = style => {
  return {
    image: new CircleStyle({
      fill: createFillFn(style.fill),
      radius: style.radius
    })
  };
};

const createText = style => {
  return new Text({
    ...style
  });
};

const createStyleFn = style => {
  let rebuildStyle = {};
  for (let key in style) {
    const data = style[key];
    switch (key) {
      case 'text':
        rebuildStyle[key] = createText(data);
        break;
      case 'cirecle':
        rebuildStyle[key] = createCircle(data);
        break;
    }
  }
  return rebuildStyle;
};

const createVectorLayer = () => {
  return new VectorLayer({
    source: new VectorSource()
  });
};

export { createStyleFn, createVectorLayer };
