<template>
  <div v-show="show">
    <div class="ui-close-tip-box"></div>
    <div class="ui-tip-box">
      <div class="ui-tip-text">
        <span>祝贺你已经开始了第一课！接下来就请在知识的海洋里尽情畅游吧</span>
      </div>
      <div class="ui-tip-btn" @click="closeTip(0)">
        <span>关闭第一课引导</span>
      </div>
    </div>
    <div class="ui-close-btn" @click="closeTip(1)">
      <img src="//9i.dvmama.com/free/2018/05/29/close_tip_close.png" width="100%" height="100%">
    </div>
  </div>
</template>

<script>

  export default {
    name: 'close-tip',
    props: {
      showTipTag: {}// 父组件用于控制本组件展示和隐藏的参数
    },
    data() {
      return {
        show: false//本组件控制展示隐藏跟随父组件变化
      };
    },
    watch: {
      showTipTag() {
        this.show = this.showTipTag;
      }
    },
    methods: {
      closeTip(t) {
        let _this = this;
        //t===1只关闭本tip
        //t===0先关闭本tip同时调接口并且通知父组件关闭父组件显示
        _this.$emit('close-tip', t);

      }
    }
  };
</script>

<style lang="sass" lang="scss" scoped>
  .ui-close-tip-box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background-color: #000000;
    opacity: 0.5;
    z-index: 1000 !important; //弹窗全覆盖底部导航和回顶部按钮
  }

  .ui-tip-box {
    width: 1.95rem;
    height: 1.8rem;
    padding: 0 0.2rem;
    background-color: #ffffff;
    border-radius: 0.08rem;
    position: fixed;
    top: 2.05rem;
    left: 0.7rem;
    z-index: 1001;
    font-size: 0;
    .ui-tip-text {
      width: 1.96rem;
      height: 0.6rem;
      font-size: 14px;
      line-height: 0.2rem;
      margin-top: 0.4rem;
    }
    .ui-tip-btn {
      margin-top: 0.15rem;
      width: 1.95rem;
      height: 0.27rem;
      line-height: 0.27rem;
      text-align: center;
      font-size: 12px;
      color: #FFFFFF;
      letter-spacing: 0;
      background: linear-gradient(to right, #ff613c, #fa1862);
      border-radius: 0.25rem;
    }
  }

  .ui-close-btn {
    width: 0.4rem;
    height: 0.4rem;
    position: fixed;
    top: 4.22rem;
    left: 50%;
    margin-left: -0.2rem;
    z-index: 1001;
  }
</style>
