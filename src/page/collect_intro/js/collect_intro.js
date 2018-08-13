// 基础模块
require('../../../common/js/common.js');

// 第三方模块
import Vue from 'Vue';
import $ from '$';
import Cookies from 'js-cookie';

// 业务模块
import tj from '../../../common/js/module/tj.js';
import util from '../../../common/js/module/util.js';
import date from '../../../common/js/module/date.js';
import param from '../../../common/js/module/param.js';
import popup from '../../../common/js/module/popup.js';
import login from '../../../common/js/module/login.js';
import share from '../../../common/js/module/share.js';
import native from '../../../common/js/module/native.js';
import encrypt from '../../../common/js/module/encrypt.js';
import localCache from '../../../common/js/module/localCache.js';
import vueLazyload from '../../../common/js/module/vueLazyload.js';

// 懒加载初始化
vueLazyload.init();

// 渲染页面
new Vue({
  el: '.app',
  components: {
    'com-top-title': require('../../../component/com-top-title.vue'),
    'com-to-top-icon': require('../../../component/com-to-top-icon.vue'),
    'index': require('../vue/collect_intro.vue'),
  },
  data() {
    return {
      response: null,
    };
  },
  computed: {},
  watch: {
    // 监听response变化
    response(){
      // response变化后并渲染完dom,设置其他事项
      this.$nextTick(function () {
        let ts = this;

        // 设置分享信息
        try {
          if (!ts.response || !ts.response.data) return;
          share.setShareInfo({
            title: ts.response.data.shareTitle,
            desc: ts.response.data.shareDesc,
            link: location.href,
            imgUrl: ts.response.data.shareImg,
          }, ts.response);
        } catch (err) {
          console.error(err);
        }
      });
    },
  },
  beforeCreate() {
  },
  created() {

  },
  mounted() {
  },
  filters: {},
  methods: {
    /**
     * 接口名称:
     * 接口文档:
     */
    getData(){
      let ts = this;
      $.ajax({
        cache: false,
        async: true,
        url: '?_=' + Date.now(),
        type: 'post',
        dataType: 'json',
        data: encrypt({
          js_wx_info: 1,
        }),
        success(response) {
          try {
            ts.response = response;
          } catch (err) {
            // 这个try-catch不要去掉，因为有异常时会阻止强制跳转
          }
        },
        error(error) {
          console.error(`ajax已执行error回调方法: url=${this.url}, reason=${error.status} ${error.statusText} `);
          this.success(require('../json/collect_intro.json'));
          console.warn(`ajax已使用mock数据: url=${this.url}, mock=collect_intro.json`);
        }
      });
    },
  },
});
