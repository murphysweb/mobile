<template>
  <div class="content2">
    <div class="content_buy">
      <div class="count">
        <span v-text="people_count()"></span><span>人</span><span v-text="status()"></span>
      </div>
      <div class="content_header">
          <div v-for="item in dataList">
            <img :src="doImg(item.imageUrl)" alt="">
          </div>
          <div v-if="purchase > 7 && isFree==1">
            <img src="//9i.dvmama.com/free/2017/08/16/Group4.png" alt="">
          </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:["data"],
    data(){
      return{
          dataList:[],
          isFree:-1,
          number:-1,
          purchase:-1
      }
    },
    mounted:function () {
      this.dataList=this.data.body.dataList;
      this.number = this.data.body.number
      this.purchase = this.data.body.purchase
      this.isFree=this.data.body.isFree;
    },
    methods:{
      head_count(){
          return this.dataList.length;
      },
      doImg(img){
          if(img)return img;
          return "//9i.dvmama.com/free/2017/08/22/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png"
      },
      people_count(){
          if(this.isFree==1){
            return this.data.body.purchase;
          }else if(this.isFree==0){
            return this.data.body.number;
          }
      },
      status(){
        if(this.isFree==1){
          return "订阅";
        }else if(this.isFree==0){
          return "听过";
        }
      }
    }
  }
</script>
<style scoped>
  .content2 {
    padding: 0.12rem 0.1rem 0.12rem 0.1rem;
    background: white;
  }

  .content_buy {
    position: relative;
    height: 0.25rem;
  }

  .content_buy .count {
    color: #666666;
    font-size: 14px;
    margin-top: 0.03rem;
    line-height: 0.2rem;
  }

  .content_buy > div {
    display: inline-block;
    font-size: 0;
    vertical-align: top;
  }

  .content_header {
    max-width: 2.4rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    position: absolute;
    right: 0;
  }

  .content_header > div {
    display: inline-block;
    font-size: 0;
    vertical-align: top;
    margin-left: 0.05rem;
  }

  .content_header img {
    border-radius: 50%;
    height: 0.25rem;
    width: 0.25rem;
  }
</style>
