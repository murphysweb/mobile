<template>
  <div>
    <!--<coursetitle v-if="!inApp"></coursetitle>-->

    <!--标题-->
    <com-top-title title="妈妈商学院" search
                   :search-click="function(){window.location.href = '/m/new_course_search.html';}">

    </com-top-title>
    <!-- 扫一扫icon -->

    <div class="ui-sweep" id="sweepIcon"
         @click="location.href = '/class_detail.html?pageId=12480&rp=course_index&rl=block-2883-1-8636-1'">
      <img src="//9i.dvmama.com/free/2018/07/23/scanning.png" width="100%" height="100%">
    </div>

    <index-feed :data="feedList"></index-feed>

    <div class='footerBlock'></div>
    <!--<index-foot :data='footData' v-if='!app'></index-foot>-->
    <index-foot active="school" v-if='!app' class="footer"></index-foot>

    <!-- 新版本引导遮罩层 -->
    <new-version-cover></new-version-cover>
  </div>
</template>


<script>
  import layout from './index/layout.es6';
  import indexFeed from '../module/index/index_feed.vue';
  import coursetitle from '../module/course_title.vue';
  //    import indexFoot from '../module/index/index_footer.vue'
  import indexFoot from '../src/component/com-footer/com-footer.vue';
  import common from './common/common.es6';
  import ua from '../src/common/js/module/ua.js';
  import new_version_cover from '../module/index/newVersionCover';
  import bus from './index/bus.js';
  import encrypt from 'dvd-service-js-encrypt';

  export default {
    data: function() {
      return {
        feedList: [],
        footData: {
          active: 1,
          cart: 0
        },
        app: !!navigator.userAgent.match(/davdian|bravetime|vyohui/),
        inApp: window.Units && Units.isApp(),
        name: 'allSchool',
        data: [],
        showGuide: 0, // 0不展示 1展示
        is_show: true
      };
    },
    created: function() {
      let _this = this;
    },
    mounted: function() {
      this.init();
      if (window.appData) {
        window.appData.isAudioAbsorb = 1;
      } else {
        window.appData = {
          'isAudioAbsorb': 1
        };
      }
      if (window.appData) {
        window.appData.isShowAudio = 1;
      } else {
        window.appData = {
          'isShowAudio': 1
        };
      }
      setTimeout(function() {
        window.bravetime.initHead();
      }, 500);

      // 固定扫码听书
      let sweepIcon = $('#sweepIcon').get(0);
      window.onscroll = function() {
        if (window.scrollY <= 0) {
          sweepIcon.style.position = 'absolute';
        } else {
          sweepIcon.style.position = 'fixed';
        }
      };
      // 点击 bd_course_index_recommend_category 模版的标签切换课程列表方法
      bus.$on('changeSelectedTip', (data) => {
        this.tabCourseTip(data);
      });

    },
    methods: {
      init() {
        var that = this;
        $.ajax({
          type: 'post',
          url: '/api/mg/content/course/index',
          dataType: 'json',
          data: layout.strSign('course'),
          success: function(data) {
            that.showGuide = data.data.show_guide;
            // 埋点 在因版本引导模版内取出进行展示逻辑
            localStorage.setItem('showGuideNewVersionTip', that.showGuide);
            that.feedList = data.data.feedList;
            console.log(that.feedList);
          },
          error: function(e) {
            console.log('e->', e);
          }
        });
        this.cart();
      },
      cart: function() {
        var that = this;
        $.ajax({
          type: 'POST',
          url: layout.config.cart,
          data: layout.strSign('cart'),
          dataType: 'json',
          success: function(data) {
            if (data.code == 0) {
              layout.dataVersion('cart', data);
              if (data.data) {
                localStorage.setItem('cartList', JSON.stringify(data));
                that.footData.cart = data.data.goodsNum;
              } else {
                that.footData.cart = JSON.parse(localStorage.getItem('cartList')).data.goodsNum;
              }
            }
          },
          error: function(e) {
            console.log('Oops, error', e);
          }
        });
      },
      tabCourseTip(id) {
        let _this = this;
        let catId = id;
        // 调接口
        $.ajax({
          type: 'post',
          url: '/api/mg/content/course/recommend_course_list?_=' + Date.now(),
          dataType: 'json',
          data: encrypt.ajax({
            catId: catId
          }),
          success: function(response) {

            // console.log(response);
            if (response.code == 0) {
              let isTagIndex = '';
              let sum = 0;

              for (let i = 0; i < _this.feedList.length; i++) {
                let item = _this.feedList[i];
                if (item.body && item.body.isTag && item.body.isTag == 1) {
                  sum++; // 计算需要删除现有几个模版
                  if (isTagIndex === '') {
                    isTagIndex = i; // 第一个模版的位置
                  }
                }
              }
              let feed1 = [];
              let newFeedList = response.data.feedList;
              let feed2 = [];
              for (let i = 0; i < isTagIndex; i++) {
                feed1.push(_this.feedList[i]);
              }
              let a = feed1.length + sum;
              for (let i = a; i < _this.feedList.length; i++) {
                feed2.push(_this.feedList[i]);
              }
              let arr = feed1.concat(newFeedList, feed2);
              _this.feedList = [];
              for (let i = 0; i < arr.length; i++) {
                _this.feedList.push(arr[i]);
              }
            }
          },
          error: function(e) {
            console.log('e->', e);
          }
        });
      }
    },
    components: {
      indexFeed: indexFeed,
      coursetitle: coursetitle,
      'com-top-title': require('../src/component/com-top-title.vue'),
      indexFoot: indexFoot,
      'new-version-cover': new_version_cover
    }
  };
</script>
<style>
  body {
    padding-top: 0;
  }

  body .dvd-service-com-title {
    z-index: 4;
  }
</style>
<style scoped>
  .footerBlock {
    width: 100%;
    height: 50px;
  }

  .footer {
    z-index: 40;
  }

  .ui-sweep {
    position: fixed;
    width: 0.4rem;
    height: 0.4rem;
    right: 0.32rem;
    top: 0.04rem;
    z-index: 10;
  }
</style>
