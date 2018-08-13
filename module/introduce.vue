<style>
  del {
    text-decoration: line-through;
  }

  .bravetime-info {
    position: absolute !important;
  }

  .teacher-more-btn {
    width: 40px;
    height: 44px;
  }
</style>
<template>
  <div class="introduce_inner">
    <!--<v-school-title></v-school-title>-->
    <!--标题-->
    <com-top-title-app v-if="growthBox == 0" :set-head="false" title="课程详情" :share-money="isLogined && income" :share="!income && isLogined" :share-money-click="invite" :share-click="invite" :home="!ua.isDvdApp()"></com-top-title-app>

    <com-top-title v-if="growthBox == 1" :growth-box="true" :set-head="false" title="课程详情">
      <img class="teacher-more-btn" slot="right" src="//9i.dvmama.com/free/blackMoreMenu_2x.png" @click="teacherMoreBtnClick"
           v-if="ua.isDvdApp() && ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') >= 0 && (userRole == 0 || userRole == 1)">
    </com-top-title>

    
    <!--内容-->
    <div id="scroll_container" v-if="!error && deleteFlag && visitorFlag!=0">
      <div class="scroll">
        <index-feed :data="feedData"></index-feed>
      </div>
      <!-- <div class="other_info">
          <div>课程须知：</div>
          <div>1、本次课堂内容永久保存，可反复收听；</div>
      </div> -->
    </div>

    <!-- 底部提示和关闭按钮 -->
    <div v-show="showBottomTip === true">
      <div class="ui-bottom-tip-btn" @click="closeBottomTip('click')"></div>
      <div class="ui-bottom-tip-box">
        <img src="//9i.dvmama.com/free/2018/05/25/b_tip.png" width="100%" height="100%">
      </div>
    </div>

    <div class="invite_and_enroll" v-if="!error && deleteFlag && visitorFlag!=0" id="growthBox">
      <div class="btn_container left1" v-if="!growthBox && isEnglish">
        <template v-if="!isAuditing">
          <div class="invite" @click="invite">邀请好友</div>
        </template>
        <template v-if="isAuditing">
          <div class="invite" @click="invite1" v-if='visitor_status!=3 && type==2'>
            成为会员免费听
          </div>
          <div class="invite" @click="invite" v-else>
            邀请好友
            <template v-if="income">赚: ¥{{income}}<img src="//9i.dvmama.com/free/2017/07/28/centerShare.png">
            </template>
          </div>
        </template>
      </div>

      <div class="btn_container right1" v-if="isEnglish" :style="{'width':growthBox?'100%':'auto'}">
        <!--已报名的观众 或者嘉宾 或者讲师-->
        <!--isAuditing 审核版本-->
        <template v-if="!isAuditing">
          <div class="enroll1" @click="enterClassroom">
            进入课程<span v-if='cache'>(已缓存)</span>
          </div>
        </template>
        <template v-if="isAuditing">

          <template v-if="growthBox">
            <!--modify by swg 斌哥要求改的逻辑：进入此页面的都是会员，所以此处不需要了-->
            <!--modify by mahenan 斌哥要求改的,现在又改回去了。 qaq-->
            <div class="enroll1" @click="enroll" :class="{'growthBox': growthBox}"
                 v-if="!entered&&visitor_status==3&&(userRole==2 && userTicket==0 && type==2)">
              立即报名
              <!--<del>¥{{money}}</del>-->
            </div>
            <div class="enroll1" @click="fn" :class="{'growthBox': growthBox}"
                 v-if="!entered&&visitor_status!=3&&(userRole==2 && userTicket==0 && type==2)">
              立即报名
              <!--<del>¥{{money}}</del>-->
            </div>


            <!--未报名的 人 看到的 公开课课-->
            <div class="enroll1" @click="enroll" :class="{'growthBox': growthBox}" v-if="!entered&&(userRole==2&&userTicket==0&&type==1)">
              马上报名
            </div>

            <!--modify by swg 斌哥要求改的逻辑：进入此页面的都是会员，所以此处不需要了-->
            <!--modify by mahenan 斌哥要求改的,现在又改回去了。 qaq-->
            <div class="enroll1" @click="goAppClassroom" :class="{'growthBox': growthBox}"
                 v-if="!entered&&(userRole==1||userRole==0||userTicket==1)">
              进入课程 <span v-if='cache'>(已缓存)</span>
            </div>
            <!--<div class="enroll1" @click="goAppClassroom" :class="{'growthBox': growthBox}"-->
                 <!--v-if="!entered&&(userRole==1||userRole==2||userRole==0||userTicket==1)">-->
              <!--进入课程 <span v-if='cache'>(已缓存)</span>-->
            <!--</div>-->

          </template>
          <template v-if="!growthBox">
            <!--songyanqi  start-->
            <template v-if="isEnglish == 1">
              <div class="enroll1" @click="toGoodsMessage">点击进入商品详情</div>
            </template>
            <!--songyanqi  end-->
            <template v-if="isEnglish == 2">
              <div class="enroll1" @click="enterClassroom"
                   v-if="!entered&&(userRole==1||userRole==0||userTicket==1)">
                进入课程 <span v-if='cache'>(已缓存)</span>
              </div>
              <!--未报名的 人 看到的 公开课课-->
              <div class="enroll1" @click="enroll" v-if="!entered&&(userRole==2&&userTicket==0&&type==1)">
                马上报名
              </div>

              <!--付费课-->
              <div class="enroll1" @click="buyClassroom"
                   v-if="!entered&&visitor_status!=3&&(userRole==2 && userTicket==0 && type==2)">
                <template v-if="util.utils.isIOS() && ua.isDvdApp() && ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') >= 0 && !logined.isSeller()">购买课程: {{money}} v豆</template>
                <template v-else>购买课程: ¥{{money}}</template>
              </div>
              <!--卖家看到的付费课-->
              <div class="enroll1" @click="enroll"
                   v-if="!entered&&visitor_status==3&&(userRole==2 && userTicket==0 && type==2)">
                <template v-if="util.utils.isIOS() && ua.isDvdApp() && ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') >= 0">
                  会员免费:
                  <del>{{money}} v豆</del>
                </template>
                <template v-else> 会员免费:
                  <del>¥{{money}}</del></template>
              </div>
              <!--加密课-->
              <div class="enroll1 need_invite" @click="alertCode"
                   v-if="!entered&&(userRole==2&&userTicket==0&&type==3)">
                请输入邀请码报名
              </div>
              <!--正在报名的的 所有人-->
              <div class="enroll1" v-if="entered">
                进入课程中
              </div>
            </template>
          </template>
        </template>
      </div>
    </div>
    <div v-if='visitorFlag==0 && !error' class='noApply'>
      <img src="//9i.dvmama.com/free/2017/09/01/Group.png">
      <p>登录后才能继续访问</p>
      <span @click='login'>立即登录</span>
    </div>
    <invite-card :show="inviteShow" :id="courseId" statistics="3" v-on:close="closeCard" kind="0"></invite-card>
    <div class="other_info">
      <div class='unLoad' v-if="error">
        <div class='unLoad-img'></div>
        <div class='unLoad-title'>网络异常，请重新加载</div>
        <div class='unLoad-btn' @click='getData(true)'>点击重新加载</div>
      </div>
    </div>
    <div v-if='!deleteFlag'>
      <img class='delete_img' src="//9i.dvmama.com/free/introduce_fail.png">
      <p class='delete_content'>
        <span>课程不存在啦</span>
        <span>去看看老师的其他课程</span>
      </p>
      <p class='delete_btn' @click='goTeacherProfile'>进入老师个人主页</p>
    </div>
  </div>
