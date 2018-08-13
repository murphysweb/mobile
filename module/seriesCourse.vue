<template>
  <div id="series">
    <!--<div class="top0" v-if='deleteFlag && !isApp && visitorFlag!=0'>
            <div class="top_container">
                <div class="top_left">
                    <a class="top_back" href="javascript:history.back();">
                        <span class="home_arrow"></span>
                    </a>
                </div>
                &lt;!&ndash;文章标题&ndash;&gt;
                &lt;!&ndash; <div class="title_container" v-text='dataList.seriesTitle'></div> &ndash;&gt;
                <div class="title_container" v-text='"系列课详情"'></div>
                <div class="top_right">
                    <a class="top_share share_to_web">
                        <span class="icon"></span>
                    </a>
                    <a href="/" class="top_home">
                        <span class="home_icon"></span>
                    </a>
                </div>
            </div>
        </div>-->

    <!--标题-->
    <template v-if="checkSupervisionClassFlag">
      <template v-if="growthBox == 1">
        <com_growth :set-head="false" title="系列课详情"></com_growth>
      </template>
      <template v-else>
        <com-top-title :set-head="false" title="系列课详情" :share-money="seriesShareIncome" :share-click="share" v-if="seriesShareIncome"></com-top-title>
        <com-top-title :set-head="false" title="系列课详情" share :share-click="share" v-if="!seriesShareIncome"></com-top-title>
      </template>
    </template>

    <!-- 添加邀请人 -->
    <series-course-invite :show-invite-model="showInviteModel" :series-id="seriesId" @close="inviteInputClose" @success="inviteSuccess"></series-course-invite>

    <!--<div class='seriesImgTop' v-if='deleteFlag && !isApp && visitorFlag!=0'></div>-->

    <div class='seriesImg' v-if='deleteFlag && visitorFlag!=0'>
      <!--专题头图-->
      <img :src="seriesCover" v-if='seriesCover'>

    </div>

    <div class='seriesImg' v-if='deleteFlag && visitorFlag!=0'>
      <!--专题头图-->
      <div class='seriesImgTitle' v-text='dataList.seriesTitle' v-if="dataList.seriesTitle"></div>
    </div>

    <div class='seriesImg' v-if='deleteFlag && visitorFlag!=0 && isAuditing && seriesPrice'>
      <!--专题头图-->
      <template v-if="util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0">
        <div class='seriesImgPrice'>
          <span style="font-size: 16px">价格: </span>
          <span style="font-size: 18px;font-weight: 500" v-text='doPrice(seriesPrice)'></span>
          <span style="font-size: 14px;"> v豆</span>
        </div>
      </template>
      <template v-else>
        <div class='seriesImgPrice' v-text='seriesPrice'></div>
      </template>
    </div>

    <div class='dvk4_container' v-if='deleteFlag && userTicket==1 && visitorFlag!=0' :class='{marginTopStyle: userTicket==1}'>
      <div class='dvk4_content'>
        <div class="dvk4_detail" v-for='item in dataList.dataList' :key='item.id'>
          <div class='dvk4_detail_content' @click='dvkHref(item)'>
            <div class='dvk4_detail_content_text'>
              <div class='dvk4_detail_content_title'>
                <span class='title_leftBorder'></span>
                <span v-text='item.title'></span>
              </div>
              <div class='dvk4_detail_content_name'>
                <span v-text='doTime(item.startTime)'></span>
                <span v-text='item.teacher'></span>
                <span class='dvk4_detail_content_popular'>
                  <span v-if='item.type == 1 && isAuditing'>
                    <span class='popular_color' v-if='courseTypeSwitch==1'>公开课</span>
                    <span v-if='courseTypeSwitch==0' v-text='item.pv'></span>
                  </span>
                  <span v-if='item.type == 2 && isAuditing'>
                    <span v-if="userTicket==1 && coursePriceSwitch==1 && (util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0)" style='text-decoration: line-through;color:#999;' class='popular_color'>
                      <span v-text='doPrice(item.coursePrice)'></span>
                      <span> v豆</span>
                    </span>
                    <span v-if="userTicket==1 && coursePriceSwitch==1 && !(util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0)" style='text-decoration: line-through;color:#999;' class='popular_color' v-text='item.coursePrice'></span>

                    <span v-if="userTicket==0 && coursePriceSwitch==1 && (util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0)" class='popular_color'>
                      <span v-text="doPrice(item.coursePrice)"></span>
                      <span> v豆</span>
                    </span>
                    <span v-if="userTicket==0 && coursePriceSwitch==1 && !(util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0)" class='popular_color' v-text='item.coursePrice'></span>

                    <span v-if='coursePriceSwitch==0' v-text='item.pv'></span>
                  </span>
                  <span v-if='item.type == 3 && isAuditing'>
                    <span class='popular_color' v-if='courseTypeSwitch==1'>加密课</span>
                    <span v-if='courseTypeSwitch==0' v-text='item.pv'></span>
                  </span>
                </span>
              </div>
            </div>
            <div class='new_detail' v-if='userTicket!=1'>
              查看
            </div>
            <div class='new_detail' v-if='userTicket==1'>
              点击听课
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class='seriesImg' v-if='deleteFlag && visitorFlag!=0 && getHtml(dataList.seriesDesc)'>
      <!--专题简介-->
      <div class="summary">
        <!-- <p v-text='dataList.seriesDesc'></p> -->
        <p v-html='getHtml(dataList.seriesDesc)'></p>
      </div>
    </div>

    <div class='dvk4_container' v-if='deleteFlag && userTicket==0 && visitorFlag!=0'>
      <div class='dvk4_content'>
        <div class="dvk4_detail" v-for='item in dataList.dataList' :key='item.id'>
          <div class='dvk4_detail_content' @click='dvkHref(item)'>
            <div class='dvk4_detail_content_text'>
              <div class='dvk4_detail_content_title'>
                <span class='title_leftBorder'></span>
                <span v-text='item.title'></span>
              </div>
              <div class='dvk4_detail_content_name'>
                <span v-text='doTime(item.startTime)'></span>
                <span v-text='item.teacher'></span>
                <span class='dvk4_detail_content_popular'>
                  <span v-if='item.type == 1 && isAuditing'>
                    <span class='popular_color' v-if='courseTypeSwitch==1'>公开课</span>
                    <span v-if='courseTypeSwitch==0' v-text='item.pv'></span>
                  </span>
                  <span v-if='item.type == 2 && isAuditing'>
                    <!--自费课 userTicket 0:未报名 1:报名 coursePriceSwitch 0:不显示价格 1:显示价格-->
                    <span v-if="userTicket==1 && coursePriceSwitch==1 && (util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0)" style='text-decoration: line-through;color:#999;' class='popular_color'>
                      <span v-text='doPrice(item.coursePrice)'></span>
                      <span> v豆</span>
                    </span>
                    <span v-if="userTicket==1 && coursePriceSwitch==1 && !(util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0)" style='text-decoration: line-through;color:#999;' class='popular_color' v-text='item.coursePrice'></span>
                    <span v-if="userTicket==0 && coursePriceSwitch==1 && (util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0)" class='popular_color'>
                      <span v-text='doPrice(item.coursePrice)'></span>
                      <span> v豆</span>
                    </span>
                    <span v-if="userTicket==0 && coursePriceSwitch==1 && !(util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0)" class='popular_color' v-text='item.coursePrice'></span>
                    <span v-if='coursePriceSwitch==0' v-text='item.pv'></span>
                  </span>
                  <span v-if='item.type == 3 && isAuditing'>
                    <span class='popular_color' v-if='courseTypeSwitch==1'>加密课</span>
                    <span v-if='courseTypeSwitch==0' v-text='item.pv'></span>
                  </span>
                </span>
              </div>
            </div>
            <div class='new_detail' v-if='userTicket!=1'>
              查看
            </div>
            <div class='new_detail' v-if='userTicket==1'>
              点击听课
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--添加邀请人-->
    <div class="inviteContent" v-if="showInviteButton === true || showInviteInfo === true">
      <div class="inputInvitePeople" @click="inviteCourseClick" v-if="showInviteButton === true">填写邀请人信息</div>
      <div class="invitePeopleInfo" v-if="showInviteInfo === true">已添加邀请人：{{invitedPhoneNum}}</div>
    </div>

    <div class="containerPadding" v-if='deleteFlag && visitorFlag!=0 && isAuditing'></div>
    <!--seriesType==1 收费-->
    <div class='seriesBtn' v-if='seriesType==1 && deleteFlag && visitorFlag!=0 && isAuditing'>
      <div class='btn btn1 btn_left' v-if="growthBox != 1">
        <!--收费 会员-->
        <span class='btn_span' @click='share' v-if='state == 3'>邀请好友
          <span v-if="seriesShareIncome">赚: {{seriesShareIncome}}</span>
          <img src="//pic.davdian.com/free/2017/07/28/centerShare.png">
        </span>
        <!--收费 非会员-->
        <span class='btn_span' v-if='state != 3' @click='beNumber'>成为会员免费听</span>
      </div>
      <!--收费 未报名 -->
      <div class='btn btn2 btn_right' v-if='userTicket==0' :style="{'width': growthBox == 1 ? '100%' : '2.15rem'}">
        <!--songyanqi 2018 4/18新增业务逻辑 start-->
        <template v-if="isEnglish == 1 ">
          <!--收费 未报名 会员-->
          <span class='btn_span' @click='toGoodsMessage()'>点击进入商品详情</span>
        </template>
        <!--songyanqi 2018 4/18新增业务逻辑 end-->

        <template v-else>
          <!--收费 未报名 会员-->
          <span class='btn_span' v-if="state == 3 && (util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0)" @click='apply'>会员免费:
            <span style='text-decoration: line-through;'>{{doPrice(seriesPrice)}} v豆</span>
          </span>
          <span class='btn_span' v-if="state == 3 && !(util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0)" @click='apply'>会员免费:
            <span v-text='seriesPrice' style='text-decoration: line-through;'></span>
          </span>

          <!--收费 未报名 非会员-->
          <template v-if="state != 3 && util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0 && !loginModule.isSeller()">
            <span class='btn_span' v-if='state != 3' @click='apply'>购买课程:{{doPrice(seriesPrice)}} v豆</span>
          </template>
          <template v-if="state != 3 && !(util.utils.isApp() && util.utils.isIOS() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0 && !loginModule.isSeller())">
            <span class='btn_span' v-if='state != 3' @click='apply'>购买课程:{{seriesPrice}}</span>
          </template>
        </template>
      </div>
      <div class='btn btn3 btn_right' v-if='userTicket==1' :style="{'width': growthBox == 1 ? '100%' : '2.15rem'}" @click='success'>
        <span class='btn_span'>报名成功</span>
      </div>
    </div>
    <!--新增 如果与商品id 绑定并且不需要付费-->
    <div class='seriesBtn' v-if='seriesType!=1 && deleteFlag && visitorFlag!=0 && isAuditing && isEnglish == 1 && userTicket==0'>
      <div class='btn btn1 btn_left'>
        <!--收费 会员-->
        <span class='btn_span' @click='share' v-if='state == 3'>邀请好友
          <span v-if="seriesShareIncome">赚: {{seriesShareIncome}}</span>
          <img src="//pic.davdian.com/free/2017/07/28/centerShare.png">
        </span>
        <!--收费 非会员-->
        <span class='btn_span' v-if='state != 3' @click='beNumber'>成为会员免费听</span>
      </div>
      <!--收费 未报名 -->
      <div class='btn btn2 btn_right'>
        <!--songyanqi 2018 4/18新增业务逻辑 start-->
        <!--收费 未报名 会员-->
        <span class='btn_span' @click='toGoodsMessage()'>点击进入商品详情</span>
      </div>
      <!--<div class='btn btn3 btn_right' v-if='userTicket==1' @click='success'>-->
      <!--<span class='btn_span'>报名成功</span>-->
      <!--</div>-->
    </div>

    <!--<div class='shareToastMark' v-if='shareToastFlag &&  deleteFlag' @click='share'></div>-->

    <!--<div class='shareToast' v-if='shareToastFlag && deleteFlag'>-->
    <!--<div class='shareToastTitle' v-if="seriesShareIncome">点击右上角即可分享，当好友通过您的分享报名课程，并在您的店铺下单，您便可获得{{seriesShareIncome}}元分享奖金</div>-->
    <!--<div class='shareToastTitle' v-if="!seriesShareIncome">点击右上角即可分享</div>-->
    <!--<div class='shareToastBtn' @click='share'>确定</div>-->
    <!--</div>-->

    <invite-card :show="inviteShow" :id="seriesId" statistics="3" @close="share" kind="1"></invite-card>

    <div class='shareToastMark' v-if='beSuccess' @click='successMark'></div>
    <div class='shareToast shareToastNew' v-if='beSuccess && visitorFlag!=0'>
      <h1 class='shareToastNewTitle'>报名成功</h1>
      <div class='shareToastTitle1'>现在您点击系列课中的任意课程,就可以随时开始听课了~</div>
      <div class='shareToastBtn' @click='successMark'>确定</div>
    </div>
    <div v-if='!deleteFlag && visitorFlag!=0'>
      <img class='delete_img' src="//pic.davdian.com/free/introduce_fail.png">
      <p class='delete_content'>
        <span>课程不存在啦</span>
        <span>去看看老师的其他课程</span>
      </p>
      <p class='delete_btn' @click='goTeacherProfile'>进入老师个人主页</p>
    </div>
    <div v-if='visitorFlag==0' class='noApply'>
      <img src="//pic.davdian.com/free/2017/09/01/Group.png">
      <p>登录后才能继续访问</p>
      <span @click='login'>立即登录</span>
    </div>
  </div>
