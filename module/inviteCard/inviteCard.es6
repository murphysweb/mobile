import common from '../common/common.es6';
import login from 'dvd-service-js-login';

export default {
  data() {
    return {
      flag: true,
      msg: '',
      styleObject: {
        maxHeight: document.documentElement.clientHeight - 155 + 'px'
      },
      type: 0,
      imgUrl: '//9i.dvmama.com/free/2018/05/15/Mask.png',
      income: 0,
      password: '',
      visitor: null,
      inApp: window.Units && Units.isApp(),
      canShare: false
    };
  },
  computed: {
    showCard: function() {
      // console.log(this.show);
      return this.show;
    },
    courseId: function() {
      return this.id;
    },
    seriesId: function() {
      return this.id;
    },
    url: function() {
      if (this.kind == 0) {
        return '/api/mg/content/course/shareCard';
      }
      return '/api/mg/content/series_course/share_card';
    },
    obj: function() {
      if (this.kind == 0) {
        return {
          courseId: this.courseId
          // courseId: 1449
        };
      }
      return {
        seriesId: this.seriesId
      };
    }
  },
  watch: {
    'showCard': function(val) {
      var that = this;
      console.log(that.obj)
      console.log(that.url)
      setTimeout(function() {
        if (that.showCard) {
          if (that.flag) {
            console.log('发送分享卡请求');
            common.getDataWithSign({
              url: that.url,
              dataType: 'json',
              type: 'post',
              data: that.obj,
              updata: that.obj,
              success: function(result) {
                console.log('result->>>1111111111', result);
                if (result && result.visitor_status) {
                  that.visitor = result.visitor_status;
                }
                let {code, data} = result;
                if (data) {
                  var {course, imgUrl} = data;
                }

                if (+code) {
                  bravetime.info('分享卡数据获取异常:' + code);
                  that.showFlag = false;
                } else {
                  that.imgUrl = imgUrl;
                  // 判断是否显示听课券
                  if(data.listenCodeInfo.isSet === 0){
                    that.canShare = false;
                  }else if(data.listenCodeInfo.isSet === 1){
                    that.canShare = true;
                  }
                  console.log(that.canShare)
                  if (that.kind == 0) {
                    let {code, income, type} = course;
                    that.type = type;
                    that.income = income;
                    that.password = code;
                    that.flag = false;
                  } else if (that.kind == 1) {
                    let {income} = course;
                    that.income = income;
                    that.flag = false;
                  }

                }
              },
              error: function() {

              }
            });
          }
        }
      }, 0);
      if (val) {
        // 在app中调用app分享卡
        if (window.Units && Units.isApp()) {
          bravetime.callCardShare(this.courseId);//判断是否在app，以及升级app
          this.closeCard();//h5弹窗关闭，但是在app中页面还是正常显示的
        }
        // 分享统计

        common.postStatisticsData({
          production: that.inApp ? '2' : '3',
          action_type: that.statistics + ''
        });
      }
    }
  },
  props: ['show', 'id', 'statistics', 'kind'],
  methods: {
    closeCard() {
      this.$emit('close');
    },
    toFreeCourseCode() {
      let _this = this;
      let userId = login.getUserId(); // 分享者用户id
      let courseId = _this.courseId; // 课程id
      location.href = '/m/free_course_code.html?userId=' + userId + '&courseId=' + courseId;
    }
  },
  created() {

  }
};
