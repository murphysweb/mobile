import Vue from 'Vue';
import VueLazyload from 'VueLazyload';

export default {
  init(isLoading) {
    // 懒加载全局设置
    document.body.style.display = 'none';
    if (isLoading) {
      Vue.use(VueLazyload, {
        // loading: '[[static]]/common/img/img-lazy-loading.png',
        loading: '//5e.dvmama.com/wap/static/dist/static/common/img/img-lazy-loading.png',
        error: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
        try: 2,
        preLoad: 1.5
      });
    } else {
      Vue.use(VueLazyload, {
        // loading: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
        // error: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
        try: 2,
        preLoad: 1.5
      });
    }
    document.body.style.display = null;
  },
}
