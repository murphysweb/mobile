<template>
  <div :style="{ marginTop:data.marginTop + 'px' }">

    <tt_com_0 :data="data"></tt_com_0>

    <div class="ui-bg-box" :style="styleObject">
      <div class="ui-tip-list" :style="{width:(list.length+1) * 1+'rem'}">
        <div class="ui-tip" :class="{'ui-tip-act':item.selectStatus == 1}" v-for="item in list"
             @click="selectTip(item)">{{item.title}}
        </div>
        <div class="ui-tip ui-tip-right"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import layout from '../layout.es6';
  import bus from '../bus.js';
  import * as tt_com_0 from './tt_com_0.vue';

  export default {
    name: 'bd_course_index_recommend_category',
    props: ['data'],
    data() {
      return {
        list: []
      };
    },
    created() {
      let _this = this;
      _this.styleObject = layout.styleObjectDvk(_this.data);
      _this.list = _this.data.body.titleList;
      _this.list.forEach((item) => {
        _this.$set(item, 'selectStatus', 0);
      });
      _this.$set(_this.list[0], 'selectStatus', 1);
    },
    methods: {
      selectTip(i) {
        let _this = this;
        if (i.selectStatus && i.selectStatus === 1) {
          return;
        } else {
          let id = i.catId;
          _this.list.forEach((item) => {
            _this.$set(item, 'selectStatus', 0);
            if (item.catId == id) {
              _this.$set(item, 'selectStatus', 1);
            }
          });
          bus.$emit('changeSelectedTip', id);
        }

      }
    },
    components: {
      tt_com_0: tt_com_0
    }
  };
</script>

<style lang="sass" lang="scss" scoped>
  .ui-bg-box {
    font-size: 0;
    width: 100%;
    height: 0.4rem;
    overflow: scroll;
    .ui-tip-list {
      margin-top: 0.1rem;
      .ui-tip {
        font-size: 0.12rem;
        height: 0.12rem;
        line-height: 0.12rem;
        display: inline-block;
        /*min-width: 0.6rem;*/
        padding: 0.04rem 0.06rem;
        margin-left: 0.2rem;
        float: left;
        text-align: center;
        color: #333;
        border-radius: 0.25rem;
        border: solid 1px #333;
      }

      .ui-tip-act {
        color: #FF4A7D;
        border: solid 1px #FF4A7D;
      }
      .ui-tip-right {
        /*min-width: 0.6rem;*/
        border: none;
      }
    }

  }

</style>
