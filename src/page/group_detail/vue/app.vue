<!--模板-->
<template>
  <div class="app" v-if="response">
    <!--头部标题-->
    <!--<com-top-title :title="groupInfo.goodsName" bottom-line home></com-top-title>-->
    <com-top-title title="大V店限时组团" bottom-line home share></com-top-title>

    <!--PHP控制页面跳转逻辑-->
    <div class="php-redirect-tip" v-if="response.data.type == '3'">
      <img v-lazy="'http://9i.dvmama.com/free/prompt_ico_2015918_2x.png'">
      <a :href="response.data.redirectUrl">您已有这个商品的组团记录，点击跳转到您的组团界面!</a>
      <i></i>
    </div>

    <!--商品信息-->
    <a :href="groupInfo.goodsInfoUrl">
      <div class="goods-info">
          <span class="pic">
            <img class="goods-img" v-lazy="selectedImg || groupInfo.goodsImgUrl">
            <!--<group-state-icon v-if="response.data.groupStatus == '1'" type="success" :src="groupInfo.founderAvater"></group-state-icon>-->
            <!--<group-state-icon v-if="response.data.groupStatus == '0'" type="wait" :src="groupInfo.founderAvater"></group-state-icon>-->
            <!--<group-state-icon v-if="response.data.groupStatus == '2'" type="fail" :src="groupInfo.founderAvater"></group-state-icon>-->
            <img class="group-state-img" v-if="response.data.groupStatus == '1'"
                 src="http://9i.dvmama.com/free/group/group-status-success.png">
            <img class="group-state-img" v-if="response.data.groupStatus == '0'"
                 src="http://9i.dvmama.com/free/group/group-status-wait.png">
            <img class="group-state-img" v-if="response.data.groupStatus == '2'"
                 src="http://9i.dvmama.com/free/group/group-status-fail.png">
          </span>
        <span class="info">
            <div class="top">
              <span class="num">[{{groupInfo.pepoleNumber}}人团]</span> {{groupInfo.goodsName}}
            </div>
            <div class="middle">
              <span class="group-price" v-if="hasParma === false">¥ <span class="big">{{groupInfo.goodsPrice}}</span></span>
              <span class="group-price" v-else>¥ <span class="big">{{selectPrice}}</span></span>
              <template v-if="response.visitor_status == '3'">
                <span class="income" v-if="groupInfo.sellerIncome && groupInfo.sellerIncome != '0' && hasParma === false">团长返 ¥ {{groupInfo.sellerIncome}}</span>
                <span class="income" v-if="selectIncome && selectIncome != '0' && hasParma === true">团长返 ¥ {{selectIncome}}</span>
                <span class="income-times" v-if="groupInfo.sellerRadio && groupInfo.sellerRadio != '0'">*{{groupInfo.sellerRadio}}倍</span>
              </template>
            </div>
            <div class="bottom" v-if="hasParma === false">单价买: ¥ {{groupInfo.realShopPrice}}</div>
            <div class="bottom" v-else>单价买: ¥ {{selectShopPrice}}</div>
          </span>
      </div>
    </a>

    <!--组团信息-->
    <div class="group-info">
      <!--组团人数-->
      <div class="group">
        <template v-if="response.data.type == '8' || response.data.type == '10'">
          <div class="title">
            还有<span class="num">{{groupInfo.leaveNumber}}</span>个名额，赶快参团吧～
          </div>
        </template>
        <template v-else>
          <div class="title" v-if="response.data.groupStatus == '1'">
            {{groupInfo.pepoleNumber}}人团已组团成功，好棒哦~
          </div>
          <div class="title" v-if="response.data.groupStatus == '0' || response.data.groupStatus == '2'">
            还差 <span class="num">{{groupInfo.leaveNumber}}</span> 人，快喊小伙伴一起组团吧~
          </div>
        </template>
        <div class="heads">
          <!--团长或团员(最多5个)-->
          <group-head-portrait
            v-for="(member, i) in groupInfo.tourList"
            v-if="i < 5"
            :type="member.parendId === '0' ? 'leader' : 'normal'"
            :src="member.founderAvater"></group-head-portrait>
          <!--空位置(算上团员最多5个)-->
          <group-head-portrait
            v-for="(value, i) in emptyGroupNum"
            type="empty"></group-head-portrait>
          <!--更多-->
          <!--v-if="groupInfo.tourList.length > 5"-->
          <group-head-portrait
            v-if="parseInt(groupInfo.pepoleNumber) - parseInt(groupInfo.leaveNumber) > 5"
            type="more"
            :href="'/group_detail_all.html?group_id='+(response.data.groupId||'')+'&reverse_id='+(response.data.reverseId||'')"></group-head-portrait>
        </div>
      </div>

      <!--倒计时-->
      <com-count-down :remain-second="groupInfo.countDown" :group-status="response.data.groupStatus"></com-count-down>

      <!--展开组团详情-->
      <div class="detail-list" :class="{show: detailIsShow}" v-if="groupInfo.tourList.length > 0">
        <div class="title" @click="detailIsShow = !detailIsShow">
          <template v-if="!detailIsShow">展开组团详情</template>
          <template v-if="detailIsShow">收起组团详情</template>
          <span class="arrow"></span>
        </div>
        <div class="line"></div>
        <div class="list">
          <div class="arrow"></div>
          <ul>
            <!--团员-->
            <template v-for="(member, i) in groupInfo.tourList" v-if="i < 5">
              <div class="split-line" v-if="i !== 0"></div>
              <li>
                <group-head-portrait :type="member.parendId === '0' ? 'leader' : 'normal'"
                                     :src="member.founderAvater"></group-head-portrait>
                <span class="nickname">{{member.founderName}}</span>
                <span class="begin-time">{{member.uTime}} {{member.parendId === '0' ? '开团' : '参团'}}</span>
              </li>
            </template>
            <!--更多-->
            <template v-if="groupInfo.tourList.length >= 5">
              <div class="split-line"></div>
              <li class="more">
                <a
                  :href="'/group_detail_all.html?group_id='+(response.data.groupId||'')+'&reverse_id='+(response.data.reverseId||'')">查看更多</a>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>

    <!--热门组团-->
    <div class="hot-groups">
      <div class="title">
        <i class="arrow"></i>
        <span class="text">热门组团</span>
      </div>
      <ul class="list">
        <li v-for="(hot,i) in response.data.hotList">
          <a :href="hot.command.content" @click="hotGroupsItemClick">
            <img class="pic" v-lazy="hot.imgUrl">
            <div class="goods-name">
              <span class="num">[{{hot.pepoleNumber}}人团]</span> {{hot.goodsName}}
            </div>
            <div class="goods-price">
              <span class="group-price">￥{{hot.goodsPrice}}</span>
              <span class="single-price">单买价￥{{hot.realShopPrice}}</span>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <!--底部购买按钮-->
    <group-bottom-btns :btn-array="groupInfo.clickBtn"
                       :is-login="response.data.isLogin"
                       :is-intercept="groupInfo.isIntercept"
                       :selected-id="selectedId"
                       :select-shop-price="selectShopPrice"
                       :select-price="selectPrice"
                       :goods-price="groupInfo.goodsPrice"
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
                       :btn-array="groupInfo.clickBtn"
                       :goods-img-url="groupInfo.goodsImgUrl"
                       :json-data="jsonData"
                       @change="chooseChild"
                       @hidden="hiddenModel()"
                       @gparma="postParma"
                       @confirmtobuy="confirmToBuy"
    ></group-parma-model>
  </div>
