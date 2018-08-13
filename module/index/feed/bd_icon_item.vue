<template>
  <div class="bd_icon_item" :style="{ marginTop:data.marginTop + 'px',backgroundColor:data.body.bgColor}">
    <tt_com_0 :data="data"></tt_com_0>
    <div class="ui-bg-box" :style="styleObject">

      <div class="ui-icon-box" v-for="item in list" :class="{'ui-w-25':list.length === 4,'ui-w-20':list.length === 5}">
        <a :href="item.command.content">
          <div class="ui-icon">
            <img :src="item.imageUrl" width="100%">
          </div>
        </a>

        <a :href="item.command.content">
          <div class="ui-icon-title">
            <span>{{item.title}}</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import layout from '../layout.es6';
  import * as tt_com_0 from './tt_com_0.vue'

  export default {
    name: 'bd_icon_item',
    props: ['data'],
    data() {
      return {
        list: []
      };
    },
    created() {
      let _this = this;
      // console.log(_this.data);
      _this.styleObject = layout.styleObjectDvk(_this.data);
      _this.list = _this.data.body.dataList;
    },
    components: {
      tt_com_0:tt_com_0
    },
  };
</script>

<style lang="sass" lang="scss" scoped>
  .bd_icon_item {
    font-size: 0;
    .ui-bg-box {
      padding: 0 0.1rem;
      .ui-icon-box {
        display: inline-block;
        min-width: 20%;
        max-width: 25%;
        .ui-icon {
          /*margin-top: 0.3rem;*/
          position: relative;
        }
        .ui-icon-title {
          margin-top: 0.08rem;
          font-size: 0.12rem;
          text-align: center;
        }
      }
    }
  }

  .ui-w-20 {
    width: 20%;
    .ui-icon {
      width: 75%;
      left: 12.5%;
    }
  }

  .ui-w-25 {
    width: 25%;
    .ui-icon {
      width: 60%;
      left: 20%;
    }
  }
</style>
