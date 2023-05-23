import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Circle, Stroke, Icon, Text } from 'ol/style';
import cloneDeep from 'lodash/cloneDeep';

// 需要创建的参数
const useCreate = ['fill', 'stroke', 'backgroundFill'];

const isString = data => {
  return typeof data === 'string';
};

const filterFn = type => {
  switch (type) {
    case 'fill':
    case 'backgroundFill':
      return createFill;
    case 'stroke':
      return createStroke;
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

const createFill = style => {
  if (isString(style)) {
    style = {
      color: style
    };
  }
  style = useFilter(style);
  return {
    fill: new Fill({
      ...style
    })
  };
};

const createStroke = style => {
  if (isString(style)) {
    style = {
      color: style
    };
  }
  style = useFilter(style);
  return {
    stroke: new Stroke({
      ...style
    })
  };
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
      case 'fill':
        var fill = createFill(data);
        Object.assign(rebuildStyle, fill);
        break;
      case 'stroke':
        var stroke = createStroke(data);
        Object.assign(rebuildStyle, stroke);
        break;
    }
  }
  return new Style(rebuildStyle);
};

const createVectorLayer = () => {
  return new VectorLayer({
    source: new VectorSource()
  });
};

export { createStyleFn, createVectorLayer };
