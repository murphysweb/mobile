<!--模板-->
<template>
  <div class="conteianer4">
        <div class="tt_com_1_wrap">
          <div class="tt_com_1" style="z-index: 2;">
            <div>
              <span>为你推荐</span>
            </div>
          </div>
        </div>
        <category :list="list"></category>
        <div class="no_more" v-if="list.length">
          没有更多商品了
        </div>
      </div>
</template>

<!--组件定义-->
<script>
  import layout from "../../../../module/index/layout.es6";
  import $ from '$';

  import tongji from '../../../common/js/module/tjAncestor.js';
  import popup from '../../../common/js/module/popup.js';
  import VueLazyLoad from 'vue-lazyload';

  Vue.use(VueLazyLoad
    )

  let axios = require("axios");
  require('es6-promise').polyfill();
  import { strSign } from "../../../../utils/utils.es6";

  export default {
    components: {

      'category': require('../../../component/com-maybeyoulike.vue'),
    },
    props: {},
    data: function () {
      return {
        successData:{},
        state:null,
        list:[],
        isapp:!!navigator.userAgent.match(/davdian|bravetime|vyohui/)
      }
    },
    computed: {},
    created: function () {

    },
    mounted: function () {
      // this.successPage();
      this.getYouLike();
    },
    methods: {
      getYouLike(){
        let that = this;
        $.ajax({
          cache: false,
          async: false,
          url: '/api/mg/sale/index/getRecommend?_='+Date.now(),
          type: 'post',
          dataType: 'json',
          data: layout.strSign('youLike', {
            for:"order",
            orderId:window.location.pathname.split('.')[0].split('-')[2]
          }),
          success: function (response) {
            console.log("like",response);
            that.list = response.data.dataList;
          }
        });
      },

      goLink(href){
        window.location.href = href
      }
    },
  }
</script>
<style>
  body{
    /*background: #fff;*/
  }
</style>
<style lang='sass' scoped>

  .tt_com_1_wrap{
    background-color: rgb(255, 255, 255);
    margin-top: 10px;
    height: 40px;
    width: 100%;
  }
  .tt_com_1{
        height: 0.4rem;
    font-size: 0.16rem;
    color: #FF4A7D;
    text-align: center;
    line-height: 0.4rem;
    background: #FFF;
    z-index: 5;
    width: 100%;
    max-width: 640px;
    position: relative;
  }
  .tt_com_1 div span {
    display: inline-block;
    /* background-image: url(//9i.dvmama.com/free/2017/06/10/tt_com_1.png); */
    background-image: url(//9i.dvmama.com/free/2017/07/25/heart.png);
    padding-right: 0.21rem;
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: .16rem;
}

.good_list_con{
  margin-top: .1rem;
}
.no_more{
      text-align: center;
    margin: 10px;
      margin-bottom: 20px;
}
</style>
