<template>
  <div :style="{ marginTop:data.marginTop + 'px' }">
    <div class="ui-bg-box" :style="styleObject">

      <div class="ui-title">
        <div class="ui-title-top">{{title.leftTitle}}</div>
        <div class="ui-title-bottom">
          <div @click="toVSchoolClass(item.command.content,item.title)" class="ui-title-bottom-tag"
               v-for="(item,index) in title.middleTitleList"
               v-if="index <= 2">
            <span>#{{item.title}}#</span>
          </div>
          <div class="ui-title-right" @click="toVSchool(title.right.command.content)">
            <span>{{title.right.title}}</span>
            <i class="dav_icon_arrow"></i>
          </div>
        </div>
      </div>

      <div class="ui-list" v-for="item in courseList" @click="toDetail(item)">
        <div class="ui-cnt-l">
          <div class="ui-pic">
            <img v-lazy="imgObject(item.cover)" width="100%" height="100%">
          </div>
        </div>
        <div class="ui-cnt-r">
          <div class="ui-cnt-title">{{item.title}}</div>
          <div class="ui-cnt-last">{{item.teacherName}}</div>
          <div class="ui-cnt-info">
            <span>{{item.pv}}人气</span>
            <span>{{item.time}}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import layout from '../layout.es6';

  export default {
    name: 'bd_course_recommand',
    data() {
      return {
        title: {}, // 模版标题
        courseList: [] // 内容列表
      };
    },
    props: ['data'],
    created() {
      let _this = this;
      _this.styleObject = layout.styleObjectDvk(_this.data);
      _this.title = _this.data.body.titleInfo;
      _this.courseList = _this.data.body.courseList;
    },
    methods: {
      toDetail(t) {
        console.log(t);
        let url = t.command.content;
        location.href = url;
      },
      imgObject: function(imgSrc) {
        return {
          src: imgSrc || '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
          error: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
          loading: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png'
        };
      },
      toVSchoolClass(url, t) {
        console.log(url);
        console.log(t);
        location.href = url + '&title=' + t;
      },
      toVSchool(url) {
        console.log(url);
        location.href = url;
      }
    }
  };
</script>

<style lang="sass" lang="scss" scoped>
  .ui-bg-box {
    width: 3.35rem;
    padding: 0.2rem;
    background-color: #ffffff;
    font-size: 0;
    .ui-title {
      .ui-title-top {
        font-size: 0.2rem;
        color: #333333;
        height: 0.28rem;
        line-height: 0.28rem;
      }
      .ui-title-bottom {
        margin-top: 0.1rem;
        font-size: 0;
        min-height: 0.2rem;
        .ui-title-bottom-tag:first-child {
          margin-left: 0;
        }
        .ui-title-bottom-tag {
          width: 0.8rem;
          height: 0.24rem;
          line-height: 0.24rem;
          border-radius: 0.25rem;
          display: inline-block;
          box-sizing: border-box;
          color: #FF4A7D;
          background-color: #fff;
          border: solid 1px #FF4A7D;
          margin-left: 0.12rem;
          font-size: 0.12rem;
          text-align: center;
        }
        .ui-title-right {
          height: 0.16rem;
          line-height: 0.18rem;
          display: inline-block;
          box-sizing: border-box;
          border-left: solid 1px #e1e1e1;
          padding-left: 0.2rem;
          font-size: 0.12rem;
          color: #666666;
          float: right;
          position: relative;
          top: 0.05rem;
        }
      }
    }
    .ui-list {
      font-size: 0;
      margin-top: 0.1rem;
      .ui-cnt-l {
        display: inline-block;
        box-sizing: border-box;
        .ui-pic {
          width: 1.1rem;
          height: 0.76rem;
          img {
            border-radius: 0.04rem;
          }
        }
      }
      .ui-cnt-r {
        width: 2.15rem;
        margin-left: 0.1rem;
        float: right;
        font-size: 0;
        .ui-cnt-title {
          width: 2.15rem;
          height: 0.38rem;
          line-height:0.2rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          font-size: 0.14rem;
          color: #333333;
        }
        .ui-cnt-info {
          color: #999999;
          font-size: 0;
          height: 0.17rem;
          line-height: 0.26rem;
          span {
            font-size: 0.12rem;
          }
          span:nth-child(1) {
            border-right: solid 1px #E1E1E1;
            padding-right: 0.1rem;
          }
          span:nth-child(2) {
            padding-left: 0.1rem;
          }
        }
        .ui-cnt-last {
          height: 0.17rem;
          margin-top: 0.03rem;
          font-size: 0.12rem;
          color: #999;
        }
      }
    }
  }

</style>
