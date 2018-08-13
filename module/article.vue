<style>
  .article-wapper {
    padding:0 5px;
    font-size: 0;
  }
  .article-list {
    background: #F1F1F1;
    display: inline-block;
    width:50%;
  }
  .list {
    padding:0 5px;
  }
  .list_pic {
    min-height:1.45rem;
    background: #fff;
  }
  .list_pic img {
    width:100%;
  }
  .article-content {
    background: #ffffff;
    padding:0 10px;
  }
  .selling_point {
    height:20px;
    line-height: 20px;
    margin:10px 0 5px;
    font-size: 12px;
    color: #333333;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .content {
    font-size: 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:2;
    overflow: hidden;
    color: #666666;
    height:34px;
    line-height:17px;
    margin-top:6px;
  }
  .type_box {
    position: relative;
    display: inline-table;
    height: 14px;
    line-height:14px;
    width: auto;
    border-radius: 2px;
    box-sizing: border-box;
    overflow: hidden;
    /*vertical-align: middle;*/
    margin-right: 3px;
  }
  .type_box:before {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 200%;
    height:200%;
    border: 1px solid #3E8CE4;
    border-radius: 8px;
    transform: scale(.5, .5);
    -webkit-transform: scale(.5, .5);
    transform-origin: left top;
    -webkit-transform-origin: left top;
    box-sizing: border-box;
    z-index: 1;
  }
  .type_box .type-icon {
    display: inline-block;
    padding: 0 4px;
    color: #3E8CE4;
    font-size: 10px;
    line-height: 10px;
  }
  .no_price {
    padding:10px 0 15px;
    font-size: 0;
  }
  .no_price .nowPrice {
    font-size: 15px;
    color: #FF4a7d;
  }
  .no_price .fz_14 {
    color: #FF4a7d;
    font-size: 12px;
    font-style: normal;
    margin-right:2px;
  }
</style>
<template>
  <!--标题-->
  <div>
    <div class="article-recommend" v-if='dataList && dataList.length !=0'>
      <div class="article-recommend-title">相关商品推荐</div>
    </div>
    <div class="article-wapper">
      <div class="article-list" v-for="(item,index) in dataList" @click="toMessage(item)">
        <div class="list">
          <!--图片-->
          <div class="list_pic">
            <img :src="item.imageUrl" alt="">
          </div>
          <!--内容-->
          <div class="article-content">
            <!--卖点-->
            <!--<p class="selling_point">{{item.sellingPoint}}</p>-->
            <div class="content">
              <span class="type_box" v-if="item.attrs && item.attrs.length !==0"><span class="type-icon">{{item.attrs[0].attrInfo}}</span></span>
              {{item.title}}
            </div>
            <!--非会员-->
            <div class="no_price">
              <em class="fz_14">¥</em>
              <span class="nowPrice">{{item.nowPrice}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import encrypt from '../src/common/js/module/encrypt.js';
  export default {
    data() {
      return {
        dataList:[],
      };
    },
    created() {
      var that = this;
      that.getData();
    },
    methods: {
      //初始化获取数据接口
      getData() {
        let that = this;
        $.ajax({
          cache: false,
          async: true,
          url: '/api/mg/good/page/recommendGoods?_=' + Date.now(),
          type: 'post',
          data: encrypt({
            pageId:window.pageId
          }),
          dataType: 'json',
          success(res) {
            if(res.code === 0) {
              that.dataList = res && res.data && res.data.dataList;
            }else {
              console.error('ajax error:' + error.status + ' ' + error.statusText);
            }
          }
        });
      },
      toMessage(obj) {
        window.location.href = `/${obj.goodsId}.html`;

      }

    }
  }
</script>
