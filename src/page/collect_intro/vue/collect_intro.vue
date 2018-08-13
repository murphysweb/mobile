<template>
  <div id="introduction" v-html="introduce"></div>
</template>
<script>
  import api from "../../../../utils/api.es6"
  import {getQuery} from "../../../../utils/utils.es6"
  import native_box from "../../../../src/common/js/module/native_box.js"
  import popup from "../../../../src/common/js/module/popup.js"
  export default {
    mounted(){
      this.init();
    },
    data(){
      return {
        albumId:getQuery("albumId"),
        imgIndex:0,
        introduce:""
      }
    },
    methods:{
      webHeight(){
        var _this=this;
        _this.$nextTick(function () {

          //图片的渲染时间
          setTimeout(function(){
            console.log("$('#introduction').height()",$('#introduction').height());
          },200);

          var length=$("#introduction img").length;
          if(length==0){
            setTimeout(function(){
              native_box.Browser.showWebHeight({
                "webHeight": $('#introduction').height().toString()
              })
            },200)
          }else{
            var imgs=$("#introduction img");
            for(var i=0;i<imgs.length;i++){
              $(imgs[i]).css("max-width","100%");
              imgs[i].onload=function () {
                _this.imgIndex++;
                if(_this.imgIndex==imgs.length){
                  setTimeout(function(){
                    native_box.Browser.showWebHeight({
                      "webHeight": $('#introduction').height().toString()
                    })
                  },200)
                }
              }
            }
          }
        });
      },
      init(){
        var _this=this;
        var obj={
          "albumId":_this.albumId,
          "pageIndex":1
        };
        api("https://box.api.davdian.com/content/album/getAlbumData",obj)
          .then(function (res) {
            if(!res.code){
              if(res.data.attr.contentH5){
                _this.introduce=res.data.attr.contentH5;
                _this.webHeight();
              }else{
                popup.toast("小编加班加点补充中.....");
              }
            }else{

            }
        }).catch(function (e) {

        })
      },
      test(){
        var data =require("../json/collect_intro.json");
        this.introduce=data.data.attr.contentH5;
        this.webHeight();
      }
    }
  }
</script>
<style scoped>
  #introduction img{
    max-width: 100%;
  }
</style>