</template>

<!--组件定义-->
<script>
  import encrypt from '../../../common/js/module/encrypt.js';
  import param from '../../../common/js/module/param.js';
  import layout from '../../../../module/index/layout.es6';
  import ua from '../../../common/js/module/ua.js';
  import share from '../../../common/js/module/share.js';
  import native from '../../../common/js/module/native.js';
  import $ from '$';

  export default {
    components: {
      'com-to-top-icon': require('../../../component/com-to-top-icon.vue'),
      'com-top-title': require('../../../component/com-top-title.vue'),
      'com-count-down': require('../../group_goods/vue/com-count-down.vue'),
      'group-state-icon': require('./group-state-icon.vue'),
      'group-head-portrait': require('./group-head-portrait.vue'),
      'group-bottom-btns': require('../../group_goods/vue/group-bottom-btns.vue'),
      'group-parma-model': require('../../../component/group-parma-model.vue')
    },
    props: {},
    data: function() {
      return {
        response: null,
        groupInfo: null,
        detailIsShow: false,
        hasParma: false, // 商品是否有可选规格
        jsonData:{}, // 父商品的json信息
        showModel: false, // 控制显示规格弹框
        selectedId: '', // 选中商品id
        selectedColor: {}, // 选中商品颜色
        selectedSize: {}, // 选中商品尺寸
        selectedImg: '', // 选中商品图片
        selectPrice:"", // 选中商品的价格
        selectIncome:"", // 选中商品的价格
        selectGoodsName:"", // 选中商品的名称
        selectShopPrice:"", // 选中商品的原价
        selectDiscount:"", // 选中商品的差价
        modelType: 1, // 唤起模版类型(0页面点击规格唤起的模版 1开团买/参团买唤起的模版)
        checkUrl: '', // 多规格面板点击确定后跳转的链接 由服务端下发前端拼接多规格商品的id组成
        goodsId: '', // 多规格商品请求json时使用的id

      };
    },
    computed: {
      emptyGroupNum() {
        // debugger
        // 最大5个空位置
        let maxEmptyNum = 5 - this.groupInfo.tourList.length;
        maxEmptyNum = maxEmptyNum > 0 ? maxEmptyNum : 0;
        // 需求空位置
        let emptyNum = parseInt(this.groupInfo.pepoleNumber) - this.groupInfo.tourList.length;
        // 实际显示空位置
        emptyNum = emptyNum < maxEmptyNum ? emptyNum : maxEmptyNum;
        emptyNum = emptyNum > 0 ? emptyNum : 0;
        return emptyNum;
      }
    },
    created: function() {
      this.getData();
    },
    mounted: function() {
      // 设置app头部标题栏
      native.custom.initHead({
        shareOnHead: 1
      });

      // 设置分享信息
      this.response.data.shareInfo.shareSource = 9;
      share.setShareInfo(this.response.data.shareInfo, this.response);
    },
    methods: {
      // wiki http://wiki.bravetime.net/pages/viewpage.action?pageId=16580736
      getData() {
        let ts = this;
        $.ajax({
          cache: false,
          async: false,
          url: '/api/mg/sale/reverse/getDetail?_=' + Date.now(),
          type: 'post',
          dataType: 'json',
          data: layout.strSign('feed', {
            reverseId: param.get('reverse_id') || '',
            groupId: param.get('group_id') || '',
            js_wx_info: 1
//            currentPageUrl: encodeURIComponent(location.href),
          }),
          success: function(response) {
            // debugger
            // PHP控制页面跳转逻辑(1未开始)
//            if(response.data.type == '1' && response.data.redirectUrl){
//              window.addEventListener('DOMContentLoaded', function(){
//                location.replace(response.data.redirectUrl);
//              }, false);
//              return;
//            }
//            console.log('组团详情页 接口返回数据:');
//            console.log(response);
//            console.log('组团详情页groupInfo:');
//            console.log(response.data.goodsInfo)
            ts.response = response;
            // console.log(ts.response);
            ts.groupInfo = ts.response.data.goodsInfo;
//            document.title = ts.groupInfo.goodsName;
//             // 根据 ts.response.data.extra.dataList.lenght 判断是否有多规格
//             if (ts.response.data.extra && ts.response.data.extra.dataList && ts.response.data.extra.dataList.length === 1) {
//               ts.hasParma = false;
//             } else if (ts.response.data.extra && ts.response.data.extra.dataList && ts.response.data.extra.dataList.length > 1) {
//               // 有多规格的情况下extra.dataList[0]为服务端排序后的默认选中商品
//               ts.hasParma = true;
//             }
            ts.skuList = ts.response.data.extra.dataList;
            ts.selectedId = ts.response.data.extra.dataList[0].goods_id;
            ts.selectShopPrice = ts.groupInfo.realShopPrice;
            ts.goodsId = ts.response.data.goodsInfo.goodsId;
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
      hotGroupsItemClick() {
        // debugger
        layout.statistics({
          production: 12,
          action: 1,
          action_type: 1
        });
      },
      /**
       * 隐藏规格弹框
       * */
      hiddenModel() {
        let _this = this;
        _this.showModel = false;
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
          // location.href = url + '&child_id=' + _this.groupInfo.goodsId;
          location.href = url + '&child_id=' + _this.response.data.extra.dataList[0].goods_id;
        }
      },
      /**
       * 多规格商品更改选中商品
       * */
      chooseChild(id) {
        let _this = this;
        _this.selectedId = id;
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
          _this.checkUrl = _this.groupInfo.clickBtn[1].btnUrl + '&child_id=' + _this.selectedId;
        } else {

          _this.checkUrl += '&child_id=' + _this.selectedId;
        }
        location.href = _this.checkUrl;
      },
      /**
       * 获取多规格信息
       * */
      postParma(data) {
        let _this = this;
        console.log(data)
        _this.selectedImg = data.image;
        _this.selectedColor = data.color;
        _this.selectedSize = data.size;
        _this.selectPrice = data.price;
        _this.selectIncome = data.income;
        _this.selectGoodsName = data.name;
        _this.selectShopPrice = data.shopPrice;
        _this.selectDiscount = data.discount;
      },
    }
  };
</script>

<!--样式-->
<style lang="sass" rel="stylesheet/scss">
  @import "../../../common/css/util/all";
  @import "../css/group_detail.scss";
</style>
