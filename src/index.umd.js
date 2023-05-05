import * as UcenOl from './index';

export default {
  ...UcenOl
};

if (typeof window.Vue !== 'undefined') {
  window.Vue.use(UcenOl);
}
