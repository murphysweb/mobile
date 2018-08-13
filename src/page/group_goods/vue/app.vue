<!--模板-->
<template>
  <div class="app" v-if="response">
    <!--头部标题-->
    <com-top-title title="大V店限时组团" home share></com-top-title>

    <template v-if="response.data.goodsInfo">
      <!--商品信息-->
      <div class="goods-info">
        <div class="pic">
          <!--<img v-lazy="goodsInfo.goodsImgUrl">-->
          <img v-lazy="selectedImg || goodsInfo.goodsImgUrl">
          <div class="sold-out" v-if="isSoldOut === true">
            <p class="top">售罄</p>
            <div class="split-line"></div>
            <p class="bottom">SOLD OUT</p>
          </div>
          <div class="box-info">
            <div class="num">{{goodsInfo.pepoleNumber}}人团</div>
            <div class="privilege" v-if="hasParma === false">省{{goodsInfo.discount}}元</div>
            <div class="privilege" v-else>省{{selectDiscount}}元</div>
          </div>
        </div>
        <div class="info">
          <div class="top">
            <span class="group-price">
              ¥
              <span class="num" v-if="hasParma === false">{{goodsInfo.goodsPrice}}</span>
              <span class="num" v-else>{{selectPrice}}</span>
            </span>
            <span class="price" v-if="hasParma === false">单价买: ￥{{goodsInfo.realShopPrice}}</span>
            <span class="price" v-else>单价买: ￥{{selectShopPrice}}</span>
            <span class="post" v-for="item in goodsInfo.actLabels">{{item}}</span>
            <span class="income" v-if="response.visitor_status == '3' && goodsInfo.sellerIncome">
            会员返: ¥
              <span v-if="hasParma === false">{{goodsInfo.sellerIncome}}</span>
              <span v-else>{{selectIncome}}</span>
            <span class="times"
                  v-if="goodsInfo.sellerRadio && goodsInfo.sellerRadio != '0'">*{{goodsInfo.sellerRadio}}倍</span>
          </span>
          </div>
        </div>
        <div v-if="Date.now() < 1516896000000" style="line-height: 0.17rem;color: #ff4a7d;">组团成功每件返10-12元</div>
        <div class="desc">
          <span v-if="hasParma === false">{{goodsInfo.goodsName}}</span>
          <span v-else>{{selectGoodsName}}</span>
        </div>
      </div>

      <!-- 规格信息 -->
      <div v-if="hasParma" class="ui-param" @click="showParmaModel()">
        <div>已选择</div>
        <div>
          <span>{{selectedColor.title}}</span>
          <span>{{selectedSize.title}}</span>
        </div>
        <div>
          <img src="//9i.dvmama.com/free/2018/06/25/more.png" width="100%" height="100%">
        </div>
      </div>

      <!--团购信息-->
      <div class="group-info">
        <template v-if="goodsInfo.earliestList.length > 0">
          <div class="tip" v-if="isColonel === true">你已开团，快去邀请好友买买买吧~</div>
          <div class="tip" v-else>有小伙伴正在发起组团，可以直接参加购买~</div>
          <div class="groups-wrapper">
            <ul class="groups">
              <li v-for="item in goodsInfo.earliestList">
                <a :href="item.command.content" @click="joinOtherGroupClick">
                  <img class="head" v-lazy="item.founderAvater">
                  <span class="nickname">{{item.founderName}}</span>
                  <span class="go-group" v-if="isColonel === true">查看详情</span>
                  <span class="go-group" v-else>去参团</span>
                  <span class="remain-place">还差 <span class="num">{{item.leaveNumber}}</span> 人成团</span>
                </a>
              </li>
            </ul>
          </div>
        </template>
        <com-count-down :remain-second="goodsInfo.countDown"></com-count-down>
      </div>

      <!--tab按钮-->
      <div class="tab-btn">
      <span class="btn group" :class="{active: currentTab == 1}" @click="currentTab = 1">
        <span class="word">商品详情</span>
      </span>
        <i class="btn-split"></i>
        <span class="btn mine" :class="{active: currentTab == 2}" @click="currentTab = 2">
        <span class="word">活动须知</span>
      </span>
      </div>

      <div class="split-line"></div>

      <!--商品详情-->
      <div class="goods-detail" v-show="currentTab == 1" v-html="goodsInfo.goodsDesc"></div>

      <!--活动须知-->
      <div class="act-rule" v-show="currentTab == 2">
        <img v-for="(value,index) in goodsInfo.notice" v-lazy="value">
      </div>

      <!--底部购买按钮-->
      <group-bottom-btns :btn-array="goodsInfo.clickBtn"
                         :is-login="response.data.isLogin"
                         :is-intercept="goodsInfo.isIntercept"
                         :selected-id="selectedId"
                         :select-shop-price="selectShopPrice"
                         :select-price="selectPrice"
                         :goods-price="goodsInfo.goodsPrice"
                         :has-parma="hasParma"
                         @sgroup="startGroup"
      ></group-bottom-btns>
      <!-- 多规格面板 -->
      <group-parma-model v-if="hasParma === true"
                         :is-show="showModel"
                         :selected-id="selectedId"
                         :goods-id="goodsId"
                         :model-type="modelType"
                         :sku-list="skuList"
                         :btn-array="goodsInfo.clickBtn"
                         :goods-img-url="goodsInfo.goodsImgUrl"
                         :json-data="jsonData"
                         @hidden="hiddenModel()"
                         @change="chooseChild"
                         @gparma="postParma"
                         @confirmtobuy="confirmToBuy"
      ></group-parma-model>
      <!--至顶按钮-->
      <com-to-top-icon></com-to-top-icon>
    </template>

  </div>
