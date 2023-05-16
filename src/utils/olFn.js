import { Style, Fill, Circle as CircleStyle } from 'ol/style';

const setCircleFn = (color, value) => {
  return {
    image: new CircleStyle({
      fill: new Fill({
        color: color
      }),
      radius: value / 20
    })
  };
};

const setStyleFn = colorData => {
  let style = {};
  if (colorData.type === 'circle') {
    const circle = this.setCircleFn();
    style = Object.assign(style, circle);
  }
  return new Style(style);
};

export { setCircleFn, setStyleFn };