</template>

<script>
let axios = require("axios");
require("babel-polyfill");
require("es6-promise").polyfill();
import lay from "./index/layout.es6";
import dialog from "../utils/dialog.es6";
import util from "../utils/utils.es6";

import app from "../utils/appInterface.es6";
import wx from "../utils/WXShare.es6";
import layout from "./layout/api.es6";

import inviteCard from "./inviteCard/inviteCard.vue";
import native from "../src/common/js/module/native.js";
import ua from "../src/common/js/module/ua.js";
import _login from "../src/common/js/module/login.js";
import iosPay from "../src/common/js/module/iosPay.js";
import loginModule from "../src/common/js/module/login.js";

import popup from "dvd-service-js-popup";
import param from "dvd-base-js-param";
import com_growth from "../src/component/com-top-title_growthBox.vue";
import seriesCourseInvite from "./seriesCourseInvite.vue";

var supervisionClass = require("./supervisionClass.vue");


export default {
  data() {
    return {
      loginModule: loginModule,
      ua: ua,
      _login: _login,
      util: util,
      shareToastFlag: false,
      state: null,
      userTicket: null,
      isEnglish: "", // 是否是英语课程
      goodsId: "", // isEnglish为1 时 存在goodsId节点
      seriesId: window.seriesId, // 加载页面数据和分享卡的数据需要的参数
      shareUserId: window.shareUserId,
      //公开课
      courseTypeSwitch: null,
      //付费课
      coursePriceSwitch: null,
      //系列课类型
      seriesType: null,
      seriesPrice: "",
      seriesShareIncome: "",
      seriesCover: "",
      //系列课课程列表
      dataList: [],
      deleteFlag: true,
      beSuccess: false,
      isApp: !!navigator.userAgent.match(/davdian|bravetime|vyohui/),

      inviteShow: false,

      haveShareCard: 0,
      visitorFlag: -1,
      isAuditing: false,
      showInviteButton: false, //显示邀请按钮
      showInviteInfo: false, // 显示邀请人信息
      showInviteModel: false, // 显示邀请弹窗
      invitedPhoneNum: "", //已邀请人手机号

      response: null,

      growthBox: param.get("growthBox") ? 1 : 0,
      ajaxUrl: param.get("growthBox")
        ? "//box.api.davdian.com/content/series_course/detail"
        : "/api/mg/content/series_course/detail",
      joinUrl: param.get("growthBox")
        ? "//box.api.davdian.com/content/series_course/join"
        : "/api/mg/content/series_course/join",
      checkSupervisionClassFlag:false
    };
  },
  ready: function() {},
  computed: {},
  mounted() {
    window.appData = {
      showHead: 1, // 是否展示头部
      showFoot: 0, // 是否展示底部
      backOnHead: 1, // 头部返回按钮
      homeOnHead: 0, // 头部首页按钮
      shareOnHead: 1, // 头部分享按钮
      btnOnHead: 0, // 头部文字按钮
      btnText: "", // 头部文字按钮文字
      btnLink: "", // 头部文字按钮链接
      haveShareCard: this.haveShareCard,
      courseId: this.courseId
    };
    app.init();

    // app设置的初始化应该在得到haveShareCard之后，所以应该放在axios的回调函数中
    // 注意app，微信和区别，需要考虑的问题
    this.remSize();
    this.init();
    console.log("ua.getDvdAppVersion()", ua.getDvdAppVersion());
  },
  methods: {
    checkSupervisionClass(dataList){
//      var data=$(".dvd-service-com-title")[0].outerHTML;
      this.checkSupervisionClassFlag=false;
      $("#seriesCourse").empty();
      window.backNewData.$destroy();
      new Vue({
        el: (function () {
          return window.backNewData.$el.appendChild(document.createElement('div'))
        })(),
        components:{
          supervisionClass:supervisionClass
        },
        template:'<supervision-class :data="data"></supervision-class>',
        data(){
          return {
            data:dataList
          }
        }
      })
    },
    doPrice(price) {
      return parseInt(price.toString().replace("¥", "")).toString();
    },
    doTime(time) {
      return time.substr(0, 16);
    },
    appUpData() {
      var that = this;
      var obj = { seriesId: this.seriesId };
      axios
        .post(that.ajaxUrl, lay.strSign("series", obj))
        .then(function(respone) {
          if(respone.data && respone.data.data && respone.data.data.assistingData){
            that.checkSupervisionClass(respone.data.data.assistingData);
            return;
          }
          if (respone.data && respone.data.code == 30024) {
            // that.deleteFlag = false
            if (JSON.parse(sessionStorage.getItem("history")).length > 1) {
              window.history.back();
            } else {
              window.location.href = window.location.host;
            }
          } else {
            if (respone.data.code == 30000) {
              that.state = 0;
              that.visitorFlag = 0;
              if (ua.isDvdApp()) {
                if (ua.compareVersion(ua.getDvdAppVersion(), "5.2.0") < 0) {
                  setTimeout(function() {
                    native.Browser.initHead({ content: { shareOnHead: "0" } });
                  }, 100);
                } else {
                  native.Browser.setHead({
                    isAudioAbsorb: "1",
                    isShowAudio: "1",
                    hideHead: "1"
                  });
                }
              }
            } else {
              if (respone.data.data && respone.data.code == 0) {
                if (respone.data) {
                  that.haveShareCard = respone.data.data.haveShareCard;
                  console.log(that.haveShareCard, 121212);
                  console.log("response", respone.data);
                  that.seriesCover = respone.data.data.seriesCover;
                  that.dataList = respone.data.data;
                  that.state = respone.data.visitor_status;
                  if (that.state == 0) {
                    if (ua.isDvdApp()) {
                      if (
                        ua.compareVersion(ua.getDvdAppVersion(), "5.2.0") < 0
                      ) {
                        native.Browser.setHead({ shareBtn: "0" });
                      } else {
                        native.Browser.setHead({
                          isAudioAbsorb: "1",
                          isShowAudio: "1",
                          shareBtn: "0",
                          hideHead: "1"
                        });
                      }
                    }
                  }
                  that.userTicket = respone.data.data.userTicket;
                  that.isEnglish = respone.data.data.isEnglish; //是否是英语课程
                  if (that.isEnglish == 1) {
                    that.goodsId = respone.data.data.goodsId;
                  }
                  that.courseTypeSwitch = respone.data.data.courseTypeSwitch;
                  that.coursePriceSwitch = respone.data.data.coursePriceSwitch;
                  that.seriesType = respone.data.data.seriesType;
                  that.seriesPrice = respone.data.data.seriesPrice;
                  that.seriesShareIncome = respone.data.data.seriesShareIncome;

                  //添加邀请人信息
                  if (respone.data.data.inviteInfo) {
                    if (respone.data.data.inviteInfo.status === "0") {
                      that.showInviteButton = true;
                    } else {
                      that.showInviteButton = false;
                      that.showInviteInfo = true;
                      that.invitedPhoneNum =
                        respone.data.data.inviteInfo.mobilePhone;
                    }
                  }
                  that.checkSupervisionClassFlag=true;
                  console.log(that.haveShareCard, that.haveShareCard != "0");
                  if (
                    that.haveShareCard &&
                    that.haveShareCard != "0" &&
                    that.haveShareCard != 0
                  )
                    window.moreShareInfo = { seriesId: that.seriesId };
                  that.setTitle(that.seriesShareIncome);
                  var shareInfo = {
                    successTimelineShare: function() {
                      layout.statisticsShare({ shareType: 1, shareSource: 18 });
                    },
                    successAppMessageShare: function() {
                      layout.statistics({ shareType: 2, shareSource: 18 });
                    },
                    successQqMessageShare: function() {
                      layout.statistics({ shareType: 4, shareSource: 18 });
                    },
                    successWeiboMessageShare: function() {
                      layout.statistics({ shareType: 7, shareSource: 18 });
                    }
                  };
                  wx.init(shareInfo);
                }
              } else {
                if (respone.data) {
                  dialog.alert("detail code:" + respone.data.code);
                } else {
                  dialog.alert("detail接口无data");
                }
              }

            }
          }
        })
        .catch(function(error) {
          console.log(error, 11111111);
        });
    },
    successMark() {
      this.beSuccess = false;
    },
    success() {
      this.beSuccess = true;
    },

    inviteCourseClick() {
      this.showInviteModel = true;
    },

    inviteInputClose() {
      this.showInviteModel = false;
    },

    inviteSuccess() {
      console.log("asdasd");
      this.showInviteModel = false;
      this.appUpData();
    },

    dvkHref(item) {
      window.location.href = item.command.content;
    },
    goTeacherProfile() {
      console.log("/course-teacher-" + this.teacherId + ".html");
      if (this.cmd) {
        window.location = this.cmd;
      } else {
        alert("cmd为:", this.cmd);
      }
    },
    login() {
      native.Account.login();
    },
    init() {
      var that = this;
      var obj = { seriesId: this.seriesId };
      axios
        .post(that.ajaxUrl, lay.strSign("series", obj))
        .then(function(respone) {
          if(respone.data && respone.data.data && respone.data.data.assistingData){
              that.checkSupervisionClass(respone.data.data.assistingData);
              return;
          }
          that.response = respone.data;
          console.log(that.response, 333);
          if (window.appData) {
            window.appData.isShowAudio = 1;
          } else {
            window.appData = {
              isShowAudio: 1
            };
          }
          setTimeout(function() {
            if (that.seriesType == 1 && that.deleteFlag && that.state != 0) {
              if (window.appData) {
                window.appData.isAudioAbsorb = 1;
              } else {
                window.appData = {
                  isAudioAbsorb: 1
                };
              }
            }
          }, 400);
          if (ua.isDvdApp()) {
            if (ua.compareVersion(ua.getDvdAppVersion(), "5.2.0") < 0) {
              setTimeout(function() {
                window.bravetime.initHead();
              }, 50);
            } else {
              native.Browser.setHead({
                isAudioAbsorb: "1",
                isShowAudio: "1",
                hideHead: "1"
              });
            }
          }

          if (respone.data && respone.data.code == 30024) {
            // that.deleteFlag = false
            if (JSON.parse(sessionStorage.getItem("history")).length > 1) {
              window.history.back();
            } else {
              window.location.href = window.location.host;
            }
          } else {
            if (respone.data.code == 30000) {
              that.state = 0;
              that.visitorFlag = 0;
              if (ua.isDvdApp()) {
                if (ua.compareVersion(ua.getDvdAppVersion(), "5.2.0") < 0) {
                  setTimeout(function() {
                    native.Browser.initHead({
                      content: {
                        shareOnHead: 0
                      }
                    });
                  }, 100);
                } else {
                  native.Browser.setHead({
                    isAudioAbsorb: "1",
                    isShowAudio: "1",
                    hideHead: "1"
                  });
                }
              }
            } else {
              if (respone.data.data && respone.data.code == 0) {
                if (respone.data) {
                  that.haveShareCard = respone.data.data.haveShareCard;
                  console.log("response", respone.data);
                  console.log(that.haveShareCard, 121212);
                  that.seriesCover = respone.data.data.seriesCover;
                  that.dataList = respone.data.data;
                  that.state = respone.data.visitor_status;
                  if (that.state == 0) {
                    if (ua.isDvdApp()) {
                      if (
                        ua.compareVersion(ua.getDvdAppVersion(), "5.2.0") < 0
                      ) {
                        native.Browser.setHead({ shareBtn: "0" });
                      } else {
                        native.Browser.setHead({
                          isAudioAbsorb: "1",
                          isShowAudio: "1",
                          shareBtn: "0",
                          hideHead: "1"
                        });
                      }
                    }
                  }
                  if (respone.data.data.isAuditVersion == 0) {
                    that.isAuditing = true;
                  } else if (respone.data.data.isAuditVersion == 1) {
                    that.isAuditing = false;
                  }
                  that.checkSupervisionClassFlag=true;
                  that.userTicket = respone.data.data.userTicket; // userTicket 0:未报名 1:已报名
                  that.isEnglish = respone.data.data.isEnglish; //是否是英语课程
                  if (that.isEnglish == 1) {
                    that.goodsId = respone.data.data.goodsId;
                  }
                  that.courseTypeSwitch = respone.data.data.courseTypeSwitch; // courseTypeSwitch 公开课 0:不显示 1:显示
                  that.coursePriceSwitch = respone.data.data.coursePriceSwitch; // coursePriceSwitch 自费课
                  that.seriesType = respone.data.data.seriesType; //seriesType 0:免费系列课 1:收费系列课
                  that.seriesPrice = respone.data.data.seriesPrice;
                  that.seriesShareIncome = respone.data.data.seriesShareIncome;

                  //添加邀请人信息
                  if (respone.data.data.inviteInfo) {
                    if (respone.data.data.inviteInfo.status === "0") {
                      that.showInviteButton = true;
                    } else {
                      that.showInviteButton = false;
                      that.showInviteInfo = true;
                      that.invitedPhoneNum =
                        respone.data.data.inviteInfo.mobilePhone;
                    }
                  }

                  if (
                    that.haveShareCard &&
                    that.haveShareCard != "0" &&
                    that.haveShareCard != 0
                  )
                    window.moreShareInfo = { seriesId: that.seriesId };
                  that.setTitle(that.seriesShareIncome);
                  var shareInfo = {
                    successTimelineShare: function() {
                      layout.statisticsShare({ shareType: 1, shareSource: 18 });
                    },
                    successAppMessageShare: function() {
                      layout.statistics({ shareType: 2, shareSource: 18 });
                    },
                    successQqMessageShare: function() {
                      layout.statistics({ shareType: 4, shareSource: 18 });
                    },
                    successWeiboMessageShare: function() {
                      layout.statistics({ shareType: 7, shareSource: 18 });
                    }
                  };
                  wx.init(shareInfo);
                }
              } else {
                if (respone.data) {
                  dialog.alert("detail code:" + respone.data.code);
                } else {
                  dialog.alert("detail接口无data");
                }
              }

            }
          }
        })
        .catch(function(error) {
          console.log(error, 11111111);
        });
    },
    getHtml(str) {
      if (str) {
        let str1 = str.replace(/\n/g, "<br/>");
        return str1;
      } else {
        return undefined;
      }
    },
    setTitle(brokerage) {
      if (!!navigator.userAgent.match(/davdian|bravetime/)) {
        var str = brokerage.substring(1, brokerage.length);
        if (str > 0) {
          if (ua.isDvdApp()) {
            if (ua.compareVersion(ua.getDvdAppVersion(), "5.2.0") < 0) {
              app.setHead({ shareMoney: str + "" });
            } else {
              native.Browser.setHead({
                isAudioAbsorb: "1",
                isShowAudio: "1",
                shareMoney: str + "",
                hideHead: "1"
              });
            }
          }
          window.moreShareInfo.shareTitle = "分享至少赚" + brokerage + "元";
          window.moreShareInfo.shareDesc =
            "只要有好友在您分享的链接中购物，您就可以得到对应的商品返现。通过链接还能直接进入您的店铺，好友购物您就赚钱~";
        }
      }
    },
    beNumber() {
      // window.location.href = '/t-10838.html?rp=course_detail&rl=inv_button'
      window.location.href = "/index.php?c=ShopGoods&a=index&id=348&kd_type=2";
    },
    apply() {
      // 如果是iosApp5.2.0以上，调起苹果支付
      if (
        util.utils.isIOS() &&
        ua.isDvdApp() &&
        ua.compareVersion(ua.getDvdAppVersion(), "5.2.0") >= 0 &&
        !_login.isSeller()
      ) {
        iosPay.pay({
          type: "series_course",
          courseId: this.response.data.seriesId,
          price: this.response.data.seriesPrice
        });
        return;
      }

      var that = this;
      var obj = { seriesId: this.seriesId, shareUserId: this.shareUserId };
      axios
        .post(that.joinUrl, lay.strSign("series", obj))
        .then(function(respone) {
          console.log("respone12312321->>", respone);
          if (respone.data && respone.data.code == 0) {
            if (respone.data.data) {
              if (respone.data.data.jsApi) {
                let jsApi = respone.data.data.jsApi;
                jsApi.jsApiParameters.dvdhref = location.href;
                window.location =
                  "http://open.davdian.com/wxpay_t2/davke_pay.php?info=" +
                  encodeURIComponent(JSON.stringify(jsApi.jsApiParameters));
                // window.location = 'http://open.vyohui.cn/wxpay_t3/davke_pay.php?info='+encodeURIComponent(JSON.stringify(jsApi.jsApiParameters))
              } else if (respone.data.data.payUrl) {
                // window.location.href = respone.data.data.payUrl
                bravetime.nativePay(respone.data.data.payUrl, function(flag) {
                  if (flag) {
                    // 先改状态
                    that.userTicket = 1;
                    dialog.info("系列课报名成功");
                    // that.userTicket = 0;
                    // goCourse();
                  }
                });
              } else {
                that.userTicket = 1;
                dialog.info("系列课报名成功");
              }
            }
            that.appUpData();
          } else {
            if (respone.data) {
              dialog.alert("message_list code:" + respone.data.code);
            } else {
              dialog.alert("message_list接口无data");
            }
          }
        })
        .catch(function(error) {
          console.log(error, 11111111);
        });
    },
    share() {
      let _this = this;
      if (_this.isApp) {
        app.callAppShare();
      } else {
        console.log(66);
        console.log(_this.haveShareCard);
        if (_this.haveShareCard == 1) {
          _this.inviteShow = !_this.inviteShow;
        } else if (_this.haveShareCard == 0) {
          if (_this.seriesShareIncome) {
            popup.alert({
              className: "", // 钩子（支持传入class名。一个页面需要多种弹窗时，可以根据传入的className在页面设定各种样式）
              title: "", // 标题（支持传入html。有则显示。）
              text:
                "点击右上角即可分享，当好友通过您的分享报名课程，并在您的店铺下单，您便可获得" +
                _this.seriesShareIncome +
                "元分享奖金", // 文本（支持传入html。有则显示。）
              btnTitle: "确定", // 按钮标题（支持传入html。有则显示，无则显示默认'确定'。）
              okBtnCallback() {
                // 按钮点击回调（有则执行该回调）
                _this.shareToastFlag = !_this.shareToastFlag;
              }
            });
          } else {
            popup.alert({
              className: "", // 钩子（支持传入class名。一个页面需要多种弹窗时，可以根据传入的className在页面设定各种样式）
              title: "", // 标题（支持传入html。有则显示。）
              text: "点击右上角即可分享", // 文本（支持传入html。有则显示。）
              btnTitle: "确定", // 按钮标题（支持传入html。有则显示，无则显示默认'确定'。）
              okBtnCallback() {
                // 按钮点击回调（有则执行该回调）
                _this.shareToastFlag = !_this.shareToastFlag;
              }
            });
          }
        }
      }
    },
    //rem单位
    remSize() {
      (function(doc, win) {
        var docEl = doc,
          isIOS = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
          dpr = isIOS ? Math.min(win.devicePixelRatio, 3) : 1,
          dpr = window.top === window.self ? dpr : 1, //被iframe引用时，禁止缩放
          resizeEvt =
            "orientationchange" in window ? "orientationchange" : "resize";
        docEl.documentElement.dataset.dpr = dpr;
        var recalc = function() {
          var width = docEl.body.clientWidth;

          if (width / dpr > 750) {
            width = 750 * dpr;
          }
          docEl.documentElement.dataset.width = width;
          docEl.documentElement.dataset.percent = 200 * (width / 750);
          docEl.documentElement.style.fontSize = 200 * (width / 750) + "px";
          docEl.body.style.fontSize = "14px";
          var list = document.querySelectorAll("[base-on-rem]");
          for (var i = 0; i < list.length; i++) {
            list[i].removeAttribute("base-on-rem");
          }
          $(".need_js_height").css(
            "height",
            Math.floor((width - 20) / 2 * 600 / 531) + "px"
          );
          $(".need_js_height_seckill").css(
            "height",
            Math.floor((width - 25) / 2 * 362 / 350) + "px"
          );
        };
        recalc();
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
      })(document, window);
    },
    //绑定商品id 的 跳转到 商品详情
    toGoodsMessage() {
      let that = this;
      window.location.href = that.goodsId + ".html";
    }
  },
  components: {
    inviteCard,
    seriesCourseInvite: seriesCourseInvite,
    "com-top-title": require("../src/component/com-top-title.vue"),
    com_growth: com_growth
  }
};
</script>

