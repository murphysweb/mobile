<template>
  <div class="box">
    <div @click="go_collect(item.command.content)" v-for="item in length()">
      <div class="circle" :style="{'background-image':styleObject(item.imageUrl)}"></div>
    </div>
  </div>
</template>
<script>
  import util from "../../../utils/utils.es6";
  import native from "../../../src/common/js/module/native";
  export default {
      props:["data"],
      mounted:function () {
        this.dataList=this.data.body.dataList;
      },
      data(){
          return {
              dataList:[],
              isApp:util.utils.isApp()
          }
      },
      methods:{
        length(){
          if(this.dataList.length>=4 && this.dataList.length<8){
              return this.dataList.slice(0,4);
          }else if(this.dataList.length<4){
              return [];
          }else if(this.dataList.length==8){
              return this.dataList;
          }else if(this.dataList.length>8){
             return this.dataList.slice(0,8);
          }
        },
        styleObject(item){
            return "url("+ item +")";
        },
        go_collect(url){
          if(this.isApp){
            native.Browser.open({
              "url":url
            });
          }else{
            window.location.href=url;
          }
        }
      }
  }
</script>
<style scoped lang="sass">
  .box{
    width: 100%;
    font-size: 0;
    background: #fff;
    margin-bottom: 0.1rem;
  }
  .box>div{
    display: inline-block;
    width: 25%;
    height: 0.93rem;
    vertical-align: top;
    text-align: center;
  }
  .circle{
    display: inline-block;
    width: 100%;
    height: 0.93rem;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
</style>