</template>
<style type="text/css">
  body{
    padding-bottom: 0.5rem;
  }
  /*.body{
    padding-bottom: 0.45rem;
  }*/
  #scroll_container {
    -webkit-overflow-scrolling: touch;
  }

  .delete_img {
    margin-top: 0.8rem;
    margin-left: 1.3rem;
    width: 1.2rem;
  }

  .delete_content {
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

  #growthBox .growthBox{
    width: 100%;
  }
  .delete_content span {
    display: inline-block;
  }

  .delete_btn {
    margin: 0.2rem auto;
    color: #333333;
    width: 1.6rem;
    height: 0.33rem;
    border: 1px solid #999999;
    border-radius: 4px;
    text-align: center;
    line-height: 0.33rem;
  }

  /*苹果支付*/
  .com-popup-base.ios-pay {
    z-index: 1000;
  }

  body{
    padding-top: 0;
  }
</style>
<style lang='sass' lang='scss' scoped>
  .ui-bottom-tip-box{
    width: 3.54rem;
    height: 0.67rem;
    position: fixed;
    bottom:0.55rem;
    left: 0.1rem;
  }
  .ui-bottom-tip-btn{
    width: 0.2rem;
    height: 0.2rem;
    position: fixed;
    bottom:0.84rem;
    left: 3.25rem;
    z-index:1;
  }
  .bottomBtn {
    position: absolute;
    height: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: 0.6;
    z-index: 300;
  }

  .btn_container {
    border-top: 1px solid #eee;
  }

  .introduce_inner .invite_and_enroll {
    position: fixed;
    height: 0.5rem;
    bottom: 0;
  }

  .introduce_inner .invite_and_enroll .left1 {
    width: 1.6rem;
    /*height: 0.5rem;*/
    height: 100%;
    .invite {
      width: 1.6rem;
      height: 0.5rem;
      line-height: 0.5rem;
      margin: 0;
      /*background: -webkit-linear-gradient(left, #FF5B5B, #FB1C62);*/
      background: #F9F7F8;
      color: #666666;
      font-size: 14px;
      img {
        width: 0.13rem;
        margin-bottom: 0.01rem;
      }
    }
  }

  .introduce_inner .invite_and_enroll .right1 {
    width: 2.15rem;
    height: 0.5rem;
    right: 0;
    .enroll1 {
      width: 2.15rem;
      height: 0.5rem;
      margin: 0;
      line-height: 0.5rem;
      background: -webkit-linear-gradient(left, #FF5B5B, #FA1862);
      text-align: center;
      font-size: 14px;
    }
  }

  .invite_and_enroll:after {
    border-width: 0 0 0 !important;
  }

  .noApply {
    text-align: center;
    img {
      width: 1.2rem;
      margin-top: 1rem;
    }
    p {
      color: #666;
      margin-top: 0.3rem;
      text-align: center;
    }
    span {
      display: inline-block;
      height: 66px;
      line-height: 66px;
      width: 280px;
      border: 1px solid #999999;
      border-radius: 200px;
      color: #333333;
      text-align: center;
      margin-top: 0.1rem;
      font-size: 24px;
      -webkit-transform: scale(0.5)
    }

  }
</style>
<script>
  import introduce from "./introduce.es6"
  export default introduce
//  export default {}
</script>