</template>

<!--样式-->
<style lang="sass" rel="stylesheet/scss">
  @import "../../../common/css/util/all";
  @import "../css/group_goods.scss";
</style>

<!--组件定义-->
<script>
  import param from '../../../common/js/module/param.js';
  import encrypt from '../../../common/js/module/encrypt.js';
  import goods from '../json/goods.json';
  import layout from '../../../../module/index/layout.es6';
  import ua from '../../../common/js/module/ua.js';
  import native from '../../../common/js/module/native.js';
  import share from 'dvd-service-js-share';
  import popup from '../../../common/js/module/popup.js';
  import $ from 'jquery';

  export default {
    components: {
      'com-to-top-icon': require('../../../component/com-to-top-icon.vue'),
      'com-top-title': require('../../../component/com-top-title.vue'),
      'com-count-down': require('./com-count-down.vue'),
      'group-bottom-btns': require('./group-bottom-btns.vue'),
      'group-parma-model': require('../../../component/group-parma-model.vue')
    },
    props: {},
    data: function() {
      return {
        // 1显示商品详情,2活动须知
        currentTab: 1,
        response: null,
        goodsInfo: null,
        remainSecond: 5,
        comAlertIsShow: true,
        hasParma: false, // 商品是否有可选规格
        jsonData:{}, // 父商品的json信息
        showModel: false, // 控制显示规格弹框
        childs: {}, // 多规格商品信息
        goodsId: '', // 多规格商品请求json时使用的id
        selectedId: '', // 选中商品id
        selectedColor: {}, // 选中商品颜色
        selectedSize: {}, // 选中商品尺寸
        selectedImg: '', // 选中商品图片
        selectPrice:"", // 选中商品的价格
        selectIncome:"", // 选中商品的价格
        selectGoodsName:"", // 选中商品的名称
        selectShopPrice:"", // 选中商品的原价
        selectDiscount:"", // 选中商品的差价
        skuList: [], // 全部sku商品
        colorList: [], // 颜色列表
        sizeList: [], // 尺寸列表
        modelType: '', // 唤起模版类型(0页面点击规格唤起的模版 1开团买/参团买唤起的模版)
        checkUrl: '', // 多规格面板点击确定后跳转的链接 由服务端下发前端拼接多规格商品的id组成
        joinEntry: {}, // 参团开团提示
        checking: false, // 防刷 正在下单
        isSoldOut: false, // 是否已经全部售罄
        isColonel: false, // 是否是团长
      };
    },
    computed: {},
    created: function() {
      this.getData();
    },
    mounted: function() {
      // 设置app头部标题栏
      native.custom.initHead({
        shareOnHead: 1,
        homeOnHead: 1
      });

      // 已下架
      if (!this.response.data.goodsInfo) {
        popup.alert({
          text: '<p>该商品组团已结束啦～</p>看看其他组团商品吧～',         // 文本（支持传入html。有则显示。）
          btnCallback() {    // 按钮点击回调（有则执行该回调）
            location.href = '/group_list.html';
          }
        });
      }

      try {



        // 为0.5边框设置做的处理(设置.groups-wrapper高度为.groups缩小一半之后的实际高度)
        let groups = document.querySelector('.groups');
        groups && (groups.parentNode.style.height = (groups.clientHeight / 2) + 'px');
      } catch (err) {
      }
    },
    methods: {
      // wiki http://wiki.bravetime.net/pages/viewpage.action?pageId=16580732
      getData() {
        let ts = this;
        $.ajax({
          cache: false,
          async: false,
          url: '/api/mg/sale/reverse/getGoodsInfo?_=' + Date.now(),
          type: 'post',
          dataType: 'json',
          data: encrypt({
            reverseId: param.get('reverse_id') || '', // || '3584',
            groupId: param.get('group_id') || '',
            sourceRefer: param.get('sourceRefer') || ''
          }),
          success: function(response) {
            // PHP控制页面跳转逻辑(3该商品已参团或参团)
            if (response && response.data.type == '3' && response.data.redirectUrl) {
              window.addEventListener('DOMContentLoaded', function() {
                location.replace(response.data.redirectUrl);
              }, false);
              return;
            }
            ts.response = response;
            ts.goodsInfo = ts.response.data.goodsInfo;
            ts.joinEntry = ts.response.data.joinEntry;
            // 设置分享信息
            let shareInfo = response.data.shareInfo;
            if (shareInfo) {
              share.setShareInfo(shareInfo, response);
            }
            // console.log(ts.response);
            // 判断是否是团长
            // console.log(ts.response.data)
            if (ts.response.data.joinEntry && ts.response.data.joinEntry.join && ts.response.data.joinEntry.join === 1) {
              ts.isColonel = true;
            } else {
              ts.isColonel = false;
            }
            // // 根据 ts.response.data.extra.dataList.lenght 判断是否有多规格
            // if (ts.response.data.extra && ts.response.data.extra.dataList && ts.response.data.extra.dataList.length === 1) {
            //   ts.hasParma = false;
            // } else if (ts.response.data.extra && ts.response.data.extra.dataList && ts.response.data.extra.dataList.length > 1) {
            //   // 有多规格的情况下extra.dataList[0]为服务端排序后的默认选中商品
            //   ts.hasParma = true;
            // }

            ts.skuList = ts.response.data.extra.dataList;
            // 处理售罄
            let sum = 0;
            ts.skuList.forEach((i) => {
              sum += i.goods_stock;
            });
            if (sum === 0) {
              ts.isSoldOut = true;
            } else {
              ts.isSoldOut = false;
            }

            ts.selectedId = ts.response.data.extra.dataList[0].goods_id;
            ts.goodsId = ts.response.data.goodsInfo.goodsId;
            ts.selectShopPrice = ts.goodsInfo.realShopPrice;
            //根据json里的子商品长度判断单规格和多规格
            ts.getParmaJson()
          }
        });
      },
      /**
       * 获取多规格json来判断是否为多规格
       * */
      getParmaJson() {
        let _this = this;
        // 根据域名更换请求地址
        let domain = document.domain.split('.')[1];
        let url = '';
        if (domain === 'bravetime') {
          url = 'https://t.vyohui.cn/dev/goods/goods_' + _this.goodsId + '.json?_=' + Date.now();
        } else if (domain === 'vyohui') {
          url = 'https://t.vyohui.cn/beta/goods/goods_' + _this.goodsId + '.json?_=' + Date.now();
        } else {
          url = 'https://5t.dvmama.com/goods/goods_' + _this.goodsId + '.json?_=' + Date.now();
        }

        $.ajax({
          cache: false,
          async: true,
          url: url,
          type: 'get',
          data: encrypt({}),
          dataType: 'json',
          success(res) {
            let childsList = [];
            if(res.basis.childs.list){
              childsList = res.basis.childs.list;
            }
            _this.jsonData = res;
            if(childsList.length === 0){
              _this.hasParma = false;
            }else{
              _this.hasParma = true;
            }
          },
          error(err) {
            console.log(err);
          }
        });
      },



      joinOtherGroupClick() {
        layout.statistics({
          production: 12,
          action: 1,
          action_type: 1
        });
      },
      /**
       * 点击显示规格弹框
       * 1、显示遮罩层
       * 2、规格弹框从下向上缓动出现
       * */
      showParmaModel() {
        let _this = this;
        _this.modelType = 0;
        _this.showModel = true;
      },
      /**
       * 点击 参团/开团买
       * */
      startGroup(url) {
        let _this = this;
        _this.modelType = 1;
        if (_this.hasParma === true) {
          _this.showModel = true;
          _this.checkUrl = url;
        } else {
          // location.href = url + '&child_id=' + _this.goodsInfo.goodsId;
          location.href = url + '&child_id=' + _this.response.data.extra.dataList[0].goods_id;
        }
      },
      /**
       * 隐藏规格弹框
       * */
      hiddenModel() {
        let _this = this;
        _this.showModel = false;
      },
      /**
       * 多规格商品更改选中商品
       * */
      chooseChild(id) {
        let _this = this;
        _this.selectedId = id;
      },
      /**
       * 获取多规格信息
       * */
      postParma(data) {
        let _this = this;
        _this.selectedImg = data.image;
        _this.selectedColor = data.color;
        _this.selectedSize = data.size;
        _this.selectPrice = data.price;
        _this.selectIncome = data.income;
        _this.selectGoodsName = data.name;
        _this.selectShopPrice = data.shopPrice;
        _this.selectDiscount = data.discount;
      },
      /**
       * 多规格商品确认
       * */
      confirmToBuy() {
        let _this = this;
        if (_this.checking === true) {
          return;
        }
        _this.checking = true;
        if (_this.modelType === 0) {
          _this.checkUrl = _this.goodsInfo.clickBtn[1].btnUrl + '&child_id=' + _this.selectedId;
        } else {
          _this.checkUrl += '&child_id=' + _this.selectedId;
        }
        // console.log(_this.checkUrl)
        location.href = _this.checkUrl;
      }
    }
  };
</script>
