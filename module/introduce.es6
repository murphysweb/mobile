import vSchoolTitle from '../module/vSchoolTitle.vue';
import indexFeed from './index/index_feed.vue';
import inviteCard from './inviteCard/inviteCard.vue';
import common from './common/common.es6';
import lay from './layout/api.es6';
import native from '../src/common/js/module/native.js';
import ua from '../src/common/js/module/ua.js';
import logined from '../src/common/js/module/login.js';
import iosPay from '../src/common/js/module/iosPay.js';
import popup from 'dvd-service-js-popup';
import appInterface from '../utils/appInterface.es6';
import util from '../utils/utils.es6';
import {getQuery} from '../utils/utils.es6';
import native_box from '../src/common/js/module/native_box.js';


let axios = require('axios');
require('babel-polyfill');
require('es6-promise').polyfill();
common.initShare(16);
export default {
  data() {
    return {
      util: util,
      logined: logined,
      ua: ua,
      isLogined: logined.isLogined(),
      pv: '',
      inviteShow: false,
      courseId: window.courseId,
      feedData: [],
      userRole: -1,
      userTicket: -1,
      type: -1,
      money: '',
      income: '',
      error: false,
      inApp: window.Units && Units.isApp(),
      homeLink: common.baseJumpUrl().courseHomePage,
      shareUserId: window.shareUserId || 0,
      entered: 0,
      visitor_status: -1,
      deleteFlag: true,
      teacherId: null,
      userId: null,
      cmd: null,
      cache: false,
      bottomBtn: false,
      enterClassroomFlag: true,
      visitorFlag: -1,
      name: 'introduce',
      isAuditing: false, //ios审核
      response: null,
      growthBox: 0,
      ajaxUrl: '',
      isApp: util.utils.isApp(),
      showBottomTip: false, // 控制显示底部分享卡
      isEnglish: '',
      goodsId: '',
      isSupervisor: 0
    };
  },
  created() {
    util.utils.backReloadPage();
    let that = this;
    // 安卓判断登录
    let isAndroid = ua.isAndroid();
    let isApp = ua.isDvdApp();
    if ((isAndroid === true) && (isApp === true)) {
      if (logined.isLogined() === false) {
        that.visitorFlag = 0;
      }
    }
    //  用通用方法请求数据
    // console.log(common);
    this.$nextTick(function() {
      if (ua.isDvdApp() && ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') < 0) {
        $('.body').css('paddingBottom', '0');
      }
    });
    if (getQuery('growthBox')) {
      this.growthBox = 1;
      this.ajaxUrl = '//box.api.davdian.com/content/course/getDetailData';
    } else {
      this.growthBox = 0;
      this.ajaxUrl = '/api/mg/content/course/detail';
    }
    common.getDataWithSign({
      url: that.ajaxUrl,
      dataType: 'json',
      updata: {courseId: that.courseId},
      type: 'post',
      success: function(result) {
        that.response = result;
        if (that.response.data.course.isLC === 0) {
          that.showBottomTip = false;
        } else if (that.response.data.course.isLC === 1) {
          that.showBottomTip = true;
        }
        // 判断是否展示底部提示方法
        that.isShowBottomTip();

        if (result.data.userId) {
          that.userId = result.data.userId;
          window.userId = result.data.userId;
          window.userTicket = result.data.userTicket;
          window.userTicket = result.data.userTicket;
          that.isEnglish = result.data.isEnglish;
          if (that.isEnglish == 1) {
            that.goodsId = result.data.goodsId;
          }
        }
        if (result == '') {
          that.error = true;
          return false;
        }
        if (result.visitor_status == 0) {
          if (ua.isDvdApp()) {
            if (ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') < 0) {
              native.Browser.setHead({shareBtn: '0'});
            } else {
              native.Browser.setHead({
                isAudioAbsorb: '1',
                isShowAudio: '1',
                'hideHead': '1'
              });
            }
          }
        }
        let {code, data, visitor_status} = result;
        if (+code) {
          if (code == 30024) {
            that.deleteFlag = false;
            that.cmd = result.data.cmd;
            // that.teacherId = result.data.teacherId
          } else {
            if (code == 30000) {
              that.visitor_status = 0;
              that.visitorFlag = 0;
              if (ua.isDvdApp()) {
                if (ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') < 0) {
                  native.Browser.setHead({shareBtn: '0'});
                } else {
                  native.Browser.setHead({
                    isAudioAbsorb: '1',
                    isShowAudio: '1',
                    'hideHead': '1'
                  });
                }
              }
            } else {
              that.error = true;
              bravetime.info('数据获取异常' + code);
            }
          }
        } else {
          let {userRole, userTicket, isSupervisor, course: {type, money, income}, feedList} = data;
          for (let i = 0; i < feedList.length; i++) {
            if (feedList[i].body.tplId == 'title_0' && money) {
              feedList[i].body.come = money;
            }
          }
          that.feedData = feedList;
          that.userRole = userRole;
          that.userTicket = userTicket;
          that.type = type;
          that.money = money;
          that.income = income;
          that.visitor_status = visitor_status;
          //督导课区分
          if (isSupervisor) {
            that.isSupervisor = isSupervisor;
            setTimeout(function() {
              if (window.backNewData) {
                window.backNewData.$children.map(function(item) {
                  if (item.name == 'introduce') {
                    item.$children.map(function(item2) {
                      if (item2.childrenName == 'feedList') {
                        item2.$children.map(function(item3) {
                          if (item3.name == 'bd_course_info_series_0') {
                            console.log(that.isSupervisor);
                            item3.isSupervisor = that.isSupervisor;
                          }
                        });
                      }
                    });
                  }
                });
              }
            }, 1000);
          }
          //
          that.$nextTick(function() {
            $('img').each(function(index, ele) {
              window.singlePicHold(ele);
            });
          });
          that.$nextTick(function() {
            that.changeIsAuditVersion(result.data.isAuditVersion);
            if (result.data.isAuditVersion == 0) {
              that.isAuditing = true;
            } else if (result.data.isAuditVersion == 1) {
              that.isAuditing = false;
            }
          });
        }
        if (window.appData) {
          window.appData.isShowAudio = 1;
        } else {
          window.appData = {
            'isShowAudio': 1
          };
        }
        if (!that.error && that.deleteFlag) {
          if (window.appData) {
            window.appData.isAudioAbsorb = 1;
          } else {
            window.appData = {
              'isAudioAbsorb': 1
            };
          }
          setTimeout(function() {
            window.appData.backOnHead = 1;
            if (ua.isDvdApp()) {
              if (ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') < 0) {
                window.bravetime.initHead();
              } else {
                native.Browser.setHead({
                  isAudioAbsorb: '1',
                  isShowAudio: '1',
                  'hideHead': '1'
                });
              }
            }
          }, 500);
        }
      },
      error: function() {
        that.error = true;
      }
    });


    window.sendShareCallback = window.tlShareCallback = function() {
      common.getDataWithSign({
        url: '/api/mg/community/earning/shareLink',
        dataType: 'json',
        updata: {type: 2},
        type: 'post',
        success: function(result) {

        },
        error: function() {
          that.error = true;
        }
      });
    };
  },
  methods: {
    goAppClassroom() {
      var that = this;
      if (that.growthBox == 1 && ua.compareVersion(ua.getDvdAppVersion(), '1.1.0') < 0) {
        popup.toast('请升级客户端到最新版本后使用此功能');
        return;
      }
      if (this.isApp) {
        native_box.VoiceLive.enterRoom({
          'courseId': that.courseId
        });
      }
    },
    changeIsAuditVersion(data) {
      var flag = false;
      if (data == 0) {
        flag = true;
      } else if (data == 1) {
        flag = false;
      }
      if (window.backNewData) {
        window.backNewData.$children.map(function(item) {
          if (item.name == 'introduce') {
            item.$children.map(function(item2) {
              if (item2.childrenName == 'feedList') {
                item2.$children.map(function(item3) {
                  if (item3.name && item3.name == 'title_0') {
                    item3.isAuditing = flag;
                  }
                });
              }
            });
          }
        });
      }
    },
    appUpData() {
      let that = this;
      //  用通用方法请求数据
      common.getDataWithSign({
        url: '/api/mg/content/course/detail',
        dataType: 'json',
        updata: {courseId: that.courseId},
        type: 'post',
        success: function(result) {
          if (result.data.userId) {
            that.userId = result.data.userId;
            window.userId = result.data.userId;
            that.isEnglish = result.data.isEnglish;
            if (that.isEnglish == 1) {
              that.goodsId = result.data.goodsId;
            }
          }
          if (result == '') {
            that.error = true;
            return false;
          }
          if (result.visitor_status == 0) {
            if (ua.isDvdApp()) {
              if (ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') < 0) {
                native.Browser.setHead({shareBtn: '0'});
              } else {
                native.Browser.setHead({
                  isAudioAbsorb: '1',
                  isShowAudio: '1',
                  'hideHead': '1'
                });
              }
            }
          }
          let {code, data, visitor_status} = result;
          if (+code) {
            if (code == 30024) {
              that.deleteFlag = false;
              that.cmd = result.data.cmd;
              // that.teacherId = result.data.teacherId
            } else {
              if (code == 30000) {
                that.visitor_status = 0;
                that.visitorFlag = 0;
                if (ua.isDvdApp()) {
                  if (ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') < 0) {
                    native.Browser.setHead({shareBtn: '0'});
                  } else {
                    native.Browser.setHead({
                      isAudioAbsorb: '1',
                      isShowAudio: '1',
                      'hideHead': '1'
                    });
                  }
                }
              } else {
                that.error = true;
                bravetime.info('数据获取异常' + code);
              }
            }
          } else {
            let {userRole, userTicket, course: {type, money, income}, feedList} = data;
            for (let i = 0; i < feedList.length; i++) {
              if (feedList[i].body.tplId == 'title_0' && money) {
                feedList[i].body.come = money;
              }
            }
            that.feedData = feedList;
            that.userRole = userRole;
            that.userTicket = userTicket;
            that.type = type;
            that.money = money;
            that.income = income;
            that.visitor_status = visitor_status;
            that.$nextTick(function() {
              $('img').each(function(index, ele) {
                window.singlePicHold(ele);
              });
            });
          }
          console.log(that.userId, window.teacherId);
        },
        error: function() {
          that.error = true;
        }
      });
    },
    goTeacherProfile() {
      console.log('/course-teacher-' + this.teacherId + '.html');
      if (this.cmd) {
        window.location = this.cmd;
      } else {
        alert('cmd为:', this.cmd);
      }
      // if (this.teacherId){
      //     window.location = '/course-teacher-' + this.teacherId + '.html'
      // } else {
      //     alert('teacherId数据为:', this.teacherId)
      // }
    },
    login() {
      native.Account.login();
    },
    getData() {
      window.location.reload();
    },

    invite() {
      this.inviteShow = true;
      this.showBottomTip = false;
    },
    invite1() {
      if (this.inApp) {
        native.Browser.open({
          'url': '/join_vip.html?id=348&kd_type=2&rp=course_detail&rl=inv_button'
        });
      } else {
        window.location.href = '/join_vip.html?id=348&kd_type=2&rp=course_detail&rl=inv_button';
      }
      // window.location.href = '/t-10838.html?rp=course_detail&rl=inv_button'

    },
    closeCard() {
      this.inviteShow = false;
    },
    // 普通课报名
    newEnter() {
      let arr = window.backNewData.$children[0].$children[1].$children;
      for (let a = 0; a < arr.length; a++) {
        window.backNewData.$children[0].$children[1].$children[a].userTicket = 1;
      }
    },
    enroll(code) {
      let that = this;
      let data = {
        courseId: that.courseId,
        shareUserId: that.shareUserId
      };
      if (typeof code == 'string') {
        data.code = code;
      }
      this.newEnter();

      // 成功后回调
      common.getDataWithSign({
        url: getQuery('growthBox') ? 'https://box.api.davdian.com/content/course/join' : '/api/mg/content/course/join',
        // url:getQuery("growthBox") ? "http://box.api.bravetime.net/content/course/join" :"/api/mg/content/course/join",
        updata: data,
        dataType: 'json',
        type: 'post',
        success: function(result) {
          let {code, data: {msg, payUrl, jsApi}} = result;
          if (+code) {
            if (code == 30024) {
              bravetime.info('课程已删除');
            } else {
              setTimeout(function() {
                bravetime.info(msg);
              }, 300);
            }
          } else {
            if (jsApi) {
              jsApi.jsApiParameters.dvdhref = location.href;
              bravetime.goto('http://open.davdian.com/wxpay_t2/davke_pay.php?info=' + encodeURIComponent(JSON.stringify(jsApi.jsApiParameters)));
            } else if (payUrl) {
              bravetime.nativePay(payUrl, function(flag) {
                if (flag) {
                  // 先改状态
                  that.userTicket = 1;
                  // that.userTicket = 0;
                  goCourse();
                }
              });
            } else {
              that.userTicket = '1';
              // 报名成功后进入课堂
              goCourse();
            }
            //关注老师
            if (that.type == 2) {
              let obj = {};
              obj.obj = {
                teacherId: window.teacherId
              };
              axios.post('/api/mg/content/course/follow', lay.strSign(obj))
                .then(function(respone) {
                  console.log(respone);
                })
                .catch(function(error) {
                  console.log('error:', error);
                });
            }

          }
        },
        error: function() {
          bravetime.info('网络异常，请稍后重试');
        }
      });

      function goCourse() {
        bravetime.info('报名成功');
        if (that.growthBox == 1) {
          setTimeout(function() {
            that.goAppClassroom();
          }, 1800);
        } else {
          if (that.visitor_status === 3) {
            that.showBottomTip = true;
            localStorage.setItem('clickClose', '');
          }
          setTimeout(function() {
            that.enterClassroom();
          }, 1800);
        }

      }
    },
    // 输入邀请码
    alertCode() {
      let that = this;
      bravetime.newPrompt('输入邀请码', {
        placeholder: '邀请码',
        hideCancel: true,
        hideOnClick: true,
        okLink: function(code) {
          if (code && code.length) {
            that.enroll(code);
          } else {
            bravetime.info('邀请码为空');
          }
        }
      });
    },
    // 进入课堂
    enterClassroom() {
      let that = this;
      if (!that.enterClassroomFlag) {
        return;
      }
      that.enterClassroomFlag = false;
      setTimeout(function() {
        that.enterClassroomFlag = true;
      }, 5000);
      if (this.inApp) {
        // app的话进入app指定课堂
        that.enterAppCourse();
      } else {
        if (this.userRole == 2) {
          // 是观众直接跳转
          bravetime.goto(common.baseJumpUrl().coursePage(that.courseId));
        } else {
          window.bravetime.newConfirm('发现您是这堂课程的老师哦，请打开APP继续操作', {
            okText: '打开APP',
            hideCancel: true,
            hideOnClick: true,
            okLink: function() {
              // 唤起app制定课程
              bravetime.callAppEnteroom(that.courseId);
            }
          });
        }
      }
    },
    // 购买课程
    buyClassroom() {
      // 如果是iosApp5.2.0以上，调起苹果支付
      if (util.utils.isIOS() && ua.isDvdApp() && ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') >= 0 && !logined.isSeller()) {
        iosPay.pay({
          'type': 'course',
          'courseId': this.response.data.course.courseId,
          'price': this.response.data.course.money
        });
        return;
      }
      this.enroll();
    },
    fn() {
      alert('成为大V会员，免费享受妈妈课程。');
    },
    enterAppCourse() {
      var that = this;
      // var that = this;
      // if(!that.entered) {
      // that.entered = 1;
      bravetime.enterVoiceRoom(this.courseId);
      // setTimeout(function(){
      //     that.entered = 0;
      // },1000)
      // }


    },
    payInWeixin(jsApiParameters) {
      function callpay() {
        if (typeof WeixinJSBridge == 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
          }
        } else {
          jsApiCall();
        }
      }

      function jsApiCall() {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          jsApiParameters,
          function(res) {
            WeixinJSBridge.log(res.err_msg);
            alert(res.err_code + res.err_desc + res.err_msg);
          }
        );
      }

      callpay();
    },
    // 唤起app编辑课程
    teacherMoreBtnClick() {
      native.BrowserTouch.showCourseEdit({
        marginRight: '10'
      });
    },
    //绑定商品id 的 跳转到 商品详情
    toGoodsMessage() {
      let that = this;
      window.location.href = that.goodsId + '.html';
    },
    /**
     * 关闭底部提示
     * */
    closeBottomTip(t) {
      let _this = this;
      _this.showBottomTip = false;
      // 记录用户手动关闭过
      if (t === 'click') {
        localStorage.setItem('clickClose', true);
      }
    },
    /**
     * 判断是否展示底部提示方法
     * 先由接口返回判断该用户的这节课的分享券是否已经使用
     * 如果未使用走显示逻辑
     * 如果使用了直接不显示了
     * */
    isShowBottomTip() {
      let _this = this;
      if (_this.showBottomTip === true) {
        let clickClose = localStorage.getItem('clickClose');
        if (clickClose === 'false') {
          localStorage.setItem('clickClose', '');
          _this.showBottomTip = false;
        } else {
          _this.showBottomTip = true;
        }
      }
      // console.log(_this.showBottomTip);
    }
  },
  components: {
    vSchoolTitle: vSchoolTitle,
    inviteCard: inviteCard,
    indexFeed: indexFeed,
    'com-top-title': require('../src/component/com-top-title_growthBox.vue'),
    'com-top-title-app': require('../src/component/com-top-title.vue')
  }
};
