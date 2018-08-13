var iosPay = require('../src/common/js/module/iosPay.js').default;
var ua = require('../src/common/js/module/ua.js').default;
var utils = require('../utils/utils.es6').default

// 立即购买会员-按钮点击
$('.dav-btn').click(function(){
  // 如果是iosApp5.3.0以上，调起苹果支付
  if (utils.utils.isIOS() && ua.isDvdApp() && ua.compareVersion(ua.getDvdAppVersion(), '5.3.0') >= 0) {
    iosPay.pay({
      "type":'vip',
      "dvdGoodsId":window.goodsId,
      "appleId":window.appleId
    });
  }
});

// setTimeout(function(){
//
//   $(function(){
//
//     iosPay.mobileVerify('vip');
//   });
// }, 1000);
