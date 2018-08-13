<style>
  .mask {
    display: block;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 999;
    background-color: rgba(255, 255, 255, .97);
    text-align: center;
    padding: 65px 0 20px 0;
    overflow-y: scroll;
  }

  .mask img {
    max-width: 100%;
    box-shadow: 0px 0px 20px rgba(105, 97, 79, 0.5);
  }

  /*.share_text {*/
    /*color: #666;*/
    /*margin-top: 30px;*/
  /*}*/

  .share_top_text {
    color: #666;
    font-size: 14px;
    text-align: center;
  }

  .share_top_text:before {
    content: "";
    display: block;
    clear: both;
  }

  .close {
    width: 14px;
    height: 14px;
    background-size: 15px;
    background-image: url(//9i.dvmama.com/free/2016/12/21/close.png);
    background-repeat: no-repeat;
    background-position: center;
    float: right;
    margin-right: 12px;
    position:absolute;
    top: 15px;
    left: 90%;
    margin-left: 10px;
  }

  .container {
    max-width: 640px;
    margin: 0 auto;
  }

  .img_container {
    padding: 10px;
    box-sizing: content-box;
  }

  .ui-share-card-box {
    width: 2.02rem;
    height: 3.6rem;
    position:relative;
    left: 50%;
    margin-left:-1.01rem;
    margin-top:0.2rem;
    margin-bottom:10px;
    -webkit-transition: 500ms;
    -moz-transition: 500ms;
    -ms-transition: 500ms;
    -o-transition: 500ms;
    transition: 500ms;
  }
  .ui-share-card-box-s {
    width: 1.5rem;
    height: 2.667rem;
    margin-left:-0.75rem;
  }

  .ui-line{
    width:1.08rem;
    border:solid 0.005rem #d0d0d0;
    position:absolute;
    margin-top:0.09rem;
  }
  .ui-line-l{
    margin-left:0.3rem
  }
  .ui-line-r{
    margin-left:2.37rem
  }
  .ui-line-s{
    margin-top: 0.09rem;
  }
  .ui-save-text{
    font-size: 0.12rem;
    margin-top:0.3rem;
  }

  .ui-ticket-box {
    margin-top: 6px;
    text-align: center;
    width: 2.833rem;
    height: 0.59rem;
    margin-left:0.4585rem;
  }
  .ui-share-btn {
    width: 0.7rem;
    height: 0.3rem;
    position:absolute;
    margin-left:2.36rem;
    margin-top:-0.44rem;
  }
  .ui-warning{
    margin-top:10px;
    font-size:12px;
    color:#333;
    text-align: center;
  }
  @media screen and (max-height: 569px) {
    .mask {
      padding-top: 43px;
    }
  }
  .ui-share-ticket-box{
    animation: act 1000ms;
  }
  @keyframes act {
    0% {
      opacity: 0
    }
    to {
      opacity: 1;
    }
  }
  .ui-share-card{
    animation: act 1000ms;
    transition:  1000ms;
    -moz-transition:  1000ms; /* Firefox 4 */
    -webkit-transition:  1000ms; /* Safari 和 Chrome */
    -o-transition:  1000ms; /* Opera */
  }
</style>
<template>
  <div class="inviteCart" v-show="showCard">
    <div class="mask">
      <div class="close" @click="closeCard"></div>
      <div class="container">
        <div v-if="canShare" class="ui-share-ticket-box">
          <div class="share_top_text">
            <p>爱学习的你又发现了一堂好课，送你一张【免费</p>
            <p>听课券】，分享给好友一起学习吧</p>
          </div>
          <div class="ui-ticket-box">
            <img src="//9i.dvmama.com/free/2018/05/16/ticketShare.png" width="100%" height="100%">
          </div>
          <div class="ui-share-btn" @click="toFreeCourseCode()"></div>
          <div class="ui-warning">
            <span>*非会员可使用此券免费报名当前课程，用过即刻失效</span>
          </div>
        </div>
        <div class="ui-share-card">
          <div class="ui-line ui-line-l" :class="{'ui-line-s':!canShare}"></div>
          <div class="ui-line ui-line-r" :class="{'ui-line-s':!canShare}"></div>
          <div class="share_top_text ui-save-text">
            长按保存图片
          </div>
          <!--分享卡图片-->
          <div class="ui-share-card-box" :class="{'ui-share-card-box-s':canShare === true}">
            <img :src="imgUrl" onerror="this.onerror=null; this.src='//9i.dvmama.com/free/2018/05/17/card_err1.png'" width="100%" height="100%">
          </div>
          <div class="share_text" style="margin: 0.2rem 0.4rem 0" v-if='type==2 && visitor==3 && income && income!="0.00"'>
          <!--<div class="share_text" style="margin-top:20px">-->
            当好友通过您的分享报名课程,并
            <span class='share_text_span' style="color: #FF4A7D;">在您的店铺下单</span>
            ,您便可获得
            <span class='share_text_span' style="color: #FF4A7D;">¥{{income}}</span>
            奖金
            <div v-if="canShare" >(通过听课券报名没有奖金哦)</div>
          </div>
          <div class="share_text" style="margin: 0.2rem 0.4rem 0" v-if='type==2 && visitor!=3 && income && income!="0.00"'>
          <!--<div class="share_text" style="margin-top:20px">-->
            成为店主后,当好友在您的店铺报名该课程,您便可获得
            <span class='share_text_span' style="color: #FF4A7D;">¥ {{income}}</span>
              奖金
            <div v-if="canShare" >(通过听课券报名没有奖金哦)</div>
          </div>
          <div class="share_text" v-if='type!=2'>分享直播图片加人气</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import './inviteCard.scss';
  import inviteCard from './inviteCard.es6';

  export default inviteCard;
</script>



