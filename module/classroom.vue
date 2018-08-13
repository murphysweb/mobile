<template lang="html">
    <v-school-title :rightshow="true" :data='title'></v-school-title>
    <div class="classroom-container">
        <!--点击评论列表和x消失  当评论为开时点击弹框唤起commonList-->
        <div class="mask" v-if="commonShow">
          <div class='mask_con_mask' @click="close_comment"></div>
          <div class="mask_con" @click="keyBoard($event)" :style="{'height':videoClass ? '44%' : '73%'}">
            <!--关闭按钮-->
            <div class="close" style="margin-left: 0;z-index: 4;" @click="close_comment">
              <img src="//9i.dvmama.com/free/2016/12/22/60_80_543e7ae3b77c0ce52ebeee2a210dbdf6.png" alt="">
            </div>
            <!--弹出层列表-->
            <div class="common" id="common" style="z-index:4;">
              <div class="scrollcon">
                <div class="commonList-container">
                  <div class="end" v-if="refreshtxt">拉取更多</div>
                  <div class="class_introduce_con" v-for="(index,common) in commonList">
                    <div class="comment_tit">
                      <img class="img" :src="common.speaker.avatar || defaultAvatar" alt="">
                      <div class="comment_dis">
                        <span class="commentname">{{decodeURIComponent(common.speaker.name)}}</span>
                        <span  v-if="new Date()-common.msg.time < 60*60*12*1000">{{getTime(parseInt(common.msg.time))}}</span>
                        <span  v-if="new Date()-common.msg.time >= 60*60*12*1000">{{getFullTime(parseInt(common.msg.time))}}</span>
                      </div>
                    </div>
                    <div class="class_introduce_text">
                      <p>{{decodeURIComponent(common.msg.content)}}</p>
                      <!-- <p>：：：：：：：：{{common.uuid}}</p> -->
                    </div>
                  </div>
                  <div class="commonbottom"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <!--fiexd定位的弹幕-->
          <div class="flexd-box">
            <div v-if="commonflag && discussStatus" class="flexd" @click="open_comment" :style="{'top':videoClass?'335px':'auto'}">
              <div class="common_position"  v-if='commonList[commonList.length-2].msg.content'>
                <span class="common_box" v-text='decodeURIComponent(commonList[commonList.length-2].msg.content)'></span>
                <img :src="commonList[commonList.length-2].speaker.avatar || defaultAvatar">
              </div>
            </div>
            <div v-if="commonflag && discussStatus && !videoClass" class="flexd" @click="open_comment" :style="{'top':videoClass?'380px':'120px'}">
              <div class="common_position" v-if='commonList[commonList.length-1].msg.content'>
                <span class="common_box" v-text='decodeURIComponent(commonList[commonList.length-1].msg.content)'></span>
                <img :src="commonList[commonList.length-1].speaker.avatar || defaultAvatar">
              </div>
            </div>
          </div>
          <!--开关按钮-->
          <div v-if="commonflag && discussStatus" class="flag" :style="{'top':videoClass?'300px':'159px'}">
            <span @click="switchflag" >关</span>
          </div>
          <div v-if="!commonflag && discussStatus" class="flag" :style="{'top':videoClass?'300px':'159px'}">
            <span @click="switchflag">开</span>
          </div>
          <div  class="commen_num" :style="{'top':videoClass?'303px':'162px'}"><span>加入讨论：{{total}}</span></div>
          <!--我的邀请卡-->
          <div class="callshare_container" v-if="!isSupervisorClass">
            <span class="callshare" @click="shareMyCard" :style="{'marginTop':videoClass?'380px':'153px'}">我的邀请卡</span>
          </div>
        </div>
        <!--倒计时-->
        <div class="countdown" v-if='timeShow != 0'>
            <!-- 未开始 -->
            <div class="counttop" v-if='timeShow == 1'>
                <span v-if='rage.startTimestamp'>课程将于&nbsp;{{new Date(rage.startTimestamp * 1000).getFullYear()}}年{{new Date(rage.startTimestamp * 1000).getMonth() + 1}}月{{new Date(rage.startTimestamp * 1000).getDate()}}日{{timeStart[0]}}&nbsp;:&nbsp;{{timeStart[1]}}开始</span>
                <i v-if="!isSupervisorClass">{{rage.pv}}人气</i>
            </div>
            <!-- 已开始 -->
            <div class="counttop" v-if='timeShow == 2'>
                <span v-if='rage.startTimestamp'>直播开始:{{getFullTimeString(countdown[1])}}:{{getFullTimeString(countdown[2])}}:{{getFullTimeString(countdown[3])}}</span>
                <i v-if="!isSupervisorClass">{{rage.pv}}人气</i>
            </div>
            <!-- 已结束 -->
            <div class="counttop" v-if='timeShow == 3'>
                <span v-if='rage.startTimestamp'>开始时间：{{new Date(rage.startTimestamp * 1000).getFullYear()}}年{{new Date(rage.startTimestamp * 1000).getMonth() + 1}}月{{new Date(rage.startTimestamp * 1000).getDate()}}日{{timeStart[0]}}:{{timeStart[1]}}</span>
                <i v-if="!isSupervisorClass">{{rage.pv}}人气</i>
            </div>
        </div>
        <!--scroll-->
        <div class="section" id="scroll_container" :style="{'marginTop':videoClass?'241px':'30px','marginBottom':'1rem'}">
          <section>
                <!--上拉加载-->
                <div class="getmore" v-if="getMoreBarrage" style="height:60px;text-align: center;line-height: 60px;">加载更多...</div>
                <!--share card-->
                <!--课程结束倒计时和分享卡消失v-if="countdownflag"-->
                <div class="share_card" v-if="!isSupervisorClass">
                <!--<div class="share_card" v-if="true">-->
                    <!--分享tit-->
                    <div class="share_tit">
                        <div class="share_text">分享人气榜</div>
                    </div>
                    <!--分享排名-->
                    <a href="javascript:void(0);">
                        <ul class="rank" @click='rankHref'>
                            <li @click="updata" v-if="shareList[0]">
                                <img src="//9i.dvmama.com/free/2016/12/21/52_32_93c7d955bd0a5cb17bb284cfbf4c20f0.png" alt="">
                                <p>1. {{shareList[0].content}}</p>
                            </li>
                            <li @click="updata" v-if="shareList[1]">
                                <img src="//9i.dvmama.com/free/2016/12/21/52_32_fcb5facd49f1ac8461fd5cfcecb2ac78.png" alt="">
                                <p>2. {{shareList[1].content}}</p>
                            </li>

                            <li @click="updata" v-if="shareList[2]">
                                <img src="//9i.dvmama.com/free/2016/12/21/52_32_9d655fa16667b1ac10274e4c2f09c10b.png" alt="">
                                <p>3. {{shareList[2].content}}</p>
                            </li>
                        </ul>
                    </a>
                    <!-- 没人分享 -->
                    <div class="ui-tip-text" v-if="shareList.length === 0">马上分享邀请卡,占领榜单吧!</div>
                    <!--分享卡按钮-->
                    <div class="mycard" @click="shareMyCard">
                        <span>我的邀请卡</span>
                    </div>
                </div>
                <!--common对话-->
                <div class="commonroom">
                    <ul id="ulList" @click="keyBoard($event)">
                        <audio preload="auto" class='allAudio'></audio>
                        <li v-if="common.speaker.name" v-for="(index,common) in barrageList" track-by="$index" msg_id="{{decodeURIComponent(common.speake.name)}}">
                            <div class="timebox" v-if='index == 0 || (common.msg.time - barrageList[index - 1].msg.time) > 5*60*1000'>
                                <span class="talk_time"  v-if="new Date()-common.msg.time < 60*60*12*1000">{{getTime(parseInt(common.msg.time))}}</span>
                                <span class="talk_time"  v-if="new Date()-common.msg.time >= 60*60*12*1000">{{getFullTime(parseInt(common.msg.time))}}</span>
                            </div>
                            <span class="head">
                                <img :src="common.speaker.avatar || defaultAvatar">
                            </span>
                            <div class="right">
                                <h2>{{decodeURIComponent(common.speaker.name)}}</h2>
                                <!--text类型的信息-->
                                <div  v-if="common.msg.type==0" class='main' :class="{'blue':common.is_answer}" @click='setflag(index)'>
                                    <i class='main_picBox_icon2'></i>
                                    <span class='TextMessageSpan formfield' v-html='hrefLink(common.msg.content)'>
                                    </span>
                                </div>
                                <!--语音类型的信息-->
                                <div class="audiomain" @click="playVoiceFlag(index)" v-if="common.msg.type==2||common.msg.type==91" :class="{'replied':common.replied}">
                                    <div class="voice"  :class="{ 'play': isPlay[index], 'noPlay': !isPlay[index] }">
                                        <i class="fa fa-rss" v-if="common.msg.duration>0"></i>
                                        <p :style="{width:(common.msg.voicewidth + 40)+'px'}" class="main">{{common.msg.duration}}''</p>
                                        <i class='curcle-full' v-if='!curcleFullHash[common.uuid] && !common.msg.curcleFullHash'></i>
                                    </div>
                                    <div class='audio' :data-src="common.msg.url" preload="auto" :data-type=1 :data-index="index" v-if="common.msg.type==2"></div>
                                    <div class='audio' :data-src="common.msg.url" preload="auto" :data-type=91 :data-index="index" v-if="common.msg.type==91"></div>
                                </div>
                                <!--图片类型的信息-->
                                <div v-if="common.msg.type==1" class="mainPic">
                                    <div class="picBox">
                                        <div class='picBox_icon1_container'>
                                            <i class='picBox_icon1'></i>
                                            <i class='picBox_icon2'></i>
                                            <img :src="common.msg.url" alt="">
                                        </div>
                                        <!-- <i class='picBox_icon'></i> -->
                                        <img :src="common.msg.url" alt="">
                                    </div>
                                    <div class="picBox_container" @click='previewImage(common.uuid)'>
                                        <img :style="getImageStyle(common)" :src="common.msg.url" alt="">
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="teacherDownMore" v-if="teacherDownMore" style="height:40px; text-align: center;line-height: 40px;">获取更多信息</div>
                    <div class="bottom"></div>
                </div>
            </section>

        </div>
        <div class="bottominput" :style="{'bottom':openFlag?'0':'0.54rem'}">
            <div class="text_talk">
                <input v-if="discussStatus" class='text_talk_input' v-model.trim="sentmassagetext" type="text" placeholder="向讲师提问或参与讨论">
                <input v-if="!discussStatus" type="text" placeholder="评论关闭" disabled>
            </div>
            <div class="send" @click="sentMessage">
                <span>发送</span>
            </div>
        </div>
        <div class="bottom-text">
          <div class="small-btn1">打开APP听课更流畅</div>
          <div class="small-btn2" @click="openApp">打开</div>
          <div class="small-btn3" @click="downLoad">下载</div>
        </div>
        <div class='firstPlayAudioBtn' v-if='firstPlayAudioBtn && barrageList[0]'>
            <span class='firstPlatAudioBtnClose' @click='firstPlayAudioBtnClose'>
                <img src="//9i.dvmama.com/free/2017/07/15/clearInput.png">
            </span>
            <span class='firstPlatAudioBtnText' @click="startFirstVideo(0,1)">点我从第一条语音开始听</span>
        </div>
        <div class='upAndDown' v-if='upAndDown'>
            <div class='upAndDown1' @click="startFirstVideo(-1,1)"></div>
            <div class='upAndDown1' @click="startFirstVideo(1,0)"></div>
        </div>
        <div class="maskAlertMask" v-if='maskAlertBtn'></div>
        <div class='maskAlert' v-if='maskAlertBtn'>
            <img src="//9i.dvmama.com/free/2017/07/17/maskAlertImg.png" class='maskAlertImg'>
            <p class='maskAlertText' v-if='rage.startTimestamp'>课程将于{{new Date(rage.startTimestamp * 1000).getFullYear()}}年{{new Date(rage.startTimestamp * 1000).getMonth() + 1}}月{{new Date(rage.startTimestamp * 1000).getDate()}}日&nbsp;&nbsp;{{timeStart[0]}}:{{timeStart[1]}}准时开始
