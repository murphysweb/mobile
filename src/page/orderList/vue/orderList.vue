<template>
  <!--<div class="top0">
      <div class="top_container">
          &lt;!&ndash;top_back改为a标签，如果有上一页链接地址改为 javascript:history.back();或者你想执行的语句，否则链接改为真正的链接&ndash;&gt;
          <div class="top_left">
              <a class="top_back" href="javascript:history.back();">
                  <span class="home_arrow"></span>
              </a>
          </div>
          <div class="title_container">
              订单列表
          </div>
          <div class="top_right">
              <a href="/" class="top_home">
                  <span class="home_icon"></span>
              </a>
          </div>
      </div>
  </div>-->
  <com-top-title title="订单列表" home :home-img="'//9i.dvmama.com/free/Pictures/search.png'" home-href="/m/order_search.html"></com-top-title>
  <orderlistswitcher></orderlistswitcher>
</template>

<script>
  var orderlistswitcher = require("./orderlistswitcher.vue");
  import util from "../../../../utils/utils.es6";
  export default{
    data(){
      return {
        isApp: util.utils.isApp()
      }
    },
    components: {
      orderlistswitcher: orderlistswitcher,
      'com-top-title': require('../../../component/com-top-title.vue'),
    },
    ready(){
      if (this.isApp) {
        window.bravetime.setHead({"title": "订单列表", "backBtn": 1});
      }
    }
  }
</script>

<style>
  body{
    padding-top: 0 !important;
  }
  .dvd-service-com-title .left-btn-wrapper .btn.home, .dvd-service-com-title .right-btn-wrapper .btn.home {
    width: 0.18rem;
    height: 0.2rem;
    margin-right: 0.15rem;
  }
</style>
