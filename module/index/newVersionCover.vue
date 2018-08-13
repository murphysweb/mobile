<template>
  <div v-if="showTip === '1'">
    <div class="ui-bg"></div>
    <div class="ui-tip-box">
      <!--<img src="//9i.dvmama.com/free/2018/07/25/radioTip.png" width="100%" height="100%">-->
      <div class="ui-left-radiu">
        <div class="ui-left-radiu1">
          <div class="ui-left-radiu2">
            <div class="ui-left-radiu3">
            </div>
          </div>
        </div>
      </div>
      <div class="ui-line"></div>
      <div class="ui-right-box">
        <div>亲子时光、故事大全等,</div>
        <div>所有的音频都收到这里喽</div>
      </div>
    </div>
    <div class="ui-btn" @click="closeTip()">知道啦</div>
  </div>
</template>

<script>
  export default {
    name: 'new-version-cover',
    data() {
      return {
        showTip: '0' // 0不展示 1展示 服务端下发 通过本地localStorage和服务端下发得出结果
      };
    },
    created() {

    },
    mounted() {
      let _this = this;
      _this.isShowTip();
    },
    methods: {
      closeTip() {
        let _this = this;
        _this.showTip = false;
        localStorage.setItem('showCourseNewVersionTip', '0');
      },

      isShowTip() {
        let _this = this;
        // 调接口获取是服务端要求否展示
        let showGuideNewVersionTip = localStorage.getItem('showGuideNewVersionTip'); // 服务端
        let showCourseNewVersionTip = localStorage.getItem('showCourseNewVersionTip'); // 本地
        if (showGuideNewVersionTip == 0) { // 服务端下发不展示
          _this.showTip = '0';
        } else if (showGuideNewVersionTip == 1) { // 服务端下发展示
          if (showCourseNewVersionTip == 0) { // 本地已经展示过
            _this.showTip = '0';
          } else { // 本地未展示过
            _this.showTip = '1';
          }
        }

        // if (localStorage.getItem('showCourseNewVersionTip')) {
        //   _this.showTip = localStorage.getItem('showCourseNewVersionTip');
        // }else{
        //   if(response.data.show === true){
        //     _this.showTip = '1';
        //   }else{
        //     _this.showTip = '0';
        //   }
        // }
      }
    }
  };

</script>

<style lang="sass" lang="scss" scoped>
  .ui-bg {
    width: 100%;
    height: 6.67rem;
    position: fixed;
    top: 0;
    z-index: 1000; //覆盖回顶部按钮
    background-color: #333333;
    opacity: 0.5;
  }

  .debug {
    border: solid 1px #ffffff;
  }

  .ui-tip-box {
    font-size: 0;
    width: 2.13rem;
    height: 1.43rem;
    position: fixed;
    top: 2.4rem;
    left: 0.81rem;
    z-index: 1001;
    animation: act 1000ms;
    div {
      display: inline-block;
      position: fixed;
    }
    .ui-left-radiu {
      width: 0.36rem;
      height: 0.36rem;
      background-color: #ff6e8a;
      border-radius: 0.5rem;
      margin-top: 0;
      margin-left: 1.53rem;
      opacity: 0.5;
      .ui-left-radiu1 {
        width: 0.16rem;
        height: 0.16rem;
        border-radius: 0.5rem;
        border: solid 1px #ff4f7e;
        margin-left: 0.1rem;
        margin-top: 0.1rem;
        .ui-left-radiu2 {
          width: 0.14rem;
          height: 0.14rem;
          border-radius: 0.5rem;
          background-color: #ff4f7e;
          margin-left: 0.01rem;
          margin-top: 0.01rem;
          .ui-left-radiu3 {
            width: 0.04rem;
            height: 0.04rem;
            border-radius: 0.5rem;
            background-color: #ff9494;
            margin-left: 0.05rem;
            margin-top: 0.05rem;
          }
        }
      }
    }
    .ui-line {
      width: 1px;
      height: 0.41rem;
      background-color: #ff9494;
      margin-top: 0.18rem;
      margin-left: 1.72rem;
    }
    .ui-right-box {
      font-size: 0.14rem;
      font-weight: 100;
      width: 1.93rem;
      height: 0.71rem;
      border-radius: 0.15rem;
      color: #ffffff;
      border: solid 1px #ff9494;
      margin-left: 0.1rem;
      margin-top: 0.59rem;
      div {
        display: block;
      }
      div:nth-child(1) {
        margin-top: 0.16rem;
        margin-left: 0.22rem;
      }
      div:nth-child(2) {
        margin-top: 0.32rem;
        margin-left: 0.2rem;
      }
    }
  }

  .ui-btn {
    width: 1.2rem;
    height: 0.4rem;
    line-height: 0.4rem;
    position: fixed;
    top: 5.13rem;
    left: 50%;
    margin-left: -0.6rem;
    z-index: 1001;
    text-align: center;
    border-radius: 0.25rem;
    background: linear-gradient(90deg, #ff7c7c, #ff6a8b);
    color: #ffffff;
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

  @keyframes actOut {
    0% {
      opacity: 1
    }
    to {
      opacity: 0;
    }
  }
</style>