请耐心等待</p>
            <p class='maskAlertBtn' @click='maskAlertBtnClick'>好</p>
        </div>
    </div>
    <invite-card :show="cardShow" :id="courseId" statistics="4" v-on:close="closeCard" kind="0"></invite-card>
    <div class="class-video" v-if="videoClass && isStart()" v-html="videoHTML" @touchstart="showVideo">
      <!--<video class="video-text" controlsList="nodownload" controls="controls">-->
      <!--<source :src="videoHTML" type="video/mp4"/>-->
      <!--你的浏览器不支持H5播放器-->
      <!--</video>-->
    </div>
    <div class="class-video" v-if="videoClass && !isStart()" :style="{'background-image': 'url(' + videoCover + ')','background-repeat':'no-repeat','background-position':'center center','background-size': '100% 100%' ,'background-size': 'cover'}"></div>
</template>
<style type="text/css" lang="sass" lang="scss">
    .bottom-text{
      position:fixed;
      bottom:0;
      left: 0;
      width: 100%;
      height: 0.54rem;
      text-align: center;
      line-height: 0.54rem;
      color:#FFFFFF;
      font-size: 0;
      background: rgba(0,0,0,0.7);
      div{
        height: 0.3rem;
        font-size: 0.14rem;
        display: inline-block;
        vertical-align: middle;
        line-height: 0.3rem;
        text-align: center;
      }
      .small-btn1{
        margin-left: 0.37rem;
      }
      .small-btn2{
        width: 0.66rem;
        margin-left: 0.2rem;
        color:#FF4A7D;
        background: #ffffff;
        border-radius:0.15rem;
      }
      .small-btn3{
        width: 0.66rem;
        margin-left: 0.2rem;
        background: #FF4A7D;
        color:#ffffff;
        border-radius:0.15rem;
      }
    }
    .class-video{
      width: 100%;
      height: 211px;
      position: fixed;
      /*background: rgba(0, 0, 0, 0.7);*/
      top: 74px;
      .video-text{
        width: 3.75rem;
        max-height: 211px;
      }
    }
    .curcle-full{
        display: inline-block;
        width: 5px;
        height: 5px;
        background: #FF4A7D;
        border-radius: 50%;
        vertical-align: top;
        margin-top: 5px;
    }
    #ulList li .right{
        position: relative;
    }
    .ulList_recall{
        position: absolute;
        background: #000;
        width: 62px;
        height: 35px;
        top: -55px;
        left: 0;
        color: #fff;
        text-align: center;
        line-height: 35px;
        border-radius: 7px;
    }
    .ulList_recall_angle{
        position: absolute;
        top: -21px;
        left: 21px;
        border-right: 10px solid transparent;
        border-left: 10px solid transparent;
        border-top: 10px solid #000;
    }
    .ulList_recall_content{
        display: none;
    }
    .TextMessageSpan{
        -webkit-user-select: text;
        user-select: text;
    }
    .mask_con_mask{
        position: absolute;
        top: 0;
        width: 100%;
        height: 160px;
        z-index: 100;
    }
    #scroll_container{
        position: relative;
        top:0;
    }
    .firstPlayAudioBtn{
        position: fixed;
        bottom: 60px;
        width: 2rem;
        height: 0.3rem;
        line-height: 0.3rem;
        left: 50%;
        margin-left: -1rem;
        background: #000000;
        text-align: center;
        border-radius: 53px;
        color: #fff;
        opacity: 0.6;
    }
    .firstPlatAudioBtnClose{
        position: fixed;
        bottom: 61px;
        width: 0.15rem;
        display: inline-block;
        height: 0.3rem;
        vertical-align: top;
        left: 1rem;
    }
    .firstPlatAudioBtnText{
        display: inline-block;
        height: 0.3rem;
        vertical-align: top;
        position: fixed;
        bottom: 60px;
        left: 1.24rem;
        font-size: 0.14rem;
    }
    .upAndDown{
        background: url('//9i.dvmama.com/free/2017/07/17/upAndDown.png') no-repeat;
        background-size: 100% 100%;
        width: 35px;
        height: 76px;
        position: fixed;
        bottom: 100px;
        right: 10px;
    }
    .upAndDown1{
        width: 35px;
        height: 38px;
    }
    .maskAlertMask{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: #000;
        opacity: 0.51;
        z-index: 200;
    }
    .maskAlert{
        width: 2.7rem;
        height: 2.12rem;
        background: #fff;
        position:fixed;
        left: 50%;
        top: 50%;
        margin-left: -1.35rem;
        margin-top: -1.06rem;
        text-align: center;
        z-index: 201;
    }
    .maskAlertImg{
        width: 0.8rem;
        margin-top:0.21rem;
    }
    .maskAlertText{
        margin-top: 0.12rem;
        color: #666666;
        font-size: 0.14rem;
        padding-left: 0.05rem;
        padding-right: 0.05rem;
    }
    .maskAlertBtn{
        position: absolute;
        width: 100%;
        bottom: 0;
        height: 0.44rem;
        line-height: 0.44rem;
        border-top: 1px solid #E1E1E1;
        color:#FF4A7D;
        font-size: 0.16rem;
    }
</style>

