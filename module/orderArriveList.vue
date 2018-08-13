<template>
  <div class="delivered-confirmed-success">
    <!--<div class="top0">
        <div class="top_container">
            &lt;!&ndash;top_back改为a标签，如果有上一页链接地址改为 javascript:history.back();或者你想执行的语句，否则链接改为真正的链接&ndash;&gt;
            <div class="top_left">
                <a class="top_back" href="javascript:history.back();">
                    <span class="home_arrow"></span>
                </a>
            </div>
            <div class="title_container">
                确认收货成功
            </div>
        </div>
    </div>-->
    <com-top-title title="确认收货成功"></com-top-title>
    <div class="orderArriveSuccess">
      <div class="success_con">
        <span class="title">确认收货成功</span>
      </div>
    </div>
    <comment-common-list></comment-common-list>
  </div>
</template>
<style scoped>
  body {
    padding-top: 0 !important;
  }
</style>
<script>
  import commentList from './comment_common_list.vue'
  export default{
    data() {
      return {}
    },
    components: {
      commentCommonList: commentList,
      'com-top-title': require('../src/component/com-top-title.vue'),
    },
  }
</script>
