<template>
  <div class="new_kind_sort_wrap">
    <div class="kind_sort_four" :class="{flashtop:flashtop}">
      <div v-if="filterlistdata.length || JSON.stringify(filtersleft) != '{}'" class="kind_sort" :class="{flashtop:flashtop}">
        <a class="default_sort" :class="{selected:selected == 1}" @click="sorts(1)">
          <span>综合</span>
        </a>
        <a class="sales_sort" :class="{selected:selected == 2}" @click="sorts(2)">
          <span>销量优先</span>
        </a>
        <a class="price_sort" :class="{selected:selected == 3 || selected == 4}" @click="sorts(selected == 3 ? 4 : 3)">
          <span>价格</span>
          <span class="two_arrow" :class="{up:selected == 4,down:selected == 3}">
            <span class="arrow-up"></span>
            <span class="arrow-up arrow-down"></span>
          </span>
        </a>
        <a class="filter_toggle_btn" @click="sortshow" :class="{selected:(JSON.stringify(filtersleft) != '{}')}">
          <span>筛选</span>
          <span class="dav_icon_sort"></span>
        </a>
      </div>
    </div>

    <!--右侧筛选-->
    <transition name="fade">
      <div v-if="filterleft&&ismobile" class="sort_select_cover" @touchstart="filterleft = !filterleft" @touchend="filterleftclose" style="z-index: 99"></div>
      <div v-if="filterleft&&!ismobile" class="sort_select_cover" @click="filterleftclose" style="z-index: 99"></div>
    </transition>

    <transition name="slide-fade">
      <div v-if="filterleft" class="filter_container">
        <div class="category_container">
          <div class="price_filter_container">
            <div class="price_filter_text">价格区间 (元)</div>
            <div class="price_are_wrap">
              <input class="fl" type="number" id="priceMin" v-model.number="priceMin" placeholder="最低价" @input="intdot" min="0">
              <span class="to"></span>
              <input class="fr" id="priceMax" v-model.number="priceMax" type="number" placeholder="最高价" @input="intdot" min="0">
            </div>
          </div>
          <!-- 只展示前两个内容品牌和分类 分类以下的属性只展示top4，只有一个属性值的不展示-->
          <div :key="i" v-for="(item,i) in filterlistdata" class="category_item">
            <label @click="categoryitemtoggle(item.parentId)">{{item.parentName}}
              <span v-if="item.sonList.length > (i > 0 ? '7' : '10')" :alt="category_item_toggle[item.parentId]" :class="{arrow_up:!category_item_toggle[item.parentId],arrow_down:category_item_toggle[item.parentId]}"></span>
            </label>
            <div class="category_btn_list" :class="{'category_btn_list_toggle':category_item_toggle[item.parentId],'first':i===0}">
              <!-- 如果有选中的状态则其他项不再显示 -->
              <div :key="j" v-for="(lis,j) in item.sonList" v-if="lis.name !== '全部'" @click="clcik_sort2(lis.name,item.parentId)" class="category_btn all_category" :class="{selected:filtersleft[item.parentId] == lis.name}">
                <div>{{lis.name}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="filter_bottom_container">
          <div class="filter_reset_btn" @click="resets()">重置</div>
          <div class="filter_finish_btn" @click="confirms(true)">确定</div>
        </div>
      </div>
    </transition>

    <div class="bg" :class="{m144:no_goods&&!filterlistdata.length,m235:no_goods&&JSON.stringify(filtersleft) != '{}'}">
      <!--纠错词-->
      <div class="errorsWords" v-show="noFeedDataWord">以下是“
        <span class="words">{{noFeedDataWord}}</span>”的搜索结果，
        <span class="marRight">仍然搜</span>“
        <span class="err-words" @click="goIsCorrection(searchinput)">{{searchinput}}</span>”</div>
      <!--商品列表内容-->
      <index-feed :data="feedData"></index-feed>
      <div v-show="loading" class="no_more">
        商品加载中 <img src="//9i.dvmama.com/free/loading_03252.svg">
      </div>

      <div v-show="no_more&&!feedData.length" class="no_goods">
        <img src="//9i.dvmama.com/free/2017/04/25/no_goods.png" alt="">
      </div>
      <div v-show="(no_more&&feedData.length) || (no_more&&JSON.stringify(filtersleft) != '{}')" class="no_more">没有更多商品了~</div>
      <!-- 输入框搜索词搜索结果为空的时候，没有筛选词 -->
      <section v-if="JSON.stringify(filtersleft) == '{}'">

        <div v-show="no_more&&!feedData.length" class="no_more">
          <span v-if="noFeedDataKw.length != 0 ">没有找到相关商品，换个词搜搜吧～</span>
          <span v-else>没有找到相关商品，以下的商品您可能会喜欢哦～</span>
        </div>

        <!--相似搜索词-->
        <div v-show="no_more&&!feedData.length&&noFeedDataKw.length" class="keyWord">
          <p>推荐搜索词：</p>
          <div class="searchKeyWord">
            <a v-for="(item,i) in noFeedDataKw" :key="i" @click="searchsWords(item.name,item.command.content)">{{item.name}}</a>
          </div>
        </div>
        <div v-show="no_more&&!feedData.length">
          <tt_com_1 :data="dataTitle"></tt_com_1>
          <meybeyoulike :nofeeddata="noFeedDataFl"></meybeyoulike>
        </div>
      </section>
    </div>
    <div v-show="roings" class="typering">
      <spinner :type="typering" slot="value"></spinner>
    </div>
  </div>
</template>

<script>
import indexFeed from "./index/index_feed.vue";
import meybeyoulike from "./search_youlike.vue";
import tt_com_1 from "./index/feed/tt_com_1.vue";
import layout from "./index/layout.es6";
//import { Spinner } from "vux";
import Spinner from "vux/src/components/spinner/index.vue";
require("babel-polyfill");
export default {
  data: function() {
    return {
      response: null,
      data: {},
      dataTitle: {
        marginTop: "10",
        title: {
          tplId: "tt_com_1",
          bgColor: "0xFFFFFF",
          name: "为你推荐"
        }
      },
      priceMax: null,
      priceMin: null,
      ajaxing: true,

      selected: 1,
      sortType: "desc", //排序方式 默认倒叙
      sort: 1, //默认综合排序

      cateStaticStr: "dvd_search_category",

      has_more: false,
      no_more: false,
      loading: false,

      catIds: [1, 2, 3],
      catId: [],

      allData: [[], [], [], []], //存进内存的sort数据
      anymore: [
        {
          flag: false
        },
        {
          flag: false
        },
        {
          flag: false
        },
        {
          flag: false
        }
      ], //存进内存的 是否有更多数据
      typePage: [1, 1, 1, 1], // 页码

      flag: true, //筛选信息加载标示

      current: true,
      type: [],
      category_item_toggle: {},

      filterleft: false,
      filterflash: false,
      isshow: false,
      selecte_sort: -1,
      selecte_sort2: -1,
      sort_items: false,
      filters: {},
      filtersleft: {},
      filterlistdata: [],
      feedData: [], //搜索商品结果
      noFeedDataKw: [], //搜索词
      noFeedDataFl: {}, //为你推荐
      noFeedDataWord: "", //纠错词
      filterselected: false,
      submit_nodata: false,
      typering: "ios",
      roings: false,
      no_goods: false,
      scroll_top: 0
    };
  },
  props: ["urldata", "bodytouch", "flashtop", "ismobile", "searchinput"],
  components: {
    indexFeed: indexFeed,
    meybeyoulike: meybeyoulike,
    tt_com_1: tt_com_1,
    Spinner
  },
  created: function() {
    var scope = this;

    if (Units.isApp()) {
    } else {
      scope.roings = true;
    }
    var c_bind_str = window.Units.getQuery("c_bind");

    if (window.Units.getQuery("q")) {
      scope.data.keywords = window.Units.getQuery("q");
    }
    // 增加特殊处里逻辑
    if (c_bind_str) {
      scope.data.keywords = scope.data.keywords.replace(/_/g, "%");
    }
    /**
     *
     *  @读取缓存判断及读取缓存
     */
    if (window.Units.getQuery("c_bind")) {
      scope.data.c_bind = window.Units.getQuery("c_bind");
    }
    var ua = navigator.userAgent.toLowerCase();
    var patharr = JSON.parse(sessionStorage.history);
    if (patharr.length > 2) {
      var lastPath = patharr[patharr.length - 2].path;
      if (lastPath == "detail") {
        //获取了缓存的数据

        scope.current = false;
        var sortnumber = sessionStorage.getItem("sort");

        scope.selected = sortnumber;

        scope.allData = eval(sessionStorage.getItem("sort_data"));
        scope.typePage = eval(sessionStorage.getItem("sortTypePage"));
        scope.filterlistdata = eval(sessionStorage.getItem("filterlistdata"));
        scope.filters =
          JSON.parse(sessionStorage.getItem("sort_filters")) || {};
        scope.filtersleft = sessionStorage.getItem("filtersleft") || {};

        let filter = [];
        for (key in scope.filters) {
          filter.push(key + ":" + scope.filters[key]);
        }
        scope.data.filters = filter.join(",");

        if (eval(sessionStorage.getItem("sort_no_more")) != undefined) {
          scope.anymore = eval(sessionStorage.getItem("sort_no_more"));
        }
        if (sessionStorage.getItem("priceMin") != undefined) {
          scope.priceMin = sessionStorage.getItem("priceMin");
        }
        if (sessionStorage.getItem("priceMax") != undefined) {
          scope.priceMax = eval(sessionStorage.getItem("priceMax"));
        }

        scope.data.pageIndex = scope.typePage[sortnumber - 1];
        scope.feedData = scope.allData[sortnumber - 1];
        scope.no_more = scope.anymore[sortnumber - 1].flag;

        scope.data.priceMax = scope.priceMax || null;
        scope.data.priceMin = scope.priceMin || null;
        scope.data.sort = sortnumber;

        if (/iphone|ipad|ipod/.test(ua)) {
          setTimeout(function() {
            document.body.scrollTop = eval(sessionStorage.getItem("sortTop"));
          }, 0);
        }
        scope.roings = false;
        if (!scope.no_more) {
          scope.scrollListener();
        }
      } else {
        sessionStorage.removeItem("sort_data");
        sessionStorage.removeItem("sort_filters");
        sessionStorage.removeItem("priceMin");
        sessionStorage.removeItem("priceMax");
        sessionStorage.removeItem("sortTypePage");
        sessionStorage.removeItem("sort_no_more");
        sessionStorage.removeItem("sort");
        scope.roings = false;
      }
    }
    if (scope.current) {
      scope.init();
    }
  },

  computed: {},
  methods: {
    /*初始化*/
    init: function() {
      var scope = this;
      if (scope.data.keywords) {
        scope.data.pageIndex = 1;
        scope.data.sort = window.Units.getQuery("sort") || 1;
        scope.data.sortType = window.Units.getQuery("sortType") || "";
        scope.data.priceMin = window.Units.getQuery("priceMin") || "";
        scope.data.priceMax = window.Units.getQuery("priceMax") || "";
        scope.priceMin = window.Units.getQuery("priceMin") || "";
        scope.priceMax = window.Units.getQuery("priceMax") || "";
        //初始化的检索条件不只是搜索关键词，还包括筛选项
        var filters = window.Units.getQuery("filters");

        if (filters) {
          scope.data.filters = filters;
          var filter_arr = filters.split(",");
          for (var i = 0; i < filter_arr.length; i++) {
            let fil = filter_arr[i].split(":");
            if (fil.length < 3) {
              Vue.set(scope.filters, fil[0], fil[1]);
            } else {
              Vue.set(scope.filters, fil[0] + ":" + fil[1], fil[2]);
            }
          }
        }
        scope.selected = scope.data.sort;
        sessionStorage.setItem("sort", scope.data.sort);
        sessionStorage.removeItem("sort_filters");
        sessionStorage.removeItem("filterlistdata");
        sessionStorage.removeItem("priceMin");
        sessionStorage.removeItem("priceMax");
        sessionStorage.removeItem("sortTypePage");
        sessionStorage.removeItem("sort_no_more");
        scope.change(scope.data.sort - 1);
      }
    },
    //判断是否点击搜索词
    goIsCorrection(msg) {
      var scope = this;
      this.$emit("transfertsearchs", msg, null, 1);
    },
    /*搜索词点击事件*/
    searchsWords: function(msg, url) {
      this.$emit("transfertsearchs", msg, url);
    },
    /**
     *
     * @切换状态（综合 销量 价格）
     */
    sorts: function(type) {
      var scope = this;
      scope.roings = true;
      if (type == 4) {
        scope.data.sort = 3;
      } else {
        scope.data.sort = type;
      }
      var number = type - 1;
      sessionStorage.setItem("sort", type);
      //综合排序
      if (type == 1) {
        scope.selected = 1;
        scope.data.sortType = "desc";
        scope.no_more = scope.anymore[number].flag;
        scope.ajaxing = true;
        if (scope.allData[number].length == 0) {
          scope.change(number);
        } else {
          scope.feedData = scope.allData[number];
          scope.data.pageIndex = scope.typePage[number];
          scope.no_more = scope.anymore[number].flag;
          scope.roings = false;
        }
      } else if (type == 2) {
        //销量
        scope.selected = 2;
        scope.data.sortType = "desc";
        scope.no_more = scope.anymore[number].flag;
        scope.ajaxing = true;
        if (scope.allData[number].length == 0) {
          scope.change(number);
        } else {
          scope.feedData = scope.allData[number];
          scope.data.pageIndex = scope.typePage[number];
          scope.roings = false;
        }
      } else if (type == 3) {
        //价格  倒叙
        scope.selected = 3;
        scope.data.sortType = "desc";
        scope.no_more = scope.anymore[number].flag;
        scope.ajaxing = true;
        if (scope.allData[number].length == 0) {
          scope.change(number);
        } else {
          scope.feedData = scope.allData[number];
          scope.data.pageIndex = scope.typePage[number];
          scope.roings = false;
        }
      } else if (type == 4) {
        //价格 正序
        scope.selected = 4;
        scope.data.sortType = "asc";
        scope.no_more = scope.anymore[number].flag;
        scope.ajaxing = true;
        if (scope.allData[number].length == 0) {
          scope.change(number);
        } else {
          scope.feedData = scope.allData[number];
          scope.data.pageIndex = scope.typePage[number];
          scope.roings = false;
        }
      }
    },
    //滚动事件
    scrollListener: function() {
      var scope = this;
      $(window).scroll(function() {
        //滚动条滚动事件
        var top = document.body.scrollTop;
        sessionStorage.setItem("sortTop", top);
        var offset = window.pageYOffset; //文档现在的位置加上窗口的高度
        var offsetTop = document.body.scrollHeight; //整个页面的高度
        if (offsetTop - offset - window.screen.availHeight < 100) {
          //如果滚动条到一定位置
          if (!scope.no_more) {
            scope.loading = true;
            scope.getGoodsData(scope.data, function(data) {
              scope.has_more = data.feedList.length > 4;
              scope.feedData = (scope.feedData || []).concat(data.feedList);
              var numbers = scope.data.sort - 1;
              scope.allData[numbers] = scope.allData[numbers].concat(
                data.feedList
              );
              sessionStorage.setItem(
                "sort_data",
                JSON.stringify(scope.allData)
              );
              sessionStorage.setItem("sortTypePage", scope.data.typePage);
              scope.loading = false;
            });
          }
        }
      });
    },
    //获取数据函数
    getGoodsData: function(data, callback) {
      data.pageSize = 10;
      var scope = this;
      // 如果没有右侧筛选信息
      if (!data.filters && !data.priceMax && !data.priceMin) {
        scope.filtersleft = {};
      }
      data.h5Platform = 1;
      // 如果价格区间不是int数字，则不传
      if (typeof data.priceMax !== "number") {
        delete data.priceMax;
      }
      if (typeof data.priceMin !== "number") {
        delete data.priceMin;
      }
      if (scope.ajaxing) {
        scope.ajaxing = false;
        data._t = Date.now();
        $.ajax({
          url: window.getsearchResultUrl,
          type: "POST",
          data: layout.strSign("search", data),
          dataType: "json",
          success: function(result) {
            if (result["code"]) {
              bravetime.info(result.msg);
              scope.ajaxing = true;
              var number = scope.data.sort - 1;
              scope.anymore[number].flag = true;
              scope.no_more = true;
              sessionStorage.setItem(
                "sort_no_more",
                JSON.stringify(scope.anymore)
              );
              sessionStorage.setItem(
                "sort_data",
                JSON.stringify(scope.allData)
              );
              sessionStorage.setItem(
                "filterlistdata",
                JSON.stringify(scope.filterlistdata)
              );
              scope.loading = false;
              scope.roings = false;
            } else {
              callback(result.data);
              //纠错词
              scope.noFeedDataWord = result.data.correctionWords; //纠错词
              //没有数据
              if (scope.feedData.length) {
                scope.no_goods = false;
              } else {
                scope.no_goods = true;
              }
              for (var i = 0; i < result.data.filterList.length; i++) {
                Vue.set(
                  scope.category_item_toggle,
                  result.data.filterList[i].parentId,
                  true
                );
              }

              scope.data.pageIndex++;
              var number = scope.data.sort - 1;
              scope.typePage[number] = scope.data.pageIndex;
              sessionStorage.setItem(
                "sortTypePage",
                JSON.stringify(scope.typePage)
              );
              //数据返回来的不够请求的
              if (
                !result.data.feedList.length ||
                result.data.feedList.length < 5
              ) {
                scope.no_more = true;
              } else if (result.data.feedList[4].body.dataList.length < 2) {
                scope.no_more = true;
              } else {
                scope.no_more = false;
              }
              scope.anymore[number].flag = scope.no_more;
              sessionStorage.setItem(
                "sort_no_more",
                JSON.stringify(scope.anymore)
              );
              scope.ajaxing = true;
              if (!scope.no_more) {
                scope.scrollListener();
              }
              scope.loading = false;

              if (result.data.shareInfo) {
                var shareInfo = result.data.shareInfo;
                window.imgUrl = shareInfo.imgUrl;
                window.lineLink = shareInfo.link;
                window.descContent = shareInfo.desc;
                window.shareTitle = shareInfo.title;
              } else {
                window.imgUrl =
                  "http://9i.dvmama.com/activity/2017/03/27/640_640_3e38f947b4715789a29a2e32f046224f.png?x-oss-process=image/resize,m_fill,w_80,h_80/quality,Q_90";
                window.lineLink = location.href;
                window.descContent = "快来大V店搜索";
                window.shareTitle = "搜索";
              }
              if (window.relink) {
                window.relink();
              }
              //为您推荐与搜索词
              if (!result.data.feedList.length) {
                scope.noFeedDataFl = result.data.noResult.feedList[1]; //推荐
                scope.noFeedDataKw = result.data.noResult.keywords; //搜索词
              }
            }
          },
          error: function() {
            scope.no_more = false;
            scope.ajaxing = true;
            var number = scope.data.sort - 1;
            scope.loading = false;
            scope.roings = false;
            scope.anymore[number].flag = true;
            sessionStorage.setItem(
              "sort_no_more",
              JSON.stringify(scope.anymore)
            );
            sessionStorage.setItem("sort_data", JSON.stringify(scope.allData));
            sessionStorage.setItem(
              "filterlistdata",
              JSON.stringify(scope.filterlistdata)
            );
            bravetime.info("请求出错");
          }
        });
      }
    },
    change: function(type) {
      var scope = this;
      scope.data.pageIndex = 1;
      scope.getGoodsData(scope.data, function(data) {
        scope.filterlistdata = data.filterList;
        scope.feedData = data.feedList;
        if (!scope.feedData.length || scope.feedData.length < 10) {
          scope.no_more = true;
        }

        //sorts数据从新选择后 存储
        scope.allData[type] = scope.feedData;
        sessionStorage.setItem("sort_data", JSON.stringify(scope.allData));

        sessionStorage.setItem("sort_data", JSON.stringify(scope.allData));
        sessionStorage.setItem(
          "filterlistdata",
          JSON.stringify(scope.filterlistdata)
        );
        scope.roings = false;
      });
    },
    events: function() {},
    /**
     * 显示右侧筛选
     */
    sortshow: function() {
      var scope = this;
      scope.filterleft = true;
      document.documentElement.style.height = "100%";
      scope.filtersleft = Object.assign({}, scope.filters);
    },
    /**
     * 关闭右侧筛选
     */
    filterleftclose: function(event) {
      var scope = this;
      scope.filterleft = false;
      setTimeout(function() {
        document.documentElement.style.height = "";
      }, 600);
      if (event) {
        event.preventDefault();
      }
    },
    /**
     * 右侧筛选选中
     */
    clcik_sort2: function(name, parendId) {
      var scope = this;
      //如果是分类状态则需要把处品牌外的所有列别的选中去掉
      if (parendId === "attributeDatas:分类") {
        let keys;
        for (keys in scope.filtersleft) {
          if (keys !== "brandNames" && keys !== "attributeDatas:分类") {
            Vue.set(scope.filtersleft, keys, "");
          }
        }
      }
      // 每次点击清空价格区间
      scope.priceMin = "";
      scope.priceMax = "";
      scope.data.priceMin = "";
      scope.data.priceMax = "";
      // 如果是选中状态，取消选中
      if (scope.filtersleft[parendId] && scope.filtersleft[parendId] === name) {
        Vue.set(scope.filtersleft, parendId, "");
      } else {
        Vue.set(scope.filtersleft, parendId, name);
      }

      // 选中和不选中都要confirm
      scope.confirms(false);
    },
    /**
     * 重置右侧筛选
     */
    resets: function() {
      var scope = this;
      scope.filtersleft = {};
      scope.priceMin = "";
      scope.priceMax = "";
      scope.data.priceMin = "";
      scope.data.priceMax = "";
      // 选中和不选中都要confirm
      scope.confirms(false);
    },
    /**
     * 确定右侧筛选值
     */
    confirms: function(bool) {
      var scope = this;
      // 如果价格为空的话，点击确定不操作 bool == false 属性筛选
      if (bool) {
        if (
          (scope.priceMin === null && scope.priceMax === null) ||
          (scope.priceMin === "" && scope.priceMax === "")
        ) {
          scope.filterleftclose();
          return false;
        }
      }
      scope.no_more = false;
      // window.bravetime.tj.pvSend('search_filterleft_confirm_click', '');
      scope.roings = true;
      // 左边大于右边还有 两边都为0的时候 为错误价格
      if (bool) {
        if (parseInt(scope.priceMin) > parseInt(scope.priceMax)) {
          bravetime.info("您输入的价格有误，请重新输入");
          scope.roings = false;
          return false;
        }
      }

      scope.filters = Object.assign({}, scope.filtersleft); //深拷贝

      sessionStorage.setItem("sort_filters", JSON.stringify(scope.filters));
      let filter = [];
      for (let key in scope.filters) {
        if (scope.filters[key] == "") {
        } else {
          filter.push(key + ":" + scope.filters[key]);
        }
        if (scope.filters[key] == "") {
          Vue.delete(scope.filters, key);
        }
      }
      scope.data.filters = filter.join(",");
      if (bool) {
        scope.data.priceMin = scope.priceMin;
        sessionStorage.setItem("priceMin", JSON.stringify(scope.priceMin));
        scope.data.priceMax = scope.priceMax;
        if (scope.data.priceMin) {
          Vue.set(scope.filtersleft, "priceMin", scope.data.priceMin);
        } else {
          Vue.delete(scope.filtersleft, "priceMin");
        }
        if (scope.data.priceMax) {
          Vue.set(scope.filtersleft, "priceMax", scope.data.priceMax);
        } else {
          Vue.delete(scope.filtersleft, "priceMax");
        }
        sessionStorage.setItem("priceMax", JSON.stringify(scope.priceMax));
      }
      //清除内存缓存
      scope.clearData();
      // 点击属性的搜索不关闭搜索框
      if (bool) {
        scope.filterleftclose();
      }
      scope.getGoodsData(scope.data, function(data) {
        scope.filterlistdata = data.filterList;
        // 将筛选项存 本地存储
        sessionStorage.setItem(
          "filterlistdata",
          JSON.stringify(data.filterList)
        );
        sessionStorage.setItem(
          "filtersleft",
          JSON.stringify(scope.filtersleft)
        );

        scope.allData[0] = data.feedList;
        sessionStorage.setItem("sort_data", JSON.stringify(scope.allData));

        scope.feedData = data.feedList;
        if (!scope.feedData.length || scope.feedData.length < 10) {
          scope.no_more = true;
        }
        scope.roings = false;
      });
    },
    /**
     * 筛选ITEM展开收起
     */
    categoryitemtoggle: function(i) {
      var scope = this;
      if (scope.category_item_toggle[i]) {
        Vue.set(scope.category_item_toggle, i, false);
      } else {
        Vue.set(scope.category_item_toggle, i, true);
      }
    },
    /**
     * 清除内存缓存
     */
    clearData: function() {
      var scope = this;
      scope.no_more = false;
      scope.pageIndex = 1;
      scope.anymore = [
        {
          flag: false
        },
        {
          flag: false
        },
        {
          flag: false
        },
        {
          flag: false
        },
        {
          flag: false
        }
      ];
      scope.allData = [[], [], [], []];
      scope.typePage = [1, 1, 1, 1];
      scope.data.pageIndex = 1;
      scope.selected = 1;
    },
    intdot: function() {
      var scope = this;
      scope.priceMin = parseInt(scope.priceMin);
      scope.priceMax = parseInt(scope.priceMax);
    },
    addClassjs: function(obj, cls) {
      var obj_class = obj.className,
        blank = obj_class != "" ? " " : "",
        added = obj_class + blank + cls;
      obj.className = added;
    },
    removeClassjs: function(obj, cls) {
      var obj_class = " " + obj.className + " ";
      obj_class = obj_class.replace(/(\s+)/gi, " ");
      var removed = obj_class.replace(" " + cls + " ", " ");
      removed = removed.replace(/(^\s+)|(\s+$)/g, "");
      obj.className = removed;
    },
    touchmoved: function(event) {
      event.preventDefault();
    }
  },
  watch: {
    urldata: function() {
      var scope = this;
      scope.roings = true;
      scope.no_more = false;
      scope.data.keywords = scope.urldata.keywords;
      scope.getGoodsData(scope.urldata, function(data) {
        scope.clearData();
        scope.filterlistdata = data.filterList;
        scope.feedData = data.feedList;
        scope.allData[0] = scope.feedData;
        if (!scope.feedData.length || scope.feedData.length < 10) {
          scope.no_more = true;
          scope.submit_nodata = true;
        } else {
          scope.submit_nodata = false;
        }
        scope.roings = false;
        scope.filters = {};
        scope.priceMin = null;
        scope.priceMax = null;
        delete scope.data.filters;
        scope.selected = 1;
        scope.data.sort = 1;
        sessionStorage.setItem("sort", scope.data.sort);

        sessionStorage.setItem("sort_filters", JSON.stringify(scope.filters));
        sessionStorage.setItem("priceMin", scope.priceMin);
        sessionStorage.setItem("priceMax", scope.priceMax);
        sessionStorage.setItem("sortTypePage", JSON.stringify(scope.typePage));
        sessionStorage.setItem("sort_no_more", JSON.stringify(scope.anymore));
      });
    },
    bodytouch: function() {
      var scope = this;
      if (scope.bodytouch) {
        if (scope.selecte_sort != -1) {
          scope.selecte_sort = -1;
          document.documentElement.style.height = "";
          window.scroll(0, scope.scroll_top);
        }
      }
    }
  }
};
</script>

<style>
.tt_com_1 {
  position: inherit !important;
}

.keyWord p {
  padding-left: 10px;
  color: #333;
  font-size: 14px;
}

.searchKeyWord {
  max-height: 125px;
  overflow: hidden;
  font-size: 0;
  margin-bottom: 20px;
}

.searchKeyWord a {
  display: block;
  float: left;
  font-size: 14px;
  color: #666666;
  background-color: #f8f8f8;
  padding: 5px 13px;
  border-radius: 14px;
  margin: 5px;
  cursor: pointer;
  max-width: 122px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.new_kind_sort_wrap {
  width: 100%;
  min-height: 50px;
}

.typering {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 9999999;
  bottom: 0;
  transform: translateY(0px);
}

.arrow-up {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 6px solid #c3c3c3;
}

.kind_sort a {
  margin: 0;
}

.no_goods {
  text-align: center;
  margin-bottom: 20px;
}

.no_goods img {
  height: 120px;
}

.kind_sort .dav_icon_sort {
  background-image: url(//9i.dvmama.com/free/2017/04/08/sort6.png);
  background-repeat: no-repeat;
  width: 10px;
  height: 14px;
  background-size: 100%;
  display: inline-block;
  position: relative;
  top: 3px;
  right: 2px;
}

.kind_sort .selected .dav_icon_sort {
  background-image: url(//9i.dvmama.com/free/2017/04/08/sort7.png);
}

.filter_container_wrap {
  position: absolute;
  max-width: 640px;
  top: 0;
  z-index: 100;
  bottom: 0;
  right: 0;
  left: 10%;
  margin: auto;
}

.filter_container {
  height: 100%;
  width: 90%;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  top: 0;
  left: 10%;
  background-color: #ffffff;
  z-index: 100;
  bottom: 0;
}

.sort_four {
  height: 50px;
  background-color: #fff;
  width: 100%;
}

.sort_four > div {
  width: 100%;
  height: 50px;
}

.sort_four .arrowdown {
  display: inline-block;
  width: 0;
  height: 0;
  position: relative;
  bottom: 2px;
}

.arrowdown {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #c3c3c3;
}

.arrowdown_wrap {
  display: inline-block;
  height: 12px;
  width: 12px;
  overflow: hidden;
}

.sort_four > div > div {
  width: 25%;
  height: 100%;
  float: left;
  text-align: center;
}

.sort_four > div > div .d-a {
  display: inline-block;
  background-color: #f1f1f1;
  width: 86.4%;
  line-height: 12px;
  font-size: 12px;
  padding: 8px 0 8px 0;
  margin-top: 10px;
  border-radius: 5px;
  height: 12px;
  -webkit-transition: background 0.35s;
  -moz-transition: background 0.35s;
  -ms-transition: background 0.35s;
  -o-transition: background 0.35s;
  transition: background 0.35s;
  position: relative;
}

.sort_four > div > div.selected1 .d-a {
  background-color: #fff;
  border: 1px solid #ff4a7d;
  color: #ff4a7d;
}

.sort_four > div > div.selected2 .d-a {
  background-color: #fff;
  box-sizing: border-box;
  color: #ff4a7d;
  border-bottom: 2px solid #ffffff;
  border: 1px solid #e1e1e1;
  border-bottom: 2px solid #ffffff;
  border-radius: 5px 5px 0 0;
  padding-bottom: 30px;
  z-index: 11;
  position: relative;
}

.sort_four > div > div.selected2 .arrowdown {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 6px solid #ff4a7d;
  border-top: none;
}

.sort_four > div > div.selected1 .arrowdown_wrap {
  display: none;
}

.sort_four > div > div.selected1 .d-a .sort_four_title {
  max-width: 62px;
}

.category_container {
  padding: 10px 5px;
  background: #fff;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  bottom: 40px;
  top: 0;
  -webkit-overflow-scrolling: touch;
}

.price_filter_container .to {
  display: inline-block;
  width: 3.8%;
  background-color: #ddd;
  height: 3px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto auto;
}

.price_are_wrap {
  background-color: #f4f4f4;
  padding: 6px;
  margin-bottom: 5px;
  overflow: hidden;
  position: relative;
}

.price_are_wrap input {
  width: 42%;
  text-align: center;
}

.price_filter_container input {
  font-size: 14px;
  border: #eee solid 1px;
  line-height: 18px;
  border-radius: 5px;
  text-align: center;
  padding: 6px 0;
  box-sizing: border-box;
}

.price_filter_container {
  padding: 10px 5px;
}

.sort_four_title {
  max-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  line-height: 12px;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.sort_select_q {
  position: absolute;
  max-width: 640px;
  margin: auto;
  min-height: 10px;
  left: 0;
  overflow-y: auto;
  border-top: 1px solid #e1e1e1;
  right: 0;
  top: 90px;
  clear: both;
  background: #fff;
  padding-top: 25px;
  max-height: 163px;
}

.sort_select_q.h0 {
  display: none;
}

.sort_items {
  width: 100%;
  background-color: #fff;
  min-height: 10px;
}

.sort_items > div {
  float: left;
  text-align: left;
  text-indent: 10px;
  color: #999999;
  font-size: 12px;
  line-height: 12px;
  width: 50%;
  margin-bottom: 25px;
}

.sort_text {
  display: inline-block;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bg {
  overflow: hidden;
  margin-top: 85px;
}

.in_app .bg {
  margin-top: 91px;
}

.bg.m144 {
  margin-top: 76px;
}

.in_app .bg.m144 {
  margin-top: 100px;
}

.bg.m235 {
  margin-top: 235px;
}

.in_app .bg.m235 {
  margin-top: 191px;
}

.sort_select_cover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
  transform: translateY(0px);
}

.kind_sort_four {
  position: fixed;
  z-index: 2;
  top: 44px;
  width: 100%;
  max-width: 640px;
  -webkit-transition: 0.5s ease 0s;
  -moz-transition: 0.5s ease 0s;
  -ms-transition: 0.5s ease 0s;
  -o-transition: 0.5s ease 0s;
  transition: 0.5s ease 0s;
  transform: translateY(0px);
}

.in_app .kind_sort_four {
  top: 0;
}

.kind_sort_four.flashtop {
  transform: translateY(-85px);
}

.in_app .kind_sort_four.flashtop {
  transform: translateY(-41px);
}

.kind_sort {
  width: 100%;
  white-space: nowrap;
}

.category_container .category_btn {
  width: 31.333%;
  display: block;
  float: left;
  height: 33px;
  line-height: 33px;
  font-size: 12px;
  margin: 10px 1% 0;
  text-align: center;
  border-radius: 5px;
  background-color: #f5f5f5;
}

.category_container .category_btn.selected {
  background: #ffe7ee
    url(//9i.dvmama.com/free/2017/04/19/iconsearchselect2.png) no-repeat;
  color: #ff4a7d;
  background-position: 100% 100%;
  background-size: auto 50%;
}

.category_container .category_btn div {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 85.7%;
  display: inline-block;
}

.sort_text.selected {
  color: #ff4a7d;
}

.category_btn_list {
  overflow: hidden;
}

.category_btn_list.category_btn_list_toggle.first {
  max-height: 138px;
}

.category_btn_list.category_btn_list_toggle {
  max-height: 88px;
}

.category_container .arrow_up {
  float: right;
  position: relative;
  top: 5px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 8px solid #c3c3c3;
  right: 2.5%;
}

.category_container .arrow_down {
  float: right;
  position: relative;
  top: 5px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 8px solid #c3c3c3;
  right: 2.5%;
}

.category_item label {
  text-indent: 5px;
  display: inline-block;
  width: 100%;
  height: 20px;
  line-height: 20px;
}

.two_arrow {
  position: relative;
  display: inline-block;
  width: 14px;
  height: 14px;
  top: 2px;
  left: -2px;
}

.two_arrow .arrow-up {
  position: absolute;
  top: 0px;
  left: 3px;
}

.two_arrow .arrow-down {
  -webkit-transform: rotateX(180deg);
  transform: rotateX(180deg);
  top: 8px;
}

.no_more {
  font-size: 12px;
  color: #999999;
  margin-bottom: 0.4rem;
}

.typering .vux-spinner-ios {
  stroke: #ff4a7d;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  margin: auto;
}

.typering .vux-spinner svg {
  width: 40px;
  height: 40px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.8s ease;
}

.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateX(100%);
}

.errorsWords {
  padding: 10px;
  background: #ffeff4;
  border-bottom: 1px solid #e1e1e1;
  border-top: 1px solid #e1e1e1;
  font-size: 12px;
  color: #666666;
}

.words {
  color: #ff4a7d;
}

.err-words {
  color: #ff4a7d;
  text-decoration: underline;
}

.marRight {
  display: inline-block;
  margin-right: 0.1rem;
}
</style>