<script>
/*global IScroll:true wx:true RongIMClient:true RongIMLib:true bravetime:true*/
import Vue from 'vue';
import vSchoolTitle from '../module/vSchoolTitle.vue';
import inviteCard from '../module/inviteCard/inviteCard.vue';
import common from './common/common.es6';
import api from '../utils/api.es6';
import login from '../src/common/js/module/login.js';
import scriptjs from "scriptjs"
import ua from "dvd-base-js-ua"
import share from "dvd-service-js-share"
let log = function() {};
common.initShare(17);
export default {
  data() {
    return {
      userId: login.getUserId(),

      playIndexFlag: null,
      sentMessageFlag: true,
      title: '',
      total: 0,
      teacherId: '',
      timeStart: [],
      ryList: [],
      ryflag: true,
      ryflag1: true,
      upRyFlag: true,
      rankUrl: '',
      scrollTop: 0,
      voiceWidth: [],
      refreshtxt: false,
      sentmassagetext: '',
      rage: {},
      shareList: [],
      barrageList: [], // 主播数据
      shareTopList: [], // 弹幕数据
      countdownflag: false, // 倒计时显示开关
      commonList: [], // commentList的数据
      commonflag: true, // 评论开关
      countdown: [0, 0, 0, 0], // 倒计时初始值
      commonShow: false, // commonList开关
      flagOn: true,
      callshare: false,
      flag: true,
      commonScroll: null,
      discussStatus: 1,
      getmoreflag: true,
      getMoreBarrage: false,
      isPlay: [],
      myScroll: null,
      cardShow: false,
      teacherDownMore: false,
      courseId: window.courseId,
      myName: '路人', //用户名
      myAvatar: '', // 头像
      defaultAvatar:
        '//9i.dvmama.com/free/2016/12/30/160_160_b879eb6581e8b159e0d35fe485011db3.png',
      video_live_commonchatRoomId: '',
      video_live_teacherchatRoomId: '',
      commonListUrl: '/api/mg/content/course/message_list',
      teacherListUrl: '/api/mg/content/course/message_list',
      baseUrl: '/api/mg/content/course/room_info',
      more: 1,
      role: 1,
      AjaxTime: 1,
      userid: 0,
      blurFlag: true,
      tempHash: {},
      curcleFullHash: {},
      firstPlayAudioBtn: false,
      upAndDown: false,
      maskAlertBtn: false,
      timeShow: 0,

      lastCount: 0,
      count: null,

      videoClass:false,
      videoHTML:"",
      videoUrl:'',
      videoCover:"",
      startTimestamp:0,

      openFlag:false,
      isSupervisorClass:false,
      ua:ua
    };
  },
  created() {

    // 控制课程详情页面隐藏底部提示功能
    let clickClose = localStorage.getItem('clickClose');
    if(clickClose === 'true'){
      localStorage.setItem('clickClose',false);
    }
  },
  mounted(){

  },
  ready: function() {
    var that = this,
      classroomContainerHeight;

    this.initFeferInterval();

    $(window).resize(function() {});
    IScroll.utils.preventDefaultException = function() {
      return true;
    };
    $('.text_talk_input').bind('focus', function() {
      classroomContainerHeight = $('.classroom-container').height();
      $('.classroom-container').height($('body').height() + 'px');
      setTimeout(function() {
        that.myScroll.refresh();
      }, 500);
    });

    $('.text_talk_input').bind('blur', function() {
      if (that.blurFlag) {
        $('.classroom-container').height('auto');
        $('.classroom-container').height(classroomContainerHeight + 'px');
      }
    });
    //初始化已读未读
    if (localStorage.getItem('curcleFullHash')) {
      this.curcleFullHash = JSON.parse(localStorage.getItem('curcleFullHash'));
    }
    setInterval(function() {
      if (that.myScroll) {
        that.myScroll.refresh();
      }
      if (that.commonScroll) {
        that.commonScroll.refresh();
      }
    }, 1000);
    this.init();
    this.iScrollInit();
  },
  methods: {
    showVideo(e){
      e.preventDefault()
    },
    openApp(){
        window.location.href="/m/supervisorClass.html?courseId="+window.courseId;
    },
    downLoad(){
      if(ua.isAndroid()){
        window.location.href="http://sj.qq.com/myapp/detail.htm?apkName=com.davdian.seller";
      }else if(ua.isIos()){
        window.bravetime.newConfirm("确认打开大V店APP直播间?",{
          okText:"打开",
          okLink:window.bravetime.callAppLive ,//点击去下载的链接
          cancelText:"取消"
        });
      }
    },
    isStart(){
        if(new Date().getTime().toString().substr(0,10) > this.startTimestamp.toString().substr(0,10)) return true;
        return false;
    },
    initFeferInterval() {
      var that = this;
      setInterval(function() {
        that.referStatistics();
      }, 300000);
    },
    referStatistics() {
      var arr = [],
        p,
        obj,
        count = this.count,
        nowCount = arr.length,
        lastCount = this.lastCount,
        that = this,
        local = JSON.parse(localStorage.getItem('curcleFullHash'));
      for (p in local) {
        if (p.toString().indexOf(that.userId) !== -1) {
          arr.push(p);
        }
      }

      if (nowCount > lastCount && nowCount > count) {
        console.log('当前', arr.length);
        console.log('上一次', this.lastCount);
        console.log('下发', this.count);
        obj = {
          courseId: window.courseId,
          num: nowCount
        };
        api('/api/mg/content/course/message_statistics', obj)
          .then(function(result) {
            if (result.code === 0) {
              //更新lastCount
              that.lastCount = nowCount;
            } else {
              console.log('code:' + result.code);
            }
          })
          .catch(function(e) {
            console.log(e);
          });
      }
    },
    maskAlertBtnClick: function() {
      this.maskAlertBtn = false;
    },
    firstPlayAudioBtnClose: function() {
      this.firstPlayAudioBtn = false;
    },
    hrefLink: function(content) {
      let text = decodeURIComponent(content);
      return text.replace(
        /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&amp;:/~+#]*[\w\-@?^=%&amp;/~+#])?/g,
        function(d) {
          return '<a style="color: blue;" href="' + d + '">' + d + '</a >';
        }
      );
    },
    setflag: function() {
      localStorage.setItem('setflag', '1');
    },
    getImage: function(w, h) {
      var width, height;
      if (w - h > 0) {
        if (w > 230) {
          width = '230px';
          height = 230 * (h / w) + 'px';
        }
      } else {
        if (h > 230) {
          height = '230px';
          width = 230 * (w / h) + 'px';
        }
      }
      return {
        width: width,
        height: height
      };
    },
    getImageStyle: function(item) {
      var obj, o;
      if (item.imageInfo) {
        obj = item.imageInfo;
        o = this.getImage(item.imageInfo.width, item.imageInfo.height);
        return o;
      } else {
        try {
          obj = JSON.parse(JSON.parse(JSON.parse(item.allMsg).content).extra)
            .info.imageInfo;
          o = this.getImage(obj.width, obj.height);
          return o;
        } catch (e) {
          return {};
        }
      }
    },
    copy: function() {
      // alert(index)
      // setTimeout(function(){
      //     $('#ulList li').eq(index).find('.ulList_recall_content').css('display','none')
      // },200)
      // console.log(index)
    },
    longTap: function() {
      // var that = this
      // if (this.JqFlag){
      //     setTimeout(function(){
      //         that.JqFlag = false
      //     },500)
      //     this.JqFlagIndex = index
      //     $('#ulList li').eq(index).find('.ulList_recall_content').css('display','block')
      // } else {
      //     $('#ulList li').eq(this.JqFlagIndex).find('.ulList_recall_content').css('display','none')
      //     setTimeout(function(){
      //         that.JqFlag = true
      //     },500)
      // }
    },
    keyBoard: function() {
      var that = this;
      that.blurFlag = false;
      $('.text_talk_input').blur();
      setTimeout(function() {
        that.blurFlag = true;
      }, 300);
    },
    iScrollInit: function() {
      let that = this;
      that.myScroll = new IScroll('#scroll_container', {
        click: true,
        mouseWheel: true,
        probeType: 3
      });

      setTimeout(function() {
        that.myScroll.refresh();
      }, 500);
      if (that.commonShow) {
        that.commonScroll = new IScroll('#common', {
          click: true,
          mouseWheel: true,
          probeType: 3
        });
        setTimeout(function() {
          that.commonScroll.refresh();
        }, 500);
      }
    },
    initRongyun() {
      let that = this;

      //融云配置
      var it = 'n19jmcy59zr29',
        tokenurl = '/api/live/getToken?format=json',
        status = 1;
      if (location.href.indexOf('davdian.com') > -1) {
        it = 'bmdehs6pd42ks';
      }

      that.ryContent(
        it,
        tokenurl,
        status,
        that.video_live_teacherchatRoomId,
        that.video_live_commonchatRoomId
      );
    },
    previewImage: function(uuid) {
      var previewImageList = [],
        img = '';
      for (let i = 0; i < this.barrageList.length; i++) {
        if (this.barrageList[i].msg && this.barrageList[i].msg.type === 1) {
          previewImageList.push(this.barrageList[i].msg.url);
        }
        if (
          uuid === this.barrageList[i].uuid &&
          this.barrageList[i].msg &&
          this.barrageList[i].msg.url
        ) {
          img = this.barrageList[i].msg.url;
        }
      }
      wx.previewImage({
        current: img,
        urls: previewImageList
      });
    },
    ryContent: function(it, tokenurl, status, roomId1, roomId2) {
      var that = this,
        sess_key;
      // ref参数有为1即true 否则为false
      function loadRongIMClient(ref) {
        var data = { refresh: ref ? 1 : 0 };
        if (sess_key !== undefined) {
          data.sess_key = sess_key;
        }
        common.getDataWithSign({
          updata: data,
          keyName: 'token_' + Date.now(),
          url: tokenurl,
          success: function(result) {
            var token;
            log('token->>', result);
            if (result.code === 0) {
              token = result.data.token;
              that.myName = result.data.username;
              that.userid = result.data.userid;
              if (result.data && result.data.headImage) {
                that.myAvatar = result.data.headImage;
              }
              if (sess_key === undefined) {
                // 种cookie
                $.cookie('sess_key', result.sess_key);
              }
              RongIMClient.setConnectionStatusListener({
                onChanged: function(resStatus) {
                  switch (resStatus) {
                    //链接成功
                    case RongIMLib.ConnectionStatus.CONNECTED:
                      log('连接成功');
                      break;
                    //正在链接
                    case RongIMLib.ConnectionStatus.CONNECTING:
                      log('正在连接');
                      break;
                    //重新链接
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                      bravetime.newAlert('消息获取失败，请重试', function() {
                        window.location = window.location.href;
                      });
                      break;
                    //其他设备登陆
                    case RongIMLib.ConnectionStatus
                      .KICKED_OFFLINE_BY_OTHER_CLIENT:
                      log('其他');
                      //调起弹框 提示在其他设备登陆了
                      bravetime.newAlert('您的账号其他设备登陆了', function() {
                        bravetime.goto(
                          common
                            .baseJumpUrl()
                            .courseIntroducePage(that.courseId)
                        );
                      });
                      break;
                    //网络不可用
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                      if (localStorage.getItem('setflag')) {
                        localStorage.removeItem('setflag');
                        window.location = window.location.href;
                      } else {
                        bravetime.newConfirm('消息网络不可用', {
                          okText: '重试',
                          cancelText: '忽略',
                          okLink: function() {
                            window.location = window.location.href;
                          }
                        });
                      }
                      break;
                  }
                }
              });
              // 消息监听器
              RongIMClient.setOnReceiveMessageListener({
                // 接收到的消息
                onReceived: function(message) {
                  var content2,
                    content,
                    time,
                    uuid,
                    user,
                    icon,
                    name,
                    isTel,
                    myphone,
                    base64Str,
                    COURSE_VOICE,
                    extra,
                    tempmsg = {
                      isPlay: false,
                      msg: {
                        content: content2,
                        time: time,
                        type: 0
                      },
                      speaker: {
                        avatar: icon,
                        id: message.senderUserId,
                        name: name
                      },
                      uuid: uuid
                    };
                  if (message.messageType === 'TextMessage') {
                    content2 = message.content.content;
                    content = message.content;
                    time = message.receivedTime;
                    uuid = JSON.parse(message.content.extra).info.uuid;
                    if (message.content.user) {
                      user = message.content.user;
                      icon = user.portrait || user.icon;
                      name = user.name;
                    } else {
                      name = '路人';
                      icon = that.defaultAvatar;
                    }
                    isTel = that.isPhoneNum(name);
                    if (isTel) {
                      myphone = name.substr(3, 4);
                      name = name.replace(myphone, '****');
                    }

                    if (
                      JSON.parse(message.content.extra).info.userAsk === '1'
                    ) {
                      tempmsg.is_answer = true;
                    }
                    if (message.targetId === roomId1) {
                      if (that.ryflag) {
                        if (!that.tempHash[tempmsg.uuid]) {
                          that.ryList.push(tempmsg);
                        }
                      } else {
                        if (!that.tempHash[tempmsg.uuid]) {
                          that.barrageList.push(tempmsg);
                          that.storageRy(
                            'teacherListUrl' + window.courseId,
                            tempmsg
                          );
                        }
                      }
                    } else if (message.targetId === roomId2) {
                      if (!that.tempHash[tempmsg.uuid]) {
                        that.shareTopList.unshift(tempmsg);
                        that.commonList.push(tempmsg);
                        that.total = that.total + 1;
                        that.storageRy(
                          'commonListUrl' + window.courseId,
                          tempmsg
                        );
                      }
                    }
                  } else if (message.messageType === 'ImageMessage') {
                    (base64Str = message.content.content),
                      (content = 'data:image/png;base64,' + base64Str),
                      (time = message.receivedTime),
                      (uuid = JSON.parse(message.content.extra).info.uuid);
                    if (message.content.user) {
                      user = message.content.user;
                      icon = user.portrait || user.icon;
                      name = user.name;
                    } else {
                      name = '临时访客';
                      icon = that.defaultAvatar;
                    }
                    isTel = that.isPhoneNum(name);
                    if (isTel) {
                      myphone = name.substr(3, 4);
                      name = name.replace(myphone, '****');
                    }
                    tempmsg = {
                      isPlay: false,
                      msg: {
                        url: content,
                        time: time,
                        type: 1
                      },
                      speaker: {
                        avatar: icon,
                        id: message.senderUserId,
                        name: name
                      },
                      uuid: uuid,
                      imageInfo: JSON.stringify(
                        JSON.parse(message.content).extra
                      ).info.imageInfo
                    };
                    if (message.targetId === roomId1) {
                      if (that.ryflag) {
                        if (!that.tempHash[tempmsg.uuid]) {
                          that.ryList.push(tempmsg);
                        }
                      } else {
                        if (!that.tempHash[tempmsg.uuid]) {
                          that.barrageList.push(tempmsg);
                          that.storageRy(
                            'teacherListUrl' + window.courseId,
                            tempmsg
                          );
                        }
                      }
                    }
                  } else if (message.messageType === 'VoiceMessage') {
                    // do nothing
                  } else if (message.messageType === 'CommandMessage') {
                    //如果是CommandMessage 判断评论是否关闭
                    if (message.content.name === 'RC_DAV_COURSE_VOICE_TO_H5') {
                      (COURSE_VOICE = JSON.parse(message.content.data.content)),
                        (extra = JSON.parse(COURSE_VOICE.extra)),
                        (name = COURSE_VOICE.user.name),
                        (isTel = that.isPhoneNum(name));
                      if (isTel) {
                        myphone = name.substr(3, 4);
                        name = name.replace(myphone, '****');
                      }
                      tempmsg = {
                        isPlay: false,
                        msg: {
                          url: COURSE_VOICE.content,
                          time: message.receivedTime,
                          type: 91,
                          duration: COURSE_VOICE.duration,
                          voicewidth:
                            (COURSE_VOICE.duration + 65) * 2 > 200
                              ? 200
                              : (COURSE_VOICE.duration + 65) * 2
                        },
                        speaker: {
                          avatar: COURSE_VOICE.user.icon,
                          id: COURSE_VOICE.user.senderUserId,
                          name: name
                        },
                        uuid: extra.info.uuid
                      };
                      if (message.targetId === roomId1) {
                        if (that.ryflag) {
                          if (!that.tempHash[tempmsg.uuid]) {
                            that.ryList.push(tempmsg);
                          }
                        } else {
                          if (!that.tempHash[tempmsg.uuid]) {
                            that.barrageList.push(tempmsg);
                            that.storageRy(
                              'teacherListUrl' + window.courseId,
                              tempmsg
                            );
                          }
                        }
                      }
                    } else if (message.content.name === 'RC_DVK_DELETECLASS') {
                      bravetime.newAlert('课程已经被删除', function() {
                        window.history.go(-1);
                      });
                    } else {
                      if (message.content.data.classInfo.comment === 1) {
                        that.discussStatus = true;
                      } else {
                        that.discussStatus = false;
                      }
                    }
                  }
                  if (
                    message.content &&
                    message.content.extra &&
                    JSON.parse(message.content.extra) &&
                    JSON.parse(message.content.extra).info &&
                    JSON.parse(message.content.extra).info.uuid &&
                    message.messageType !== 'VoiceMessage'
                  ) {
                    that.tempHash[
                      JSON.parse(message.content.extra).info.uuid
                    ] = true;
                  }
                },
                default: function() {
                  bravetime.info('消息加载错误');
                }
              });
              RongIMClient.connect(token, {
                onSuccess: function() {
                  that.joinRoom(that.video_live_teacherchatRoomId, 10);
                  that.joinRoom(that.video_live_commonchatRoomId, 10);
                },
                onTokenIncorrect: function() {
                  if (!ref) {
                    loadRongIMClient(true);
                  }
                },
                onError: function(errorCode) {
                  var info;
                  switch (errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                      info = '超时';
                      break;
                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                      info = '未知错误';
                      break;
                    case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                      info = '不可接受的协议版本';
                      break;
                    case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                      info = 'appkey不正确';
                      break;
                    case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                      info = '服务器不可用';
                      break;
                  }
                  log(errorCode, info);
                }
              });
            } else {
              // code 105
              //todo
              bravetime.newAlert('tokenCode=' + result.code, function() {
                window.location = window.location.href;
              });
            }
          },
          error: function() {}
        });
      }
      if (status === 1) {
        // 融云收取信息
        try {
          RongIMClient.init(it);
          // RongIMLib.RongIMVoice.init();
          RongIMLib.RongIMEmoji.init();
        } catch (e) {
          log(e);
          bravetime.newAlert('实时接口异常，请重试', function() {
            window.location = window.location.href;
          });
        }

        sess_key = common.getDvdsid();

        // 调用
        loadRongIMClient(false);
      }
    },
    storageRy: function(url, obj, method) {
      let met = method || 'push',
        dataTem = JSON.parse(localStorage.getItem(url));
      if (met === 'push' && dataTem && dataTem.data && dataTem.data.dataList) {
        dataTem.data.dataList.push(obj);
      } else if (
        met === 'unshift' &&
        dataTem &&
        dataTem.data &&
        dataTem.data.dataList
      ) {
        dataTem.data.dataList.unshift(obj);
      }
      localStorage.setItem(url, JSON.stringify(dataTem));
    },
    rankHref: function() {
      window.location = this.rankUrl;
    },
    getTime: function(second) {
      var s = new Date(second).getSeconds(),
        m = new Date(second).getMinutes(),
        h = new Date(second).getHours(),
        str;
      if (h) {
        str =
          (h < 10 ? '0' : '') +
          h +
          ':' +
          (m < 10 ? '0' : '') +
          m +
          ':' +
          (s < 10 ? '0' : '') +
          s;
      } else if (m) {
        str =
          (h < 10 ? '0' : '') +
          h +
          ':' +
          (m < 10 ? '0' : '') +
          m +
          ':' +
          (s < 10 ? '0' : '') +
          s;
      } else {
        str =
          (h < 10 ? '0' : '') +
          h +
          ':' +
          (m < 10 ? '0' : '') +
          m +
          ':' +
          (s < 10 ? '0' : '') +
          s;
      }
      return str;
    },
    getFullTime: function(second) {
      var y = new Date(second).getFullYear(),
        monthtime = new Date(second).getMonth(),
        daytime = new Date(second).getDate(),
        s = new Date(second).getSeconds(),
        m = new Date(second).getMinutes(),
        h = new Date(second).getHours(),
        str,
        fullTime;
      if (h) {
        str =
          (h < 10 ? '0' : '') +
          h +
          ':' +
          (m < 10 ? '0' : '') +
          m +
          ':' +
          (s < 10 ? '0' : '') +
          s;
      } else if (m) {
        str =
          (h < 10 ? '0' : '') +
          h +
          ':' +
          (m < 10 ? '0' : '') +
          m +
          ':' +
          (s < 10 ? '0' : '') +
          s;
      } else {
        str =
          (h < 10 ? '0' : '') +
          h +
          ':' +
          (m < 10 ? '0' : '') +
          m +
          ':' +
          (s < 10 ? '0' : '') +
          s;
      }
      fullTime = y + '年' + (monthtime + 1) + '月' + daytime + '日' + str;

      return fullTime;
    },
    getFullTimeString: function(s) {
      if (s > 9) {
        return s;
      } else {
        return '0' + s;
      }
    },
    isPhoneNum: function(s) {
      var patrn = /^((110)|(13[0-9])|(14[5-7])|(15[^4,\D])|(17[0-9])|(18[0-9]))\d{8}$/;
      if (!patrn.exec(s)) {
        return false;
      }
      return true;
    },
    init: function() {
      this.getData();
    },
    // 打开页面就会获取数据
    getData: function() {
      var that = this;
      //获取分享卡
      if (!window.window.isPrivateMode) {
        common.getDataWithSign({
          updata: { courseId: window.courseId },
          flag: 1,
          keyName: 'baseUrl' + window.courseId,
          url: that.baseUrl,
          success: function(res) {
            var nowTime = new Date().getTime(),
              time;
            function timerFun(timeNow, direction) {
              setInterval(function() {
                if (direction) {
                  timeNow = timeNow + 1000;
                } else {
                  timeNow = timeNow - 1000;
                }
                that.countdown = that.calculateTime(timeNow);
              }, 1000);
            }
            if (res.code === 0) {
              if (res.data) {
                that.rage = res.data.course;
                that.rankUrl = res.data.shareInfo.command.content;
                // that.myAvatar = res.data.user.avatar;
                that.teacherId = 'dvd_' + res.data.user.teacher_id;
                that.discussStatus = that.rage.discussStatus;
                that.video_live_commonchatRoomId = that.rage.discussRoomId;
                that.video_live_teacherchatRoomId = that.rage.teacherRoomId;
                that.shareList = res.data.shareInfo.shareTopList.slice(0, 3);
                that.role = res.data.user.role;
                that.title = that.rage.title;

                that.timeStart = [
                  new Date(that.rage.startTimestamp * 1000).getHours() < 10
                    ? '0' + new Date(that.rage.startTimestamp * 1000).getHours()
                    : new Date(that.rage.startTimestamp * 1000).getHours(),
                  new Date(that.rage.startTimestamp * 1000).getMinutes() < 10
                    ? '0' +
                      new Date(that.rage.startTimestamp * 1000).getMinutes()
                    : new Date(that.rage.startTimestamp * 1000).getMinutes()
                ];
                //老师判断

                if (that.role === 0 || that.role === 1) {
                  //todo
                  window.bravetime.newConfirm(
                    '发现您是这堂课程的老师哦，请打开APP继续操作',
                    {
                      okText: '打开APP',
                      hideCancel: true,
                      okLink: function() {
                        // 唤起app制定课程
                        bravetime.callAppEnteroom(that.courseId);
                      }
                    }
                  );
                }
                if (that.rage.endTimestamp) {
                  that.timeShow = 3;
                } else {
                  if (nowTime < parseInt(that.rage.startTimestamp) * 1000) {
                    that.timeShow = 1;
                  } else {
                    that.timeShow = 2;
                  }
                }

                if (that.rage.endTimestamp <= 0) {
                  if (nowTime < parseInt(that.rage.startTimestamp) * 1000) {
                    time = parseInt(that.rage.startTimestamp) * 1000 - nowTime;
                    that.countdownflag = true;
                    timerFun(time, false);
                  } else {
                    time = nowTime - parseInt(that.rage.startTimestamp) * 1000;
                    that.countdownflag = true;
                    timerFun(time, true);
                  }
                }

                console.log(
                  that.rage.startTimestamp,
                  that.rage.endTimestamp,
                  that.timeShow
                );
                if (
                  !sessionStorage.getItem(
                    'classroomScrollTop' + window.courseId
                  ) &&
                  nowTime < parseInt(that.rage.startTimestamp) * 1000 &&
                  that.rage.endTimestamp === 0
                ) {
                  that.firstComeGetTeacher(function() {
                    setTimeout(function() {
                      that.myScroll.refresh();
                      that.myScroll.scrollToElement('.bottom', 0);
                      that.firstPlayAudioBtn = true;
                    }, 1000);
                  });
                  that.maskAlertBtn = true;
                  console.log('课程开始前第一次进入直播间');
                }
                if (
                  sessionStorage.getItem(
                    'classroomScrollTop' + window.courseId
                  ) &&
                  nowTime < parseInt(that.rage.startTimestamp) * 1000 &&
                  that.rage.endTimestamp === 0
                ) {
                  that.firstComeGetTeacher(function() {
                    setTimeout(function() {
                      that.myScroll.refresh();
                      that.myScroll.scrollToElement('.bottom', 0);
                      that.firstPlayAudioBtn = true;
                    }, 1000);
                  });
                  console.log('课程开始前非第一次进入直播间');
                }

                if (
                  !sessionStorage.getItem(
                    'classroomScrollTop' + window.courseId
                  ) &&
                  nowTime > parseInt(that.rage.startTimestamp) * 1000 &&
                  that.rage.endTimestamp === 0
                ) {
                  that.firstComeGetTeacher(function() {
                    setTimeout(function() {
                      that.myScroll.refresh();
                      that.myScroll.scrollToElement('.bottom', 0);
                      that.firstPlayAudioBtn = true;
                    }, 1000);
                  });
                  console.log('课程开始后第一次进入直播间');
                }
                if (
                  sessionStorage.getItem(
                    'classroomScrollTop' + window.courseId
                  ) &&
                  nowTime > parseInt(that.rage.startTimestamp) * 1000 &&
                  that.rage.endTimestamp === 0
                ) {
                  that.continueStart(function() {
                    setTimeout(function() {
                      that.myScroll.refresh();
                      that.myScroll.scrollToElement('.bottom', 0);
                      that.firstPlayAudioBtn = true;
                    }, 1000);
                  });
                  console.log('课程开始后非第一次进入直播间');
                }
                if (
                  !sessionStorage.getItem(
                    'classroomScrollTop' + window.courseId
                  ) &&
                  nowTime > parseInt(that.rage.endTimestamp) * 1000 &&
                  that.rage.endTimestamp !== 0
                ) {
                  that.firstComeGetTeacher(function() {
                    setTimeout(function() {
                      that.myScroll.refresh();
                      // that.myScroll.scrollToElement('.bottom', 0);
                    }, 1000);
                  });
                  console.log('课程结束第一次进入直播间');
                }
                if (
                  sessionStorage.getItem(
                    'classroomScrollTop' + window.courseId
                  ) &&
                  nowTime > parseInt(that.rage.endTimestamp) * 1000 &&
                  that.rage.endTimestamp !== 0
                ) {
                  that.continueStart(function() {
                    setTimeout(function() {
                      that.myScroll.refresh();
                      that.myScroll.scrollToElement('.bottom', 0);
                      that.firstPlayAudioBtn = true;
                    }, 1000);
                  });
                  console.log('课程结束非第一次进入直播间');
                }
                sessionStorage.setItem(
                  'classroomScrollTop' + window.courseId,
                  0
                );
                that.initRongyun();



                if(res.data.seriesInfo){
                  if(res.data.seriesInfo.isSupervisor == 1){
                    that.isSupervisorClass=true;
                  }else if(res.data.seriesInfo.isSupervisor == 2){
                    that.isSupervisorClass=false;
                  }
//                  share.setShareInfo({
//                    title: "mahenan",
//                    desc: "mahenan",
//                    link: location.href,
//                    imgUrl: ""
//                  })
                  if(res.data.seriesInfo.seriesTitle &&
                    res.data.seriesInfo.seriesImg &&
                    res.data.seriesInfo.seriesUrl &&
                    res.data.seriesInfo.desc
                  ){
                    console.log({
                      title: res.data.seriesInfo.seriesTitle,
                      desc: res.data.seriesInfo.desc,
                      link: res.data.seriesInfo.seriesUrl,
                      imgUrl: res.data.seriesInfo.seriesImg
                    });
                    share.setShareInfo({
                      title: res.data.seriesInfo.seriesTitle,
                      desc: res.data.seriesInfo.desc,
                      link: window.location.href,
                      imgUrl: res.data.seriesInfo.seriesImg
                    });
                  }
                }
                if(that.rage.type && that.rage.type == 1){
                  that.videoClass=true;
                  if(that.rage.videoUrl){
                    that.videoUrl=that.rage.videoUrl;
                  }
                  if(that.rage.videoCover){
                    that.videoCover=that.rage.videoCover;
                  }
                  if(that.rage.startTimestamp){
                    that.startTimestamp=that.rage.startTimestamp;
                  }
                  that.$nextTick(()=>{
                    that.videoHTML='<video class="video-text" autoplay id="class_video" controlsList="nodownload" controls="controls" playsinline="" webkit-playsinline=""><source src="'+that.videoUrl+'" type="video/mp4"/>你的浏览器不支持H5播放器</video>';
                  })
                  document.addEventListener('WeixinJSBridgeReady',function(){

                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                      $("#class_video")[0].play();
                    });

                  },false)
                  wx.ready(function() {
                    $("#class_video")[0].play();
                  });
                }
              }
            } else {
              bravetime.info(res.msg);
            }
          },
          error: function() {
            that.getmoreflag = true;
          }
        });
      }
      //讨论区信息
      if (!window.isPrivateMode) {
        common.getDataWithSign({
          updata: {
            courseId: window.courseId,
            roomType: 0,
            time: 1,
            direction: 0
          },
          flag: 1,
          keyName: 'commonListUrl' + window.courseId,
          url: that.commonListUrl,
          success: function(res) {
            console.log('commonListUrl1');
            if (res.code === 0) {
              if (res.data && res.data.dataList) {
                that.commentSuccessCallback(res);
                // that.topRolling();
              }
            } else {
              bravetime.info(res.msg);
            }
          },
          error: function() {
            that.getmoreflag = true;
          }
        });
      }
    },
    getJsObj: function(index) {
      if (!$('#ulList li').eq(index)[0]) {
        return 'no';
      }
      if (
        $('#ulList li')
          .eq(index)
          .find('.audio') &&
        $('#ulList li')
          .eq(index)
          .find('.audio')
          .attr('data-src')
      ) {
        $('.allAudio').get(0).src = $('#ulList li')
          .eq(index)
          .find('.audio')
          .attr('data-src');
        return $('.allAudio').get(0);
      } else {
        return false;
      }
    },
    getJqObj: function(index) {
      return $('#ulList li')
        .eq(index)
        .find('.audiomain');
    },
    playVoiceFlag: function(index) {
      var that = this,
        audioJs = that.getJsObj(index),
        audioJq = that.getJqObj(index),
        i;
      // $('#ulList li').eq(index).find('.curcle-full').remove()
      if (this.barrageList[index]) {
        this.curcleFullHash[
          this.barrageList[index].uuid + '?' + this.userId
        ] = true;
      }
      $('#ulList li')
        .eq(index)
        .find('.curcle-full')
        .css('display', 'none');
      localStorage.setItem(
        'curcleFullHash',
        JSON.stringify(this.curcleFullHash)
      );

      if (that.playIndexFlag > that.barrageList.length - 1) {
        that.playIndexFlag = that.barrageList.length - 1;
      }
      if (index === 'no') {
        that.playIndexFlag = index + 1;
        that.getTeacherListAudio();
        return;
      }
      if (audioJs) {
        if (index === that.playIndexFlag) {
          if (that.barrageList[index].isPlay) {
            audioJs.pause();
            that.barrageList[index].isPlay = false;
            audioJq.removeClass('play');
          } else {
            audioJs.play();
            that.barrageList[index].isPlay = true;
            audioJq.addClass('play');
          }
        } else {
          if (that.playIndexFlag || that.playIndexFlag === 0) {
            that.getJqObj(that.playIndexFlag).removeClass('play');
            that.barrageList[that.playIndexFlag].isPlay = false;
          }
          that.playIndexFlag = index;
          audioJs.play();
          audioJq.addClass('play');
          that.barrageList[index].isPlay = true;
          audioJs.onended = function() {
            i = index + 1;
            that.playVoiceFlag(i);
            audioJq.removeClass('play');
            that.barrageList[index].isPlay = false;
          };
        }
      } else {
        i = index + 1;
        that.playVoiceFlag(i);
      }
    },
    //
    getTeacherListAudio: function() {
      var that = this;
      console.log('getTeacherListAudio');

      if (that.ryflag) {
        that.AjaxTime = that.barrageList[that.barrageList.length - 1].msg.time;
        common.getDataWithSign({
          updata: {
            courseId: window.courseId,
            roomType: 1,
            time: that.AjaxTime,
            direction: 1
          },
          keyName: 'teacherListUrl' + window.courseId,
          url: that.teacherListUrl,
          success: function(res) {
            if (res.code === 0) {
              if (!res.data) {
                that.playIndexFlag = that.barrageList.length;
                that.ryFlag = false;
              }
              if (res.data && res.data.dataList) {
                that.teacherSuccessCallback(res);
                setTimeout(function() {
                  that.playVoiceFlag(that.playIndexFlag);
                }, 1000);
              } else {
                console.warn('老师接口返回没有data');
                that.getMoreBarrage = false;
              }
            } else {
              bravetime.newAlert('getTeacherListAudio=' + res.code, function() {
                window.location = window.location.href;
              });
              that.getMoreBarrage = false;
              bravetime.info(res.msg);
            }
            Vue.nextTick(function() {
              that.myScroll.refresh();
            });
            that.refreshtxt = false;
            if (res.data && res.data.dataList && res.data.voiceTotal) {
              that.count = res.data.voiceTotal;
              that.referStatistics();
            }
          },
          error: function() {
            that.ErrorCallback();
          }
        });
      }
    },
    closeCard: function() {
      this.cardShow = false;
    },
    shareMyCard: function() {
      this.cardShow = true;
    },
    //第一次进入调用teacherListUrl
    firstComeGetTeacher: function(callback) {
      var that = this,
        pageSize,
        tempArr,
        i,
        isTel,
        myphone,
        duration;
      console.log('firstComeGetTeacher');

      that.ryList = [];
      if (!window.isPrivateMode) {
        common.getDataWithSign({
          updata: {
            courseId: window.courseId,
            roomType: 1,
            time: that.AjaxTime,
            direction: 0
          },
          keyName: 'teacherListUrl' + window.courseId,
          url: that.teacherListUrl,
          success: function(res) {
            if (res.code === 0) {
              if (res.data && res.data.dataList) {
                pageSize = res.data.pageSize;
                if (res.data.dataList && res.data.dataList.length < pageSize) {
                  that.ryflag = false;
                }
                tempArr = [];

                for (i = 0; i < res.data.dataList.length; i++) {
                  res.data.dataList[i].isPlay = false;
                  isTel = that.isPhoneNum(res.data.dataList[i].speaker.name);
                  if (isTel) {
                    myphone = res.data.dataList[i].speaker.name.substr(3, 4);
                    res.data.dataList[i].speaker.name = res.data.dataList[
                      i
                    ].speaker.name.replace(myphone, '****');
                  }
                  if (res.data.dataList[i].msg.duration) {
                    duration = res.data.dataList[i].msg.duration;
                    res.data.dataList[i].msg.voicewidth =
                      (duration + 65) * 2 > 200 ? 200 : (duration + 65) * 2;
                  }
                  if (
                    that.ryList[0] &&
                    res.data.dataList[i].uuid === that.ryList[0].uuid
                  ) {
                    res.data.dataList.length = i;
                    that.ryflag = false;
                  }
                  if (!that.tempHash[res.data.dataList[i].uuid]) {
                    tempArr.push(res.data.dataList[i]);
                  }
                  that.tempHash[res.data.dataList[i].uuid] = true;
                }
                res.data.dataList = tempArr;
                that.barrageList = res.data.dataList;
                that.getmoreflag = true;
                that.getMoreBarrage = false;
                that.refreshtxt = false;
                Vue.nextTick(function() {
                  localStorage.setItem(
                    'teacherListUrl' + window.courseId,
                    JSON.stringify(that.barrageList)
                  );
                  sessionStorage.setItem(
                    'classroomScrollTop' + window.courseId,
                    0
                  );
                  that.myScroll.on('scroll', function() {
                    let y = this.y, //当前位置
                      maxY = this.maxScrollY - y; //还可以滚动的高度
                    if (maxY >= 100 && !that.ryflag) {
                      setTimeout(function() {
                        that.myScroll.refresh();
                      }, 200);
                    }
                    window.timeFlag = new Date().getTime();
                    setTimeout(function() {
                      if (new Date().getTime() - window.timeFlag > 1999) {
                        that.upAndDown = false;
                      }
                    }, 2000);
                    that.upAndDown = true;
                    sessionStorage.setItem(
                      'classroomScrollTop' + window.courseId,
                      JSON.stringify(y)
                    );
                    sessionStorage.setItem(
                      'barrageListTime' + window.courseId,
                      JSON.stringify(
                        that.barrageList[that.barrageList.length - 1].msg.time
                      )
                    );
                    //做上拉加载旧的信息
                    if (maxY >= 60) {
                      if (!that.getmoreflag) {
                        return;
                      }
                      if (that.ryflag) {
                        that.getmoreflag = false;
                        that.teacherDownMore = true;
                        //做下拉加载新数据
                        if (!window.isPrivateMode) {
                          common.getDataWithSign({
                            updata: {
                              courseId: window.courseId,
                              roomType: 1,
                              // time:  AjaxTime,
                              time:
                                that.barrageList[that.barrageList.length - 1]
                                  .msg.time,
                              direction: 1
                            },
                            flag: 1,
                            keyName: 'teacherListUrl' + window.courseId,
                            url: that.teacherListUrl,
                            success: function(reson) {
                              console.log('做下拉加载新数据');
                              if (reson.code === 0) {
                                if (reson.data && reson.data.dataList) {
                                  that.teacherSuccessCallback(reson);
                                } else {
                                  console.warn('teacher null');
                                  that.getMoreBarrage = false;
                                }
                              } else {
                                bravetime.info(reson.msg);
                              }
                              sessionStorage.setItem(
                                'barrageListTime' + window.courseId,
                                JSON.stringify(
                                  that.barrageList[that.barrageList.length - 1]
                                    .msg.time
                                )
                              );
                              Vue.nextTick(function() {
                                that.myScroll.refresh();
                              });
                              setTimeout(function() {
                                that.getmoreflag = true;
                              }, 500);
                              that.teacherDownMore = false;
                              if (
                                res.data &&
                                res.data.dataList &&
                                res.data.voiceTotal
                              ) {
                                that.count = res.data.voiceTotal;
                                that.referStatistics();
                              }
                            },
                            error: function() {
                              that.ErrorCallback();
                            }
                          });
                        }
                      }
                    }
                    if (y >= 60) {
                      setTimeout(function() {
                        if (that.barrageList[0] && that.barrageList[0].msg) {
                          that.AjaxTime = that.barrageList[0].msg.time;
                        }
                        if (that.getmoreflag && that.upRyFlag) {
                          that.getmoreflag = false;
                          that.getMoreBarrage = true;
                          setTimeout(function() {
                            if (that.more === 1) {
                              that.refreshtxt = true;
                              common.getDataWithSign({
                                updata: {
                                  courseId: window.courseId,
                                  roomType: 1,
                                  time: that.AjaxTime,
                                  direction: 0
                                },
                                keyName: 'teacherListUrl' + window.courseId,
                                url: that.teacherListUrl,
                                success: function(resonpon) {
                                  if (resonpon.code === 0) {
                                    if (
                                      resonpon.data &&
                                      resonpon.data.dataList
                                    ) {
                                      that.teacherSuccessCallback(
                                        resonpon,
                                        true
                                      );
                                    } else {
                                      console.warn('老师接口返回没有data');
                                      that.getMoreBarrage = false;
                                    }
                                    sessionStorage.setItem(
                                      'barrageListTime' + window.courseId,
                                      JSON.stringify(
                                        that.barrageList[
                                          that.barrageList.length - 1
                                        ].msg.time
                                      )
                                    );
                                  } else {
                                    bravetime.newAlert(
                                      '下拉数据1＝' + resonpon.code,
                                      function() {
                                        window.location = window.location.href;
                                      }
                                    );
                                    that.getMoreBarrage = false;
                                    bravetime.info(resonpon.msg);
                                  }
                                  that.refreshtxt = false;
                                  Vue.nextTick(function() {
                                    that.myScroll.refresh();
                                  });
                                  if (
                                    resonpon.data &&
                                    resonpon.data.dataList &&
                                    resonpon.data.voiceTotal
                                  ) {
                                    that.count = resonpon.data.voiceTotal;
                                    that.referStatistics();
                                  }
                                },
                                error: function() {
                                  that.ErrorCallback();
                                }
                              });
                            }
                          }, 500);
                        }
                        return '';
                      }, 500);
                    }
                  });
                });
                if (callback) {
                  callback();
                }
              } else {
                console.warn('直播间teacher,data为null');
                that.ryflag = false;
              }
            } else {
              bravetime.info(res.msg);
            }
            if (res.data && res.data.dataList && res.data.voiceTotal) {
              that.count = res.data.voiceTotal;
              that.referStatistics();
            }
          },
          error: function() {
            that.error = false;
          }
        });
      }
    },
    continueStart: function(callback) {
      //继续听课
      var that = this;
      // that.tempHash={};
      that.ryList = [];

      if (sessionStorage.getItem('barrageListTime' + window.courseId) && sessionStorage.getItem('barrageListTime' + window.courseId) != 'undefined') {
        that.AjaxTime = JSON.parse(
          sessionStorage.getItem('barrageListTime' + window.courseId)
        );
        that.firstComeGetTeacher(callback);
      } else {
        that.firstComeGetTeacher(callback);
      }
    },
    //课程结束
    backStartVideo: function() {
      let that = this,
        AjaxTime;
      // that.tempHash={};
      that.ryList = [];
      if (!window.isPrivateMode) {
        common.getDataWithSign({
          updata: {
            courseId: window.courseId,
            roomType: 1,
            time: -1,
            direction: 1
          },
          flag: 1,
          keyName: 'teacherListUrl' + window.courseId,
          url: that.teacherListUrl,
          success: function(res) {
            if (res.code === 0 && res.data && res.data.dataList) {
              that.teacherSuccessCallback(res);
            } else {
              bravetime.info(res.msg);
            }
            Vue.nextTick(function() {
              that.myScroll.refresh();
              that.myScroll.on('scroll', function() {
                let y = this.y, //当前位置
                  maxY = this.maxScrollY - y; //还可以滚动的高度
                if (maxY >= 100 && !that.ryflag) {
                  setTimeout(function() {
                    that.myScroll.refresh();
                  }, 200);
                }
                if (maxY >= 60) {
                  //做下拉加载新数据
                  AjaxTime =
                    that.barrageList[that.barrageList.length - 1].msg.time;
                  if (that.getmoreflag && that.ryflag) {
                    that.getmoreflag = false;
                    that.teacherDownMore = true;
                    setTimeout(function() {
                      if (!window.isPrivateMode) {
                        common.getDataWithSign({
                          updata: {
                            courseId: window.courseId,
                            roomType: 1,
                            time: AjaxTime,
                            direction: 1
                          },
                          flag: 1,
                          keyName: 'teacherListUrl' + window.courseId,
                          url: that.teacherListUrl,
                          success: function(response) {
                            if (response.code === 0) {
                              if (response.data && response.data.dataList) {
                                that.teacherSuccessCallback(response);
                              } else {
                                console.warn('teacher null');
                                that.getMoreBarrage = false;
                                that.ryflag = false;
                              }
                            } else {
                              bravetime.info(response.msg);
                            }
                            Vue.nextTick(function() {
                              that.myScroll.refresh();
                            });
                            that.getmoreflag = true;
                            that.teacherDownMore = false;
                          },
                          error: function() {
                            that.ErrorCallback();
                            that.getmoreflag = true;
                          }
                        });
                      }
                    }, 1000);
                  }
                  return '';
                }
              });
            });
            if (
              res.code === 0 &&
              res.data &&
              res.data.dataList &&
              res.data.voiceTotal
            ) {
              that.count = res.data.voiceTotal;
              that.referStatistics();
            }
          },
          error: function() {
            bravetime.ajaxError();
          }
        });
      }
    },
    //继续 传参，主播数据获取最新的信息  需要做上拉加载
    startFirstVideo: function(aa, bb) {
      let that = this;
      that.tempHash = {};
      that.ryList = [];
      if (aa === 0 && bb === 1) {
        that.firstPlayAudioBtn = false;
      }
      if (that.more === 1) {
        if (!window.isPrivateMode) {
          common.getDataWithSign({
            updata: {
              courseId: window.courseId,
              roomType: 1,
              time: aa,
              direction: bb
            },
            flag: 1,
            keyName: 'teacherListUrl' + window.courseId,
            url: that.teacherListUrl,
            success: function(res) {
              var tempArr, i, isTel, myphone, duration;
              if (!res.data) {
                if (aa === 1 && bb === 0) {
                  that.myScroll.scrollToElement('.bottom', 1000);
                } else {
                  that.myScroll.scrollToElement('.commonroom', 1000);
                }
              }
              if (res && res.code === 0) {
                if (res.data && res.data.dataList) {
                  if (res.data.dataList && res.data.dataList.length < 10) {
                    that.ryflag = false;
                  }
                  tempArr = [];
                  for (i = 0; i < res.data.dataList.length; i++) {
                    res.data.dataList[i].isPlay = false;
                    isTel = that.isPhoneNum(res.data.dataList[i].speaker.name);
                    if (isTel) {
                      myphone = res.data.dataList[i].speaker.name.substr(3, 4);
                      res.data.dataList[i].speaker.name = res.data.dataList[
                        i
                      ].speaker.name.replace(myphone, '****');
                    }
                    if (res.data.dataList[i].msg.duration) {
                      duration = res.data.dataList[i].msg.duration;
                      res.data.dataList[i].msg.voicewidth =
                        (duration + 65) * 2 > 200 ? 200 : (duration + 65) * 2;
                    }
                    if (
                      that.ryList[0] &&
                      res.data.dataList[i].uuid === that.ryList[0].uuid
                    ) {
                      res.data.dataList.length = i;
                      that.ryflag = false;
                    }
                    if (!that.tempHash[res.data.dataList[i].uuid]) {
                      tempArr.push(res.data.dataList[i]);
                    }
                    that.tempHash[res.data.dataList[i].uuid] = true;
                  }
                  res.data.dataList = tempArr;
                  that.barrageList = res.data.dataList;
                  that.getmoreflag = true;
                  sessionStorage.setItem(
                    'barrageListTime' + window.courseId,
                    JSON.stringify(
                      that.barrageList[that.barrageList.length - 1].msg.time
                    )
                  );
                  Vue.nextTick(function() {
                    setTimeout(function() {
                      that.myScroll.refresh();
                      if (aa === 1 && bb === 0) {
                        that.myScroll.scrollToElement('.bottom', 1000);
                      } else {
                        that.myScroll.scrollToElement('.commonroom', 1000);
                      }
                    }, 200);
                  });
                } else {
                  if (aa === 1 && bb === 0) {
                    that.myScroll.scrollToElement('.bottom', 1000);
                  } else {
                    that.myScroll.scrollToElement('.commonroom', 1000);
                  }
                }
              } else {
                if (res) {
                  bravetime.info(res.msg);
                }
              }
              if (res.data && res.data.dataList && res.data.voiceTotal) {
                that.count = res.data.voiceTotal;
                that.referStatistics();
              }
            },
            error: function() {
              bravetime.ajaxError();
              log('this is error');
            }
          });
        }
      }
      //传参 获取最原始的信息  需要做下拉加载
    },
    calculateTime: function(second) {
      let sec = parseInt(second / 1000);
      var d = Math.floor(sec / (60 * 60 * 24)),
        h = Math.floor((sec - d * 60 * 60 * 24) / 3600),
        m = Math.floor((sec - d * 60 * 60 * 24 - h * 3600) / 60),
        s = Math.floor(sec - d * 60 * 60 * 24 - h * 3600 - m * 60);
      return [this.toDou(d), this.toDou(h), this.toDou(m), this.toDou(s)];
    },
    toDou: function(n) {
      if (n < 10) {
        return parseInt('0' + n);
      } else {
        return parseInt('' + n);
      }
    },
    //关闭commonList
    close_comment: function() {
      this.commonShow = false;
      this.openFlag=!this.openFlag;
    },
    switchflag: function() {
      this.commonflag = !this.commonflag;
    },
    open_comment: function() {
      this.openFlag=!this.openFlag;

      var that = this;
      this.commonShow = true;
      Vue.nextTick(function() {
        that.commonScroll = new IScroll('#common', {
          click: true,
          mouseWheel: true,
          probeType: 3
        });
        that.commonScroll.on('scroll', function() {
          let y = this.y, //当前位置
            maxY = this.maxScrollY - y; //还可以滚动的高度
          if (maxY >= 100 && !that.ryflag) {
            setTimeout(function() {
              that.commonScroll.refresh();
            }, 200);
          }
          if (y >= 60) {
            if (that.getmoreflag === true && that.ryflag1) {
              that.getmoreflag = false;
              //评论做上拉加载旧评论
              that.AjaxTime = that.commonList[0].msg.time;
              that.refreshtxt = true;
              setTimeout(function() {
                if (!window.isPrivateMode) {
                  common.getDataWithSign({
                    updata: {
                      courseId: window.courseId,
                      roomType: 0,
                      time: that.AjaxTime,
                      direction: 0
                    },
                    keyName: 'commonListUrl' + window.courseId,
                    url: that.commonListUrl,
                    success: function(res) {
                      if (res.code === 0) {
                        that.commentSuccessCallback(res);
                      } else {
                        bravetime.info(res.msg);
                        that.refreshtxt = false;
                      }
                      Vue.nextTick(function() {
                        that.commonScroll.refresh();
                      });
                      that.getmoreflag = true;
                      that.refreshtxt = false;
                    },
                    error: function() {
                      that.ErrorCallback();
                      that.refreshtxt = false;
                    }
                  });
                }
              }, 1000);
            }
            return '';
          }
        });
      });
    },
    joinRoom: function(roomId, messageCount) {
      RongIMClient.getInstance().joinChatRoom(roomId, messageCount, {
        onSuccess: function() {},
        onError: function() {
          bravetime.info('评论信息加载错误');
        }
      });
    },
    sentMessage: function() {
      let that = this,
        isTel,
        myphone,
        msg,
        commonchatRoomId,
        conversationtype,
        content,
        time,
        tempmsg,
        user,
        icon,
        name;
      if (this.sentMessageFlag) {
        this.sentMessageFlag = false;
        if (!this.sentmassagetext) {
          that.sentMessageFlag = true;
          return;
        }
        isTel = that.isPhoneNum(that.myName);
        if (isTel) {
          myphone = that.myName.substr(3, 4);
          that.myName = that.myName.replace(myphone, '****');
        }
        msg = new RongIMLib.TextMessage({
          content: encodeURIComponent(this.sentmassagetext),
          extra: JSON.stringify({
            info: {
              uuid: common.md5(
                Date.now() +
                  '' +
                  common.getUid() +
                  '' +
                  Math.floor((Math.random() + 1) * 100000000)
              ),
              userAsk: 0, //0：不是用户提问，1：是用户提问
              messageType: 0, //0：代表讨论消息，1：代表直播间消息
              courseId: that.courseId,
              time: new Date().getTime()
            }
          }),
          user: {
            icon: that.myAvatar,
            id: that.userid,
            name: encodeURIComponent(that.myName)
          }
        });
        //评论聊天室
        commonchatRoomId = that.video_live_commonchatRoomId; // 聊天室 Id。
        conversationtype = RongIMLib.ConversationType.CHATROOM;
        RongIMClient.getInstance().sendMessage(
          conversationtype,
          commonchatRoomId,
          msg,
          {
            onSuccess: function(message) {
              that.sentmassagetext = '';
              that.sentMessageFlag = true;
              that.total = that.total + 1;
              //message为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
              content = message.content.content;
              time = message.sentTime;
              if (message.content.user) {
                user = message.content.user;
                icon = user.icon;
                name = user.name;
              } else {
                name = that.myName;
                icon = that.myAvatar;
              }
              isTel = that.isPhoneNum(name);
              if (isTel) {
                myphone = name.substr(3, 4);
                name = name.replace(myphone, '****');
              }
              tempmsg = {
                msg: {
                  content: content,
                  time: time,
                  type: 0
                },
                speaker: {
                  avatar: icon,
                  id: message.senderUserId,
                  name: name
                },
                uuid: ''
              };
              if (message.targetId === that.video_live_teacherchatRoomId) {
                that.barrageList.push(tempmsg);
                sessionStorage.setItem(
                  'classroomBarrageList' + window.courseId,
                  JSON.stringify(that.barrageList)
                );
              } else if (
                message.targetId === that.video_live_commonchatRoomId
              ) {
                that.shareTopList.splice(2, 0, tempmsg);
                that.commonList.push(tempmsg);
              }
              Vue.nextTick(function() {
                if (that.commonShow) {
                  setTimeout(function() {
                    that.myScroll.refresh();
                    that.commonScroll.refresh();
                    that.commonScroll.scrollToElement('.commonbottom', 0);
                  }, 500);
                } else {
                  setTimeout(function() {
                    that.myScroll.refresh();
                  }, 500);
                }
              });
            },
            onError: function(errorCode) {
              var info = '';
              switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  info = '超时';
                  break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                  info = '未知错误';
                  break;
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                  info = '在黑名单中，无法向对方发送消息';
                  break;
                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                  info = '不在讨论组中';
                  break;
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                  info = '不在群组中';
                  break;
                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                  info = '不在聊天室中';
                  break;
                default:
                  info = 'error';
                  break;
              }
              that.sentmassagetext = '';
              that.sentMessageFlag = true;
              bravetime.info(info);
              log('发送错误:' + info);
            }
          }
        );
      }
    },
    codeErrorCallback: function(res) {
      if (res && res.msg) {
        bravetime.info(res.msg);
      }
    },
    teacherSuccessCallback: function(res, down) {
      var that = this,
        pageSize = res.data.pageSize,
        tempArr = [],
        i,
        isTel,
        myphone,
        duration;
      if (!res.data) {
        that.ryflag = false;
        return;
      }
      if (
        res.data &&
        res.data.dataList &&
        res.data.dataList.length < pageSize
      ) {
        if (!down) {
          that.ryflag = false;
        } else {
          that.upRyFlag = false;
        }
      }
      for (i = 0; i < res.data.dataList.length; i++) {
        that.isPlay[i] = false;
        isTel = that.isPhoneNum(res.data.dataList[i].speaker.name);
        if (isTel) {
          myphone = res.data.dataList[i].speaker.name.substr(3, 4);
          res.data.dataList[i].speaker.name = res.data.dataList[
            i
          ].speaker.name.replace(myphone, '****');
        }
        if (res.data.dataList[i].msg.duration) {
          duration = res.data.dataList[i].msg.duration;
          res.data.dataList[i].msg.voicewidth =
            (duration + 65) * 2 > 200 ? 200 : (duration + 65) * 2;
        }
        if (!that.tempHash[res.data.dataList[i].uuid]) {
          tempArr.push(res.data.dataList[i]);
        }

        if (
          that.ryList[0] &&
          res.data.dataList[i].uuid === that.ryList[0].uuid
        ) {
          that.ryflag = false;
        }
        that.tempHash[res.data.dataList[i].uuid] = true;
      }
      if (!that.ryflag && that.ryList) {
        for (i = 0; i < that.ryList.length; i++) {
          if (!that.tempHash[that.ryList[i].uuid]) {
            tempArr.push(that.ryList[i]);
          }
          that.tempHash[that.ryList[i].uuid] = true;
        }
        that.ryList = [];
      }
      res.data.dataList = tempArr;
      if (!down) {
        that.barrageList = that.barrageList.concat(res.data.dataList);
      } else {
        that.barrageList = res.data.dataList.concat(that.barrageList);
      }
      that.getmoreflag = true;
      that.getMoreBarrage = false;
      that.refreshtxt = false;
    },
    commentSuccessCallback: function(res) {
      var that = this,
        pageSize,
        tempArr,
        i,
        isTel,
        myphone;
      if (res.data && res.data.dataList) {
        pageSize = res.data.pageSize;
        if (res.data.dataList && res.data.dataList.length < pageSize) {
          that.ryflag1 = false;
        }
        if (pageSize) {
          that.total = res.data.total;
        }
        tempArr = [];
        for (i = 0; i < res.data.dataList.length; i++) {
          isTel = that.isPhoneNum(res.data.dataList[i].speaker.name);
          if (isTel) {
            myphone = res.data.dataList[i].speaker.name.substr(3, 4);
            res.data.dataList[i].speaker.name = res.data.dataList[
              i
            ].speaker.name.replace(myphone, '****');
          }
          if (!that.tempHash[res.data.dataList[i].uuid]) {
            tempArr.push(res.data.dataList[i]);
          }
          that.tempHash[res.data.dataList[i].uuid] = true;
        }
      }
      res.data.dataList = tempArr;
      that.shareTopList = that.shareTopList.concat(res.data.dataList.slice(0)); //数组为引用赋值
      that.commonList = res.data.dataList.concat(that.commonList);
      that.getmoreflag = true;
      Vue.nextTick(function() {
        if (that.commonScroll) {
          setTimeout(function() {
            that.getMoreBarrage = false;
            that.refreshtxt = false;
            that.commonScroll.refresh();
          }, 300);
        }
      });
    },
    ErrorCallback: function() {
      //下拉获取旧数据
      var that = this;
      bravetime.ajaxError();
      that.getmoreflag = true;
      that.getMoreBarrage = false;
      that.refreshtxt = false;
      bravetime.info('信息加载错误');
    },
    teacherRefresh: function() {},
    commentRefresh: function() {}
  },
  components: {
    vSchoolTitle: vSchoolTitle,
    inviteCard: inviteCard
  },
  watch: {}
};
</script>








