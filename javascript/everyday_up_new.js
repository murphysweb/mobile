/**
 * Created by luming on 2017/1/9.
 */
var everyday_up_new = require("../module/everyday_up_new.vue");
var VueLazyload = require('vue-lazyload/vue-lazyload');

Vue.use(VueLazyload, {
  // error: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
  // loading: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
  try: 3, // default 1
  preload: 2,
});


new Vue({
  el: "#everyday_up_new",
  data: function () {
    return {
      msg: 'hello vue'
    }
  },
  components: {
    everyday_up_new: everyday_up_new,
  }
});


// 标题栏
// var top_home = document.querySelector('.top0 .top_home');
// top_home.style.background = 'url(//9i.dvmama.com/free/mobile/src/common/img/title-btn-home.png) no-repeat';
// top_home.style.backgroundSize = '100% 100%';
// top_home.style.height = '44px';
// document.querySelector('.top0 .top_home .home_icon').style.display = 'none';
// var title_container = document.querySelector('.top0 .title_container');
// title_container.style.height = '44px';
// title_container.style.lineHeight = '44px';
// var top_left = document.querySelector('.top0 .top_left');
// top_left.style.marginTop = '3px';
// var top_right = document.querySelector('.top0 .top_right');
// top_right.style.marginTop = '2px';
// document.querySelector('body.in_app .top0').style.display = 'block';


// 头部标题栏
(function () {
  // base_webpack.js
  var version = null;
  var scripts = document.body.querySelectorAll('script');
  for (var i in scripts) {
    if (scripts[i].src && scripts[i].src.indexOf('everyday_up_new.js') !== -1) {
      var result = /\/(\d+)\//.exec(scripts[i].src);
      version = result && result[1];
    }
  }
  if (version) {
    var script = document.createElement('script');
    script.src = '//5e.dvmama.com/wap/' + version + '/dist/base_webpack.js';
    document.body.append(script);
  }
  document.body.paddingTop = '44px';
})();
