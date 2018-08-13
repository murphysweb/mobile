<template>
  <div class="supervision">
    <com-top-title style="z-index: 3" title='督导课详情' home share :share-click="share"></com-top-title>
    <div class="bigImg" @click="share">
      <img :src="seriesCover" alt="">
    </div>
    <div class="info" v-if="isAuditVersion == 0">
      <div><span class="sale">¥{{price}}</span><span class="delete">¥{{marketPrice}}</span></div>
      <div class="info-desc">{{priceDesc}}</div>
      <div>报名截止日期:<span class="date">{{joinDeadline}}</span></div>
      <div><span>已售：{{sales}}份</span><span class="have"></span><span>剩余：{{store}}份</span></div>
    </div>

    <div class="catalog">
      <div class="cata-title"><img src="//9i.dvmama.com/free/2018/07/13/icon.png" alt=""><span style="margin-left:0.05rem;">课程目录</span></div>
      <div class="invite" @click="wechatInvite" v-if="supervisorPaySuccUrl">添加督导师微信进群</div>
      <div class="cata-border" @click="showCatalog(0)" :class="{'show_all':showFlag[0],'over':!showFlag[0]}">
        <div class="list" :style="{'zIndex':showFlag[0]?'1':'0'}" v-for="(item,index) in dataList" @click.stop="goDetail(item.command.content,0)">
          <div class="cata-left">
            <div class="cata-text"><img v-if="item.formType == 1" src="//9i.dvmama.com/free/2018/07/13/vedio.png" alt=""><span>{{item.title}}</span></div>
            <div class="cata-time">{{item.startTime}} <span class="cata-right">听课 <img src="//9i.dvmama.com/free/2018/07/13/Fill%201.png" alt=""></span></div>
          </div>
          <!--<div class="cata-right" v-if="userTicket == 1">听课 <img src="//9i.dvmama.com/free/2018/07/13/Fill%201.png" alt=""></div>-->
        </div>
      </div>
      <div class="cata-bottom" @click="showCatalog(0)" v-if="!showFlag[0]">展开全部课程目录</div>
      <div class="cata-bottom" @click="showCatalog(0)" v-if="showFlag[0]">收起全部课程目录</div>
    </div>
    <div class="plan">
      <div class="cata-title"><img src="//9i.dvmama.com/free/2018/07/13/icon.png" alt=""><span style="margin-left:0.05rem;">督导计划</span></div>
      <div class="plan-text" :class="{'show_all afterNone':showFlag[1],'over':!showFlag[1]}" v-html="assistingPlan" :style="{'zIndex':showFlag[1]?'1':'0'}"></div>
      <div class="cata-bottom" @click="showCatalog(1)" v-if="!showFlag[1]">展开全部督导流程</div>
      <div class="cata-bottom" @click="showCatalog(1)" v-if="showFlag[1]">收起全部督导流程</div>
    </div>
    <div class="introduce">
      <div class="cata-title"><img src="//9i.dvmama.com/free/2018/07/13/icon.png" alt=""><span style="margin-left:0.05rem;">课程介绍</span></div>
      <div class="intro-text" :class="{'show_all afterNone':showFlag[2],'over':!showFlag[2]}" v-html="seriesDesc" :style="{'zIndex':showFlag[2]?'1':'0'}"></div>
      <div class="cata-bottom" @click="showCatalog(2)" v-if="!showFlag[2]">展开全部课程介绍</div>
      <div class="cata-bottom" @click="showCatalog(2)" v-if="showFlag[2]">收起全部课程介绍</div>
    </div>
    <div class="bottom-btn">
      <div class="btn-area3" v-if="userTicket == 1" @click="submitWork">作业打卡</div>
      <div class="btn-area2" v-if="userTicket == 0 && !isOnSale()">报名已结束</div>
      <div class="btn-area3" v-if="userTicket == 0 && isOnSale() && goodsIsOnSale == 0" @click="rePay">立即预约</div>
      <div class="btn-area2" v-if="userTicket == 0 && isOnSale() && goodsIsOnSale == 1 && store == 0">已售罄</div>
      <div class="btn-area" v-if="userTicket == 0 && isOnSale() && goodsIsOnSale == 1 && store != 0">
        <div class="btn-left" @click="share">邀请好友<img style="margin-left: 0.05rem;" src="//9i.dvmama.com/free/2018/07/13/centerShare.png" alt=""></div>
        <div class="btn-right" @click="goCheckout">马上报名</div>
      </div>
      <!--<div v-if="1 != 1">1</div>-->
      <!--<div v-else-if="2 == 2">2</div>-->
      <!--<div v-else-if="3 == 3">3</div>-->
    </div>
    <invite-card :show="inviteShow" :id="seriesId" statistics="3" @close="share" kind="1"></invite-card>
    <div class="alert">

    </div>
  </div>