<style type="text/css" scoped lang='sass'>
/*添加系列课邀请人*/
.inviteContent {
  position: relative;
  widows: 100%;
  height: 70px;
}

.inputInvitePeople {
  position: relative;
  width: 120px;
  height: 22px;
  top: 20px;
  margin: auto;
  background-color: #f0f0f0;
  color: #ff4a7d;
  border: 1px solid;
  border-radius: 11px;
  border-color: #ff4a7d;
  font-size: 12px;
  text-align: center;
}

.invitePeopleInfo {
  position: relative;
  width: 100%;
  height: 22px;
  top: 20px;
  margin: auto;
  text-align: center;
  color: #333333;
  font-size: 14px;
}

.new_detail{
  position: absolute;
  width: 0.64rem;
  height: 0.22rem;
  text-align: center;
  line-height: 0.22rem;
  top: 50%;
  right: 0;
  margin-top: -0.11rem;
  border: 1px solid #FF4A7D;
  color: #FF4A7D;
  font-size: 0.12rem;
  border-radius: 37px;
}

.containerPadding{
  width: 100%;
  height:0.51rem;
}

.top0 {
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 640px;
  z-index: 11;
}

.top0 .top_container {
  font-size: 16px;
  color: #333;
  background-color: rgba(250,250,250,0.95);
  text-align: center;
  position: relative;
}
.top0 .top_container:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  background: #f0f0f0;
  width: 100%;
  height: 1px;
}
/*Retina屏为2的时候调用下面的样式*/
@media
only screen and (-webkit-min-device-pixel-ratio:2),
only screen and (min-device-pixel-ratio:2),
only screen and (min--moz-device-pixel-ratio:2),
only screen and (-o-min-device-pixel-ratio:4/2),
only screen and (min-resolution:2dppx)
{
    .top0 .top_container:after{
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
    }
}
.top0 .top_left {
    position: absolute;
    top: 0;
    left: 0;
}

