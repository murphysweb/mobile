<template>
  <div class="window" v-show="show_self">
    <div class="mask" @click="close"> </div>
    <div class="introduceContent">
      <div class="introduceTitle">
        <p>添加邀请人</p>
      </div>
      <div class="introducePhoneNum">
        <input class="iphoneInput" v-model="iphoneNum" type="number" onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]/" oninput="if(value.length>11)value=value.slice(0,11)" name="q" placeholder="请输入手机号" autocomplete="off">
      </div>
      <div class="introduceInfo">
        <p>*提交后不可修改，请与邀请人核实后准确填写手机号</p>
        <p>*如有疑问，请联系客服</p>
      </div>
      <div class="sumitLine"></div>
      <div class="introduceSumit" @click="introduceSumit">
        提交
      </div>
    </div>
  </div>
</template>

<script>
import encrypt from "dvd-service-js-encrypt";
import popup from "dvd-service-js-popup";
import util from "../utils/utils.es6";
export default {
  name: "introduce-input",
  props: {
    showInviteModel: {},
    seriesId: {}
  },
  data() {
    return {
      show_self: false,
      iphoneNum: ""
    };
  },

  watch: {
    showInviteModel() {
      this.show_self = this.showInviteModel;
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    introduceSumit() {
      let _this = this;
      let phoneNum = String(_this.iphoneNum);
      if (phoneNum.length != 11) {
        popup.toast("请输入正确的手机号～");
        return;
      }
      let data = {
        mobilePhone: phoneNum,
        seriesId: String(_this.seriesId)
      };
      console.log(data);
      $.ajax({
        cache: false,
        async: true,
        type: "post",
        url: "/api/mg/content/series_course/addInviter?_=" + Date.now(),
        dataType: "json",
        data: encrypt.ajax(data),
        success: function(result) {
          if (result.code === 0) {
            //提交成功
            _this.$emit("success");
          } else {
            //提交失败
            popup.toast(result.data.msg);
          }
        },
        error: function(error) {
          popup.toast(error);
        }
      });
    }
  }
};
</script>


<style scoped>
.window {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  text-align: center;
  overflow-y: scroll;
  z-index: 1;
  animation: act 500ms !important;
}

@keyframes act {
  0% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.introduceContent {
  position: relative;
  width: 300px;
  height: 200px;
  margin: auto;
  top: 25%;
  background: url("//9i.dvmama.com/free/2018/06/15/1.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: 3;
}

.introduceTitle {
  position: relative;
  width: 100%;
  height: 20px;
  top: 18px;
  text-align: center;
  color: #333333;
  font-size: 14px;
}

/* .introducePhoneNum {
  position: relative;
  height: 0.4rem;
  width: 1.4rem;
  margin: auto;
  top: 40px;
} */

.iphoneInput {
  position: relative;
  width: 140px;
  height: 40px;
  top: 40px;
  text-align: center;
  font-size: 18px;
  color: #666666;
  background: url("//9i.dvmama.com/free/2018/06/15/introducePhoneNum.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #cbcbcb;
}
input:-moz-placeholder,
textarea:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #cbcbcb;
}
input::-moz-placeholder,
textarea::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #cbcbcb;
}
input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #cbcbcb;
}

.introduceInfo {
  position: relative;
  width: 96%;
  height: 30px;
  top: 50px;
  margin: auto;
  text-align: left;
  font-size: 12px;
  color: #999999;
  transform: scale(0.9);
}

.sumitLine {
  position: relative;
  width: 97%;
  height: 2px;
  top: 65px;
  margin: auto;
  background-color: #cbcbcb;
}

.introduceSumit {
  position: relative;
  width: 100%;
  height: 30px;
  top: 75px;
  font-size: 14px;
}
</style>
