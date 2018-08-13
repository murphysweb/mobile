<template>
    <a class="popularity_0" :style="styleObject" :href="growthBox?'#':data.body.command.content">
        <div class="date">
            <span>{{data.body.startTime}}</span>
        </div>
        <div class="hot">
            <i class="heart">
                <img src="//9i.dvmama.com/free/2016/12/22/30_28_d3f6958c35fed5bc31b976f8cddb8244.png" alt="">
            </i>
            <span class="pv">{{data.body.pv}}人气</span>
            <div class="headpic">
                <div class="img" v-for="item in data.body.dataList">
                    <img :src="item.avatar" alt="">
                </div>
            </div>
        </div>
        <div class="getmore" v-if="!growthBox">
            <i class="icon"></i>
        </div>
    </a>
</template>
<script>
//import "./popularity_0.scss";
export default {
    data(){
        return {
            msg: 'hello vue',
            growthBox:window.location.href.indexOf('growthBox=1') != -1
        }
    },
    props: ['data'],
    created:function(){
    },
    computed: {
        styleObject: function () {
            let scope = this;
            return {
                marginTop: scope.data.marginTop + 'px'
            }
        }
    }
}
</script>

<style lang="sass" lang="scss" rel="stylesheet/scss">
  @import "./popularity_0.scss";
</style>