</template>
<script>
  import popup from "dvd-service-js-popup";
  import ua from "dvd-base-js-ua"
  import native from "../src/common/js/module/native.js";
  import share from "dvd-service-js-share";
  import inviteCard from "./inviteCard/inviteCard.vue";
  import login from "dvd-service-js-login"
  import encrypt from "dvd-service-js-encrypt";
  import scriptjs from "scriptjs"
  import app from "../utils/appInterface.es6";
  import wxShare from '../utils/WXShare.es6';
  export default  {
    data(){
      return {
        showFlag:[false,false,false],
        userTicket:0,
        price:0,
        marketPrice:0,
        seriesCover:"",
        supervisorWechatQr:"",
        dataList:[],
        goodsId:0,
        store:0,
        sales:0,
        assistingPlan:"",
        seriesDesc:"",
        joinDeadline:"",
        joinDeadlineUnix:"",
        seriesId:0,
        haveShareCard:1,
        inviteShow: false,
        supervisorPaySuccUrl:'',
        goodsIsOnSale:0,
        isAuditVersion:false,
        priceDesc:""
      }
    },
    components:{
      "com-top-title": require("dvd-service-com-title"),
      "inviteCard":inviteCard
    },
    props:['data'],
    methods:{
      rePay(){
        var _this=this;
        popup.prompt({
          title:"报名开始将以短信的形式通知您",
          placeholder:"请输入手机号",
          btnTitle:"提交",
          okBtnCallback:function(result){
            var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (myreg.test(result)) {
              $.ajax({
                cache: false,
                async: true,
                url: "/api/mg/content/series_course/subscribe",
                type: 'post',
                data: encrypt.ajax({
                  seriesId:_this.seriesId,
                  mobilePhone:result
                }),
                dataType: 'json',
                success(res) {
                  if(res.data && res.data.msg){
                    popup.toast(res.data.msg);
                  }
                },
                error(error) {
                  console.error('ajax error');
                }
              });
            } else {
              popup.toast("请输入正确的手机号");
            }
          },
          cancelBtnTitle:"取消"
        })
      },
      goDetail(url,index){
        if(this.userTicket == 0){
          if(this.isAuditVersion == 0){
            popup.toast("请先购买督导课");
          }else{
            popup.toast("请先报名督导课");
          }
        }else if(this.userTicket == 1){
          this.$set(this.showFlag,index,true);
          window.location.href=url;
        }
      },
      isOnSale(){
        if(new Date().getTime().toString().substr(0,10) <= this.joinDeadlineUnix.toString().substr(0,10)) return true;
        return false;
      },
      submitWork(){
        if(ua.isDvdApp()){
          native.Common.openWXMiniProgram({
            "programId":"gh_14214f3c9fae",
            "path":"pages/user/my/my"
          })
        }else{
          popup.alert({
            className: "", // 钩子（支持传入class名。一个页面需要多种弹窗时，可以根据传入的className在页面设定各种样式）
            title: "提示", // 标题（支持传入html。有则显示。）
            text: "打开“大V督导课”小程序作业打卡", // 文本（支持传入html。有则显示。）
            btnTitle: "确定", // 按钮标题（支持传入html。有则显示，无则显示默认'确定'。）
          });
        }
      },
      showCatalog(index){
        this.$set(this.showFlag,index,!this.showFlag[index]);
      },
      share() {
        login.login();
        let _this = this;
        if (ua.isDvdApp()) {
          app.callAppShare();
        } else {
          if (_this.haveShareCard == 1) {
            _this.inviteShow = !_this.inviteShow;
          } else if (_this.haveShareCard == 0) {
            popup.alert({
              className: "", // 钩子（支持传入class名。一个页面需要多种弹窗时，可以根据传入的className在页面设定各种样式）
              title: "提示", // 标题（支持传入html。有则显示。）
              text: "点击右上角即可分享", // 文本（支持传入html。有则显示。）
              btnTitle: "确定", // 按钮标题（支持传入html。有则显示，无则显示默认'确定'。）
            });
          }
        }
      },
      wechatInvite(){
        window.location.href=this.supervisorPaySuccUrl;
      },
      goCheckout(){
        var _this=this;
        login.login({
          url:window.location.href
        });
        if(this.isAuditVersion == 0){
          window.location.href="/checkout.html?goods[0][id]="+ this.goodsId +"&goods[0][number]=1";
        }else{
          $.ajax({
            cache: false,
            async: true,
            url: "/api/mg/content/series_course/join",
            type: 'post',
            data: encrypt.ajax({
              seriesId: _this.seriesId,
              shareUserId: window.shareUserId
            }),
            dataType: 'json',
            success(res) {
              if(res.data){
                if(res.data.code == 0){
                  popup.toast("报名成功!");
                  setTimeout(function () {
                    window.location.reload();
                  },1000)
                }else{
                  popup.toast(res.data.msg);
                }

              }
            },
            error(error) {
              console.error('ajax error');
            }
          });
        }
      }
    },
    mounted(){

      var _this=this;
      console.log("------------",this.data);
      if(this.data.userTicket){
        this.userTicket=this.data.userTicket;
        if(this.userTicket == 1){
          this.$set(this.showFlag,0,true);
        }
      }
      if(this.data.price){
        this.price=this.data.price;
      }
      if(this.data.marketPrice){
        this.marketPrice=this.data.marketPrice;
      }
      if(this.data.seriesCover){
        this.seriesCover=this.data.seriesCover;
      }
      if(this.data.supervisorWechatQr){
        this.supervisorWechatQr=this.data.supervisorWechatQr;
      }
      if(this.data.dataList){
        this.dataList=this.data.dataList;
      }
      if(this.data.goodsId){
        this.goodsId=this.data.goodsId;
      }
      if(this.data.store){
        this.store=this.data.store;
      }
      if(this.data.sales){
        this.sales=this.data.sales;
      }
      if(this.data.seriesDesc){
        this.seriesDesc=this.data.seriesDesc;
      }
      if(this.data.assistingPlan){
        this.assistingPlan=this.data.assistingPlan;
      }
      if(this.data.joinDeadline){
        this.joinDeadline=this.data.joinDeadline;
      }
      if(this.data.joinDeadlineUnix){
        this.joinDeadlineUnix=this.data.joinDeadlineUnix;
      }
      if(this.data.haveShareCard){
        this.haveShareCard=this.data.haveShareCard;
      }
      if(this.data.supervisorPaySuccUrl){
        this.supervisorPaySuccUrl=this.data.supervisorPaySuccUrl;
      }
      if(this.data.isOnSale){
        this.goodsIsOnSale=this.data.isOnSale;
      }
      if(this.data.isAuditVersion){
        this.isAuditVersion=this.data.isAuditVersion;
      }
      if(this.data.priceDesc){
        this.priceDesc=this.data.priceDesc;
      }
      share.setShareInfo({
        title: _this.data.seriesTitle, // 分享标题
        desc: '大V店妈妈课堂为你分享一个精彩督导课', // 分享描述
        link: location.href, // 分享链接
        imgUrl: _this.seriesCover, // 分享图标
        //        imgUrl: _this.seriesCover+"/resize,m_fill,w_100,h_100/quality,Q_90&", // 分享图标
      });
      if(this.data.seriesId){
        this.seriesId=this.data.seriesId;
        window.iosInterface.getShareInfo = function () {
          let shareInfo = wxShare.getShareInfo();
          if(_this.haveShareCard == 1){
            return JSON.stringify(Object.assign(shareInfo, { seriesId: _this.seriesId }));
          }else if(_this.haveShareCard == 0){
            return JSON.stringify(shareInfo);
          }
        };
      }
      $("body").css("paddingBottom","0.49rem");

      var body = $('body');
      document.title = '督导课详情';
      var iframe = $('<iframe src="/favicon.ico"></iframe>');
      iframe.on('load',function() {
        setTimeout(function() {
          iframe.off('load').remove();
        }, 0);
      }).appendTo(body);
//      $(".supervision")[0].before(this.data);
    }
  }
