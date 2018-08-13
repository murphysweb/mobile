<template>
<div>
  <div class="search_top clearfix" :style="bgstyle">
    <a class="left_icon_container" @click="Nativeback">
        <span class="home_arrow"></span>
      </a>
    <form type="search" action="" target="nm_iframe" @submit="submits">
      <div class="search_con search_button april_border hairlines" :style="isApp ? 'padding-right: 40px;':''">
        <div class="border_inner"></div>
        <div class="search_input_con">
          <span class="search_icon"></span>
          <input type="search" name="q" :placeholder="placeholder" class="search_input" v-model="search_input" @input="searchLike" @keyup.enter="submits" autocomplete="off">
          <input id="hiddenText" type="text" style="display:none" />
        </div>
      </div>
      <span v-if="!isApp" class="search_btn" data-dav-tj="" @click="submits">搜索</span>
      <!-- 如果是APP这里是分享按钮 -->
      <span v-if="isApp" @click="sharesearch" class="share_search"></span>
    </form>
    <iframe name="nm_iframe" id="nm_iframe" style="display: none;"></iframe>
  </div>

</div>
</template>

<style scoped>
.search_top .search_con {
  padding-right: 54px;
  padding-left: 44px;
  height: 32px;
}

.search_top .share_search {
  right: 0;
  z-index: 10;
  position: absolute;
  width: 40px;
  height: 44px;
  background-image: url(//9i.dvmama.com/free/mobile/src/common/img/title-btn-share.png);
  background-size: 100%;
  background-position: center;
}

input[type="search"] {
  -webkit-appearance: none;
}

input::-webkit-search-cancel-button {
  display: none;
}

.search_top {
  position: relative;
  z-index: 2;
  background-color: #F0F0F0;
}

.search_top .search_con .search_input {
  color: #333333;
}
</style>

<script>
import ua from '../src/common/js/module/ua.js';
import native from '../src/common/js/module/native.js';

export default {
  props: ["placeholder", "searchinput"],
  data: function() {
    return {
      search_input: this.searchinput || '',
      isApp: ua.isDvdApp(),
      bgstyle: ua.isDvdApp() ? 'background-color: #FFF;' : ''
    }
  },
  components: {},
  mounted: function() {
    /**@param
     * 解决IOS11返回缓存 input内容丢失问题 只能操作一次
     */
    if (ua.isIos()&&ua.isMobile()) {
      window.addEventListener('pageshow', function(e) {
        let q = window.Units.getQuery('q');
        // 如果有搜索词再操作如此
        if (q) {
          if (document.getElementsByTagName('input')[0].value == '') {
            document.getElementsByTagName('input')[0].value = q;
            // location.reload();
          }
        }
      });
    }
  },
  methods: {
    // 输入时候向后台查询
    searchLike: function() {
      var scope = this;
      scope.$emit("transfersearchlike", scope.search_input);
    },
    //form提交或者点击搜索 通过子元素向父元素传递实现
    submits: function() {
      var scope = this;
      this.search_like = false;
      // window.bravetime.tj.pvSend('search_search_input', scope.search_input);
      scope.$emit("transfersearchtext", scope.search_input);
    },
    searchs: function(msg) {
      var scope = this;
      scope.$emit("transfertsearchs2", msg);
      scope.search_like = false;
      scope.searchinput = msg;
    },
    Nativeback: function() {
      if (ua.isDvdApp()) {
        native.Browser.goBack({
          needRefresh: 0,
        });
      } else {
        history.back();
      }
    },
    sharesearch: function() {
      native.custom.share();
    }
  },
  watch: {
    searchinput: function() {
      this.search_input = this.searchinput;
    }
  }
}
</script>
