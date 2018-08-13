<template>
  <div :style="{ marginTop:data.marginTop + 'px' }">
    <tt_com_0 :data="data"></tt_com_0>

    <div class="ui-bg-box" :style="styleObject">
      <div class="ui-list" v-for="item in courseList" @click="toDetail(item)">
        <div class="ui-cnt-l">
          <div class="ui-pic">
            <img v-lazy="imgObject(item.imageUrl)" width="100%" height="100%">
          </div>
        </div>
        <div class="ui-cnt-r">
          <div class="ui-cnt-title">{{item.title}}</div>
          <div class="ui-cnt-name">{{item.teacherName}}</div>
          <div class="ui-cnt-time" :class="{'ui-h-36':item.title.length<14}">{{item.timeStatus}}</div>
          <div class="ui-cnt-info">
            <div>{{item.coursePrice}}元 / {{item.courseNum}}节课</div>
            <div>{{item.ticketNum}}人已报名</div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
  import layout from '../layout.es6';
  import * as tt_com_0 from './tt_com_0.vue'

  export default {
    name: 'bd_course_supervisor',
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
      _this.title = _this.data.title;
      _this.courseList = _this.data.body.dataList;
    },
    
    methods: {
      imgObject: function(imgSrc) {
        return {
          src: imgSrc || '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
          error: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
          loading: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png'
        };
      },
      toDetail(t) {
        console.log(t);
        let url = t.command.content;
        location.href = url;
      },
      toAll() {
        let url = this.title.command.content;
        location.href = url;
      },
    },
    components: {
      tt_com_0:tt_com_0
    },
  };
</script>

<style lang="sass" lang="scss" scoped>
  .ui-bg-box {
    width: 3.35rem;
    padding: 0 0.2rem 0.1rem 0.2rem;
    /*background-color: #ffffff;*/
    font-size: 0;
    .ui-title {
      font-size: 0;

      .ui-title-left {
        font-size: 0.2rem;
        color: #333333;
        height: 0.28rem;
        line-height: 0.28rem;
        display: inline-block;
        box-sizing: border-box;
      }

      .ui-title-right {
        font-size: 0.11rem;
        color: #666666;
        height: 0.3rem;
        line-height: 0.3rem;
        display: inline-block;
        box-sizing: border-box;
        float: right;
      }

    }

    .ui-list {
      .ui-cnt-l {
        display: inline-block;
        box-sizing: border-box;
        .ui-pic {
          width: 1.2rem;
          height: 0.9rem;
          img {
            border-radius: 0.04rem;
          }
        }
      }
      .ui-cnt-r {
        width: 2.05rem;
        margin-left: 0.1rem;
        float: right;
        font-size: 0;
        .ui-cnt-title {
          width: 2.05rem;
          height: 0.2rem;
          line-height: 0.2rem;
          font-size: 0.14rem;
          color: #333333;
          font-weight: 500;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        .ui-cnt-info {
          color: #999999;
          font-size: 0;
          height: 0.17rem;
          line-height: 0.17rem;
          margin-top:0.02rem;
          div {
            font-size: 0.12rem;
            display: inline-block;
          }
          div:nth-child(1) {
            padding-right: 0.1rem;
            color:#FF4A7D;
            float: left;
          }
          div:nth-child(2) {
            padding-left: 0.1rem;
            float: right;
          }
        }
        .ui-cnt-name {
          height: 0.17rem;
          /*margin-top: 0.03rem;*/
          font-size: 0.12rem;
          color: #333;
          line-height: 0.2rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        .ui-cnt-time {
          height: 0.38rem;
          /*margin-top: 0.03rem;*/
          font-size: 0.12rem;
          color: #999;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .ui-h-36{
          height: 0.36rem;
        }
      }
    }
  }
</style>
