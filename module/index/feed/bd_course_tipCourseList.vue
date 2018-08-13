<template>
  <div :style="{ marginTop:data.marginTop + 'px' }">
    <div class="ui-bg-box" :style="styleObject">
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
  import bus from '../bus.js';

  // todo 因为实现技术同步app此模版暂时弃用不排除后续会继续使用
  export default {
    name: 'bd_course_tip-course-list',
    data() {
      return {
        courseList: [] // 内容列表
      };
    },
    props: ['data'],
    created() {
      let _this = this;
      _this.styleObject = layout.styleObjectDvk(_this.data);
      _this.courseList = _this.data.body.courseList;
      bus.$on('changeSelectedTip', (data) => {
        console.log(data);
        console.log('请求新的假数据');
        let courseList = [
          {
            cover: 'https://9i.dvmama.com/free/2017/08/11/1125_780_ead31721dfff7e9184f26551a2b4f6bd.jpg?x-oss-process=image/resize,m_fill,w_516,h_360/format,webp',
            pv: '37万',
            teacherName: '英语专家吴敏兰',
            time: '2017-05-03 21:00:29',
            title: data,
            command: {
              content: '/course-1012.html'
            }
          },
          {
            cover: 'https://9i.dvmama.com/free/2017/08/11/1125_780_ead31721dfff7e9184f26551a2b4f6bd.jpg?x-oss-process=image/resize,m_fill,w_516,h_360/format,webp',
            pv: '37万',
            teacherName: '英语专家吴敏兰',
            time: '2017-05-03 21:00:29',
            title: 'test111（二）',
            command: {
              content: '/course-1012.html'
            }
          }
        ];
        _this.courseList = courseList;
      });
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
      }
    }
  };
</script>

<style lang="sass" lang="scss" scoped>
  .ui-bg-box {
    width: 3.35rem;
    padding: 0.05rem 0.2rem;
    background-color: #ffffff;
    font-size: 0;
    .ui-list {
      font-size: 0;
      margin-bottom: 0.1rem;
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
          height: 0.4rem;
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
          height: 0.32rem;
          /*margin-top: 0.03rem;*/
          font-size: 0.12rem;
          color: #333;
        }
      }
    }
  }

</style>
