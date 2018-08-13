<template>
    <div>
        <!--<div class="top0">-->
            <!--<div class="top_container">-->
                <!--&lt;!&ndash;top_back改为a标签，如果有上一页链接地址改为 javascript:history.back();或者你想执行的语句，否则链接改为真正的链接&ndash;&gt;-->
                <!--<div class="top_left">-->
                    <!--<a class="top_back" href="javascript:history.back();">-->
                        <!--<span class="home_arrow"></span>-->
                    <!--</a>-->
                <!--</div>-->
                <!--<div class="title_container">-->
                    <!--评价详情-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
        <com-top-title title="评价详情"></com-top-title>
        <comment-detail-data></comment-detail-data>
    </div>
</template>
<style scoped>

</style>
<script>
    import commentDetailData from './orderList_comment_list.vue';
    import ua from '../src/common/js/module/ua.js';
    export default{
        data(){
            return{
            }
        },
        components:{
            commentDetailData:commentDetailData,
            'com-top-title': require('../src/component/com-top-title.vue'),
        },
      mounted: function(){
        if(ua.isDvdApp() && ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') >= 0){
            document.body.style.paddingTop = '44px';
        }
      }
    }
</script>
