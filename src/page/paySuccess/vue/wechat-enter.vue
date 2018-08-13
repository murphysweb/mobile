<template>
  <div class="we-container1">
    <div class="we-title">
      <img class="we-icon"
           :src="icon"/>
      <span class="we-name">{{name}}</span>
    </div>
    <div class="we-desc">
      <span>{{flockDesc}}</span>
    </div>
    <div class="we-button" @click="joinButtonClick()">
      <img class="we-button-img" src="//9i.dvmama.com/free/2018/07/12/weChatGroupBg.png"/>
      <img class="we-button-img-2" src="//9i.dvmama.com/free/2018/07/12/weChatIcon.png"/>
      <span class="we-button-text">{{buttonText}}</span>
      <img class="we-button-img-3" src="//9i.dvmama.com/free/2018/07/12/V77.png"/>
    </div>
  </div>
</template>

<script>
  import ua from 'dvd-base-js-ua';
  import native from 'dvd-service-js-native';

  export default {
    name: 'wechat-enter',
    methods: {
      joinButtonClick() {
        let that = this;
        if ((ua.isDvdApp() && ua.compareVersion(ua.getDvdAppVersion(), '5.8.0') >= 0)) {
          //当前app版本大于等于580调起原生小程序
          native.Common.openWXMiniProgram({
            "programId": that.programId,
            "path": that.path,
            // "success": function (call) {
            //
            // },
            "error": function () {
              location.href = this.joinUrl + 'groupId=' + this.groupId;
            }
          });
        } else {
          location.href = this.joinUrl + 'groupId=' + this.groupId;
        }
      }
    },
    data: function () {
      return {
        programId: '',
        path: '',
        joinUrl: '/m/wechat_flock_enter.html?',
        icon: '',
        //用于请求群二维码
        groupId: '',
        name: '',
        //群简介
        flockDesc: '',
        //进群按钮文案
        buttonText: '',
      }
    },
    props: ['cIcon', 'cGroupId', 'cName', 'cPath', 'cProgramId', 'cFlockDesc', 'cButtonText'],
    computed: {
      icon() {
        return this.cIcon;
      },
      groupId() {
        return this.cGroupId;
      },
      // managerId() {
      //   return this.cManagerId;
      // },
      name() {
        return this.cName;
      },
      path() {
        return this.cPath;
      },
      programId() {
        return this.cProgramId;
      },
      flockDesc() {
        return this.cFlockDesc;
      },
      buttonText() {
        return this.cButtonText;
      },
    },
  };
</script>

<style lang="sass" lang="scss" scoped>
  .we-container1 {
    width: 100%;
    margin-top: 10px;
    height: auto;
    background-color: white;
  }

  .we-title {
    padding-left: 0.2rem;
    padding-top: 0.2rem;
    width: 100%;
    height: 0.54rem;
  }

  .we-icon {
    width: 0.5rem;
    height: 0.5rem;
  }

  .we-name {
    margin-left: 0.1rem;
    font-size: 0.14rem;
    color: #333333;
  }

  .we-desc {
    padding-top: 0.05rem;
    margin-right: 0.2rem;
    margin-left: 0.2rem;
  }

  .we-button {
    width: 100%;
    padding-bottom: 0.15rem;
    padding-top: 0.1rem;
    height: 0.61rem;
    align-items: center;
  }

  .we-button-img {
    width: 2.05rem;
    height: 0.5rem;
    margin-left: 0.85rem;
  }

  .we-button-img-2 {
    width: 0.3rem;
    height: 0.3rem;
    position: absolute;
    margin-left: -0.55rem;
    margin-top: 0.16rem;
  }

  .we-button-text {
    font-size: 0.16rem;
    color: white;
    position: absolute;
    margin-left: -1.33rem;
    margin-top: 0.162rem;
  }

  .we-button-img-3 {
    width: 0.4rem;
    height: 0.4rem;
    margin-left: -0.4rem;
    margin-top: 0.24rem;
    position: absolute;

    -webkit-animation: bounce-down 1.5s linear infinite;
    -o-animation: bounce-down 1.5s linear infinite;
    animation: bounce-down 1.5s linear infinite;
  }

  /* 关键帧动画 */
  @-webkit-keyframes bounce-down {
    25% {
      -webkit-transform: translateY(-0.05rem);
      -moz-transform: translateY(-0.05rem);
      -ms-transform: translateY(-0.05rem);
      -o-transform: translateY(-0.05rem);
      transform: translateY(-0.05rem);
    }
    50%, 100% {
      -webkit-transform: translateY(0);
      -moz-transform: translateY(0);
      -ms-transform: translateY(0);
      -o-transform: translateY(0);
      transform: translateY(0);
    }
    75% {
      -webkit-transform: translateY(0.05rem);
      -moz-transform: translateY(0.05rem);
      -ms-transform: translateY(0.05rem);
      -o-transform: translateY(0.05rem);
      transform: translateY(0.05rem);
    }
  }

  @keyframes bounce-down {
    25% {
      -webkit-transform: translateY(-0.05rem);
      -moz-transform: translateY(-0.05rem);
      -ms-transform: translateY(-0.05rem);
      -o-transform: translateY(-0.05rem);
      transform: translateY(-0.05rem);
    }
    50%, 100% {
      -webkit-transform: translateY(0);
      -moz-transform: translateY(0);
      -ms-transform: translateY(0);
      -o-transform: translateY(0);
      transform: translateY(0);
    }
    75% {
      -webkit-transform: translateY(0.05rem);
      -moz-transform: translateY(0.05rem);
      -ms-transform: translateY(0.05rem);
      -o-transform: translateY(0.05rem);
      transform: translateY(0.05rem);
    }
  }
</style>
