import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Circle, Stroke, Icon, Text } from 'ol/style';
import { cloneDeep } from 'lodash';

// 需要创建的参数
const useCreate = ['fill', 'stroke', 'backgroundFill'];

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

const filterFn = type => {
  switch (type) {
    case 'fill':
    case 'backgroundFill':
      return createFillFn;
    case 'stroke':
      return createStrokeFn;
  }
};

const useFilter = style => {
  for (let key in style) {
    if (useCreate.includes(key)) {
      const fn = filterFn(key);
      if (typeof fn === 'function') {
        style[key] = filterFn(key)(style[key]);
      }
    }
  }
  return style;
};

const createCircle = style => {
  style = useFilter(style);
  return {
    image: new Circle({
      ...style
    })
  };
};

const createText = style => {
  style = useFilter(style);
  console.log(style);
  return {
    text: new Text({
      ...style
    })
  };
};

const createImage = style => {
  style = useFilter(style);
  return {
    image: new Icon({
      ...style
    })
  };
};

const createStyleFn = style => {
  const _style = cloneDeep(style);
  let rebuildStyle = {};
  for (let key in _style) {
    const data = _style[key];
    switch (key) {
      case 'text':
        var text = createText(data);
        Object.assign(rebuildStyle, text);
        break;
      case 'cirecle':
        var cirecle = createCircle(data);
        Object.assign(rebuildStyle, cirecle);
        break;
      case 'icon':
        var icon = createImage(data);
        Object.assign(rebuildStyle, icon);
        break;
    }
  }
  console.log('==============>>>Result', rebuildStyle);
  return new Style(rebuildStyle);
};

const createVectorLayer = () => {
  return new VectorLayer({
    source: new VectorSource()
  });
};

export { createStyleFn, createVectorLayer };