</script>
<style scoped lang="sass" lang="scss">
  .afterNone{
    &:after{
      display: none;
     }
  }
  .bigImg{
    img{
      width: 3.75rem;
      height: 2.6rem;
    }
  }
  .info{
    background: #FFFFFF;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    padding: 0.2rem;
    div{
      font-size: 0.12rem;
      color: #333333;
      margin-bottom: 0.05rem;
    }
    .sale{
      font-size: 0.18rem;
      color:#FF4A7D;
    }
    .delete{
      color:#999999;
      font-size: 0.11rem;
      text-decoration: line-through;
      margin-left:0.05rem;
    }
    .date{
      color: #FF4A7D;
      margin-left: 0.05rem;
    }
    .have{
      display: inline-block;
      height: 0.22rem;
      width: 1px;
      background: #979797;
      margin-left: 0.1rem;
      margin-right: 0.1rem;
      vertical-align: bottom;
      transform: scale(0.5);
    }
    .info-desc{
      color:#333333;
      font-size: 0.14rem;
      font-weight: 600;
    }
  }
  .catalog{
    background: #ffffff;
    padding : 0.2rem;
    padding-bottom:0.25rem;
    .cata-title{
      font-size: 0.18rem;
      margin-bottom: 0.15rem;
      color:#333333;
      img{
        width: 0.14rem;
        height: 0.2rem;
      }
    }
    .invite{
      width: 2.04rem;
      height: 0.41rem;
      display: block;
      margin: 0 auto;
      font-size: 0.12rem;
      text-align: center;
      line-height: 0.41rem;
      color:#FF4A7D;
      margin-top:0.05rem;
      margin-bottom:0.2rem;
      position: relative;
      &:after{
         position: absolute;
         top: 0;
         left: 0;
         right: 0;
         width: 200%;
         height: 200%;
         bottom: 0;
          transform: scale(0.5);
          content: "";
          border: 1px solid #FF4A7D;
          border-radius: 0.41rem;
    transform-origin: 0 0;
       }
    }
    .cata-border{
      position:relative;
      &:before{
         content: "";
         position: absolute;
         top: 0;
         bottom: 0;
         right: 0;
         left: 0;
         transform: scale(0.5);
         width: 200%;
         height: 200%;
         border: 1px solid #DDDDDD;
         transform-origin: 0 0;
         border-radius: 0.1rem;
         box-sizing: border-box;
       }
       &:after{
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.05rem;
          background-image: linear-gradient(rgba(255,255,255,0),rgba(255,255,255,1));
        }
    }
    .over{
      max-height: 1.89rem;
      overflow: hidden;
    }
    .show_all {
      height: auto;
      overflow:inherit;
      &:after{
         content: "";
         position: absolute;
         top: 0.01rem;
         bottom: 0;
         right: 0;
         left: 0;
         width: 100%;
         height: 100%;
         border-radius: 0.05rem;
         background:none;
       }
    }
    .list{
      padding: 0.1rem;
      position:relative;
      font-size:0;
      .cata-left,.cata-right{
        vertical-align: middle;
        font-size: 0.12rem;
      }
      .cata-left{
        img{
          width: 0.15rem;
          height: 0.12rem;
          border-radius:0.02rem;
        }
        .cata-text{
          line-height: 0.2rem;
          margin-bottom: 0.03rem;
          color:#333333;
          font-size:0.14rem;
          img,span{
            vertical-align: middle;
          }
        }
        .cata-time{
          position:relative;
          color:#999999;
          font-size:0.12rem;
          .cata-right{
            position: absolute;
            display: inline-block;
            right: 0;
            color:#FF4A7D;
            img{
              width: 0.03rem;
              height: 0.07rem;
            }
          }
        }
      }

      &:after{
         content: "";
         position: absolute;
         top: 0;
         bottom: 0;
         right: 0;
         left: 0;
         transform: scale(0.5);
         width: 200%;
         height: 200%;
         border-bottom: 1px solid #DDDDDD;
         transform-origin: 0 0;
       }
    }
    .list:last-child:after{
      border-bottom: 0;
    }
    .cata-bottom{
      width: 3.35rem;
      height: 0.24rem;
      line-height: 0.24rem;
      color:#FF4A7D;
      text-align: center;
      background-image:url('//9i.dvmama.com/free/2018/07/13/button.png');
      background-size: 3.23rem 0.22rem;
      background-repeat: no-repeat;
      background-position: center;
      margin-top: 0.15rem;
    }
  }
  .plan {


    padding: 0.2rem;
    padding-top: 0.25rem;
    background: #ffffff;
    .cata-title {
      font-size: 0.18rem;
      margin-bottom: 0.15rem;
      color: #333333;
      img {
        width: 0.14rem;
        height: 0.2rem;
      }
    }
    .plan-text {
      position: relative;
      &:after{
         content: "";
         position: absolute;
         top: 0;
         bottom: 0;
         right: 0;
         left: 0;
         width: 100%;
         height: 100%;
         border-radius: 0.05rem;
         background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
       }
    }
    .cata-bottom{
      width: 3.35rem;
      height: 0.24rem;
      line-height: 0.24rem;
      color:#FF4A7D;
      text-align: center;
      background-image:url('//9i.dvmama.com/free/2018/07/13/button.png');
      background-size: 3.23rem 0.22rem;
      background-repeat: no-repeat;
      background-position: center;
      margin-top: 0.15rem;
    }
    .over{
      max-height: 1.89rem;
      overflow: hidden;
    }
    .show_all {
      height: auto;
      overflow:inherit;
      &:after{
         content: "";
         position: absolute;
         top: 0.01rem;
         bottom: 0;
         right: 0;
         left: 0;
         width: 100%;
         height: 100%;
         border-radius: 0.05rem;
         background:none;
       }
      }
  }
  .introduce{
    padding: 0.2rem;
    padding-top: 0.25rem;
    background: #ffffff;
    .cata-title {
      font-size: 0.18rem;
      margin-bottom: 0.15rem;
      color: #333333;
    img {
      width: 0.14rem;
      height: 0.2rem;
    }
    }
    .intro-text {
      position: relative;
      &:after{
         content: "";
         position: absolute;
         top: 0;
         bottom: 0;
         right: 0;
         left: 0;
         width: 100%;
         height: 100%;
         border-radius: 0.05rem;
         background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
       }
    }
    .cata-bottom{
      width: 3.35rem;
      height: 0.24rem;
      line-height: 0.24rem;
      color:#FF4A7D;
      text-align: center;
      background-image:url('//9i.dvmama.com/free/2018/07/13/button.png');
      background-size: 3.23rem 0.22rem;
      background-repeat: no-repeat;
      background-position: center;
      margin-top: 0.15rem;
    }
    .over{
      max-height: 1.89rem;
      overflow: hidden;
    }
    .show_all {
      height: auto;
      overflow:inherit;
      &:after{
         content: "";
         position: absolute;
         top: 0.01rem;
         bottom: 0;
         right: 0;
         left: 0;
         width: 100%;
         height: 100%;
         border-radius: 0.05rem;
         background:none;
       }
    }
  }
  .bottom-btn{
    position: fixed;
    width: 3.75rem;
    bottom: 0;
    left: 0;
    z-index: 2;
    right: 0;
    height: 0.49rem;
    .btn-area{
      font-size:0;
      height: 100%;
      width: 100%;
      div{
        display:inline-block;
        vertical-align: middle;
        font-size: 0.14rem;
        height: 100%;
        text-align: center;
        line-height: 0.49rem;
      }
      .btn-left{
        color:#666666;
        font-size:0.14rem;
        width: 1.6rem;
        background: #F9F7F8;
        opacity: 0.95;
        img{
          height: 0.12rem;
          width: 0.12rem;
        }
      }
      .btn-right{
        width: 2.15rem;
        color:#FFFFFF;
        font-size:0.14rem;

        background:-webkit-linear-gradient(to right,rgba(255, 97, 60, 1), rgba(250, 24, 98, 1));
        background:-o-linear-gradient(to right,rgba(255, 97, 60, 1), rgba(250, 24, 98, 1));
        background:-moz-linear-gradient(to right,rgba(255, 97, 60, 1), rgba(250, 24, 98, 1));
        background:-ms-linear-gradient(to right,rgba(255, 97, 60, 1), rgba(250, 24, 98, 1));
        background:linear-gradient(to right,rgba(255, 97, 60, 1), rgba(250, 24, 98, 1));
      }
    }
    .btn-area2,.btn-area3{
      font-size: 0.14rem;
      width: 100%;
      height: 0.49rem;
      text-align: center;
      line-height: 0.49rem;
      color:#FFFFFF;
    }
    .btn-area2{
      background:-webkit-linear-gradient(to right,rgba(192, 192, 192, 1), rgba(153, 153, 153, 1));
      background:-o-linear-gradient(to right,rgba(192, 192, 192, 1), rgba(153, 153, 153, 1));
      background:-moz-linear-gradient(to right,rgba(192, 192, 192, 1), rgba(153, 153, 153, 1));
      background:-ms-linear-gradient(to right,rgba(192, 192, 192, 1), rgba(153, 153, 153, 1));
      background:linear-gradient(to right,rgba(192, 192, 192, 1), rgba(153, 153, 153, 1));
    }
    .btn-area3{
      background:-webkit-linear-gradient(to right,rgba(255, 97, 60, 1), rgba(250, 24, 98, 1));
      background:-o-linear-gradient(to right,rgba(255, 97, 60, 1), rgba(250, 24, 98, 1));
      background:-moz-linear-gradient(to right,rgba(255, 97, 60, 1), rgba(250, 24, 98, 1));
      background:-ms-linear-gradient(to right,rgba(255, 97, 60, 1), rgba(250, 24, 98, 1));
      background:linear-gradient(to right,rgba(255, 97, 60, 1), rgba(250, 24, 98, 1));
    }
  }
  .alert{
    display: inline-block;
    position: fixed;
    width: 2.75rem;
    height: 1.72rem;
    left: 50%;
    transform:translateX(-50%);
    border-radius:0.08rem;
  }
</style>
