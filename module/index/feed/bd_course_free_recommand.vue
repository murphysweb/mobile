<template>
  <div :style="{ marginTop:data.marginTop + 'px' }">
    <div class="ui-bg-box" :style="styleObject">

      <div class="ui-title">
        <div class="ui-title-left">{{title.leftTitle}}</div>
        <div class="ui-title-right" @click="toAll()">
          <span>{{title.right.title}}</span>
          <i class="dav_icon_arrow"></i>
        </div>
      </div>

      <div class="ui-remand">{{courseInfo.recommandDesc}}</div>

      <div class="ui-cnt" @click="toDetail()">
        <div class="ui-cnt-l">
          <div class="ui-pic">
            <img  v-lazy="imgObject(courseInfo.cover)" width="100%" height="100%">
          </div>
        </div>
        <div class="ui-cnt-r">
          <div class="ui-cnt-title">{{courseInfo.title}}</div>
          <div class="ui-cnt-info">
            <span>{{courseInfo.teacherName}}</span>
            <span>{{courseInfo.pv}}人气</span>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
  import layout from '../layout.es6';
  export default {
    name: 'bd_course_free_recommand',
    data() {
      return {
        title: {}, // 模版标题
        courseInfo: {} // 内容信息
      };
    },
    props: ['data'],
    created() {
      let _this = this;
      _this.styleObject = layout.styleObjectDvk(_this.data);
      _this.title = _this.data.body.titleInfo;
      _this.courseInfo = _this.data.body.courseInfo;
    },
    methods:{
      toDetail() {
        let url = this.courseInfo.command.content;
        location.href = url;
      },
      toAll() {
        let url = this.title.right.command.content;
        location.href = url;
      },
      imgObject:function (imgSrc) {
        return{
          src: imgSrc || '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
          error: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
          loading: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png'
        }
      },
    }
  };
</script>

<style lang="sass" lang="scss" scoped>
  .ui-bg-box {
    width: 3.35rem;
    padding: 0.2rem;
    background-color: #ffffff;
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
    .ui-remand{
      width: 3.35rem;
      line-height:0.2rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: 0.14rem;
      color: #333333;
    }

    .ui-cnt {
      font-size: 0;
      margin-top: 0.1rem;
      .ui-cnt-l {
        display: inline-block;
        box-sizing: border-box;
        /*float: left;*/
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
          line-height: 0.2rem;
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
