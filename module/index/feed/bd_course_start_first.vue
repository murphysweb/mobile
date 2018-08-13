<template>
  <div :style="{ marginTop:data.marginTop + 'px' }" v-if="isShow" class="ui-all">
    <div :style="styleObject">
      <div :class="{'ui-bg-box':status===0}" :style="{ backgroundColor:data.body.bgColor }">
        <img src="//9i.dvmama.com/free/2018/07/29/courseStartFirst.jpg" v-if="status === 0">
        <img src="//9i.dvmama.com/free/2018/05/19/startFirstClose.png" v-if="status === 1">
      </div>
      <div class="ui-close-btn" v-if="status === 1" @click="closeThisModel()"></div>
      <div class="ui-cover-btn-b" v-if="status===0" @click='showModel(status)'></div>
      <div class="ui-cover-btn-s" v-if="status===1" @click='showModel(status)'></div>
    </div>

    <!-- 用户信息弹窗 -->
    <user-chose-msg :show-model-tag="showModelTag" @model="closeModel" @submited="submited"></user-chose-msg>
    <!-- 关闭成功提示弹框 -->
    <close-tip :show-tip-tag="showTipTag" @close-tip="closeTip"></close-tip>
  </div>
</template>

<script>
  import layout from '../layout.es6';
  import userChoseMsg from '../../userChoseMsg.vue';
  import closeTip from '../../closeTip.vue';
  import encrypt from 'dvd-service-js-encrypt';


  export default {
    name: 'bd_course_start_first',
    props: ['data'],
    data() {
      return {
        status: '',
        isShow: true,
        showModelTag: false, //控制展示隐藏用户信息弹框
        showClose: true,
        showTipTag: false // 控制展示隐藏关闭引导弹框
      };
    },
    
    created() {
      this.styleObject = layout.styleObjectDvk(this.data);
      this.status = Number(this.data.body.data.status);
    },
    methods: {
      closeThisModel() {
        let _this = this;
        _this.showTipTag = true;
      },
      showModel(s) {
        let _this = this;
        if (s === 1) {
          _this.submited();
        } else if (s === 0) {
          _this.showModelTag = true;
        }
      },
      closeModel() {
        let _this = this;
        _this.showModelTag = false;

      },
      submited() {
        location.href = '/m/teacher_guide.html';
      },
      closeTip(t) {
        let _this = this;
        if (t === 0) {
          _this.isShow = false;

          $.ajax({
            cache: false,
            async: true,
            url: '/api/mg/content/course/close_guide?_=' + Date.now(),
            type: 'post',
            dataType: 'json',
            data: encrypt.ajax({}),
            success(response) {
              console.log(response);
              try {
                if (response.code === 0) {
                  //不做处理 在外层关闭模版 以免长时间等待或服务端出错
                }
              } catch (err) {
                // 这个try-catch不要去掉，因为有异常时会阻止强制跳转
              }
            },
            error(error) {
              console.error(error);
            }
          });
        } else if (t === 1) {
          _this.showTipTag = false;
        }
      }
    },
    components: {
      userChoseMsg,
      closeTip
    }
  };
</script>

<style lang="sass" lang="scss" scoped>
  .ui-all {
    .ui-model-box {

    }
    .ui-bg-box {
      background-color: #fff;
      padding-left: 0.1rem;
    }
    .ui-close-btn {
      width: 0.16rem;
      height: 0.16rem;
      position: absolute;
      left: 3.045rem;
      margin-top: -0.515rem;
    }
    .ui-cover-btn-s {
      width: 2.4rem;
      height: 0.26rem;
      position: absolute;
      margin-left: 0.5rem;
      margin-top: -0.56rem;
    }
    .ui-cover-btn-b {
      width: 1.44rem;
      height: 0.32rem;
      position: absolute;
      margin-left: 1.65rem;
      margin-top: -0.74rem;
    }

  }

</style>