.top0 .top_back {
    width: 40px;
    height: 44px;
    float: left;
}

.top0 .home_arrow {
  margin-top: 15px;
  margin-left: 10px;
  display: inline-block;
  vertical-align: 0;
  width: 12px;
  height: 12px;
  border-left: 1px solid #333;
  border-bottom: 1px solid #333;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}

.top0 .title_container {
    margin-left: 80px;
    margin-right: 80px;
    font-size: 16px;
    height: 44px;
    line-height: 44px;
    box-sizing: content-box;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: #333;
}

.top0 .top_right {
    position: absolute;
    right: 0;
    top: 0;
}

.top0 .top_share {
    width: 40px;
    height: 44px;
    float: right;
    display: none;
}

.top0 .top_share .icon {
    width: 22px;
    height: 21px;
    background-image: url(//pic.davdian.com/free/share_icon_2x.png);
    background-size: 100%;
    display: block;
    margin-top: 9px;
    margin-left: 9px;
}

.top0 .top_home {
    width: 40px;
    height: 44px;
    float: right;
}

.top0 .top_home .home_icon {
    width: 20px;
    height: 20px;
    background: url(//pic.davdian.com/free/home_icon_0825.png) no-repeat center;
    background-size: 100%;
    display: block;
    margin-top: 12px;
    margin-left: 10px;
}

.top0.top_hide {
    animation: top_hide_animation 0.2s forwards;
    -webkit-animation: top_hide_animation 0.2s forwards;
}
.summary {
    padding: 15px;
    background: #fff;
}

/*dvk4 style*/

.dvk4_container{
  width: 100%;
  /*height: 3.65rem;*/
  background: #fff;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
}

.dvk4_title{
  width: 100%;
  height: 0.5rem;
  border-bottom: 0.005rem solid #E1E1E1;
  position: relative;
}

.dvk4_title_now{
  width: 1.86rem;
  height: 0.3rem;
  margin-top: 0.1rem;
  line-height: 0.3rem;
  text-align: center;
  border-right: 0.005rem solid #E1E1E1;
  display: block;
  float: left;
  position: relative;
}
.dvk4_title_bottom{
  position: absolute;
  top: 0.5rem;
  width: 1rem;
  left: 0.44rem;
  border-bottom: 1px solid #FF4A7D;
}
    .dvk4_title_bottom1{
        position: absolute;
        top: 0.5rem;
        width: 1rem;
        left: 2.3rem;
        border-bottom: 1px solid #FF4A7D;
    }
    .dvk4_title_tomorrow{
        width: 1.87rem;
        height: 0.3rem;
        margin-top: 0.1rem;
        line-height: 0.3rem;
        text-align: center;
        display: block;
        float: left;
        position: relative;
    }
    .active{
        color: #FF4A7D;
    }
    .dvk4_content{
        /*height: 3rem;*/
        width: 3.55rem;
        margin-left: 0.1rem;
    }
    .border{
        border-top: 1px solid #E1E1E1;
    }
    .dvk4_detail{
        width: 100%;
        /*height: 0.5rem;*/
        padding-top: 0.1rem;
        padding-bottom: 0.1rem;
        border-bottom: 0.5px solid #E1E1E1;
    }
    .dvk4_detail:last-child{
        border-bottom: 0px;
    }
    .dvk4_detail_content{
        width: 100%;
        position: relative;
        /*height: 0.5rem;*/
    }
    .dvk4_detail_content_img{
        width: 1.26rem;
        height: 0.88rem;
        display: inline-block;
        vertical-align: top;
        position: relative;
    }
    .dvk4_detail_content_text{
        display: inline-block;
        vertical-align: top;
        width: 2.45rem;
        /*height: 0.5rem;*/
        margin-left:0.06rem;
        position: relative;
    }
    .dvk4_detail_content_title{
        color: #333333;
        /*height: 0.39rem;*/
        margin-bottom: 0.03rem;
        font-size: 0.14rem;
        line-height: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        display: -webkit-box;
    }
    .title_leftBorder{
        display: inline-block;
        height: 0.1rem;
        border-left: 2px solid #FF4A7D;
    }
    .dvk4_detail_content_name{
        color: #999999;
        font-size: 0.12rem;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        display: -webkit-box;
        position: relative;
    }
    .dvk4_detail_content_name_img{
        position: absolute;
        right: 0;
        top: 0.4rem;
        width: 0.64rem;
    }
    .dvk4_detail_content_time{
        font-size: 0.12rem;
        color: #999999;
        height: 0.17rem;
        width: 100%;
        /*margin-top: 0.14rem;*/
        position: absolute;
        bottom: 0.02rem;
    }
    .dvk4_detail_content_times{
        float: left;
        width: 1.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        display: -webkit-box;
    }
    .dvk4_detail_content_popular{
        float: right;
    }
    .popular_color{
        color: #FF4A7D;
    }
    .dvk4_money{
        position: absolute;
        top: 0.05rem;
        left: 0.05rem;
        padding-left: 0.03rem;
        padding-right: 0.03rem;
        height: 0.18rem;
        line-height: 0.2rem;
        text-align: center;
        color: #fff;
        font-size: 0.11rem;
        background: #FF4A7D;
    }
    .circle{
        background-color: #92FDE0;
        display: inline-block;
        margin-right: 5px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
    .newImage {
        object-fit: cover;
        object-position: center;
        display: inline;
        border: none;
        width: 100%;
    }
    /*series*/
    .seriesImgTop{
        width: 100%;
        height: 44px;
    }
    .seriesImg{
        width: 100%;
    }
    .seriesImgTitle{
        padding-left: 15px;
        padding-right: 15px;
        color: #333333;
        font-size: 0.14rem;
        padding-top: 10px;
        padding-bottom: 15px;
        background: #fff;
    }
    .seriesImgPrice{
        padding-left: 15px;
        padding-right: 15px;
        color: #FF4A7D;
        font-size: 0.18rem;
        background: #fff;
    }
    .seriesImg img{
        width: 100%;
    }
    .seriesBtn{
        position: fixed;
        bottom: 0;
        width: 100%;
        max-width: 640px;
        height: 0.5rem;
        border-top: 1px solid #eee;
    }
    .btn{
        width: 50%;
           height: 100%;
        float: left;
        color: #fff;
    }
    .btn_span{
        display: inline-block;
        width: 100%;
        height: 100%;
        line-height: 0.5rem;
        /*color: #fff;*/
        text-align: center;
        font-size: 0.14rem;
    }
    /*.btn span{
        display: inline-block;
        width: 100%;
        height: 100%;
        line-height: 0.5rem;
        color: #fff;
        text-align: center;
        font-size: 0.14rem;
    }*/
    .btn1{
        /*background: -webkit-linear-gradient(left, #FFB21A, #FF7C31);*/
        background: #F9F7F8;
        color: #666;
    }
    .btn1 img{
        width: 0.13rem;
        margin-bottom: 0.01rem;
    }
    .btn2{
        background: -webkit-linear-gradient(left, #FF5B5B, #FA1862);
    }
    .btn3{
        background: -webkit-linear-gradient(left, #C1C1C1, #999999);
    }
    .shareToastMark{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 10;
        background: #000;
        opacity: 0.6;
    }
    .shareToast{
        width: 2.7rem;
        height: 1.65rem;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin:auto;
        border-radius: 0.12rem;
        z-index: 13;
        background: #fff;
    }
    .shareToastTitle{
        width: 100%;
        border-bottom: 1px solid #4D4D4D;
        color: #030303;
        box-sizing: border-box;
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
        padding-left: 0.36rem;
        padding-right: 0.36rem;
        font-size: 0.14rem;
        line-height: 140%;
    }
    .shareToastTitle1{
        width: 100%;
        border-bottom: 1px solid #eee;
        color: #030303;
        box-sizing: border-box;
        padding-top: 0.1rem;
        padding-bottom: 0.1rem;
        padding-left: 0.36rem;
        padding-right: 0.36rem;
        font-size: 0.14rem;
        height: 0.62rem;
    }
    .shareToastBtn{
        width: 100%;
        height: 0.5rem;
        line-height: 0.5rem;
        color: #0076FF;
        text-align: center;
    }
    /*delete*/
    .delete_img{
        margin-top: 0.8rem;
        margin-left: 1.3rem;
        width: 1.2rem;
    }
    .delete_content{
        margin: 0.3rem auto;
        width: 1.7rem;
        /*background: #FF4A7D;*/
        color: #666666;
        font-size: 0.14rem;
        text-align: center;
        opacity: 0.8;
        border-radius: 4px;
        padding-top: 0.03rem;
        padding-bottom: 0.03rem;
    }
    .delete_content span{
        display: inline-block;
    }
    .delete_btn{
        margin: 0.2rem auto;
        color:#333333;
        width: 1.6rem;
        height: 0.33rem;
        border:1px solid #999999;
        border-radius: 4px;
        text-align: center;
        line-height: 0.33rem;
    }
    .shareToastNew{
        height: 1.4rem;
    }
    .shareToastNewTitle{
        width: 100%;
        font-size: 0.18rem;
        margin-top: 0.14rem;
        color: #030303;
        text-align: center;
    }
    .marginTopStyle{
        margin-top: 0;
    }
    .btn_left{
        width: 1.6rem;
    }
    .btn_right{
        width: 2.15rem;
    }
    .growthBox{
      width: 100%;
    }
    .noApply{
        text-align: center;
        img{
            width: 1.2rem;
            margin-top: 1rem;
        }
        p{
            color: #666;
            margin-top: 0.3rem;
            text-align: center;
        }
        span{
            display: inline-block;
            height: 66px;
            line-height: 66px;
            width: 280px;
            border: 1px solid #999999;
            border-radius: 200px;
            color: #333333;
            text-align: center;
            margin-top: 0.1rem;
            font-size:24px;
            -webkit-transform: scale(0.5);
        }
    }
</style>
