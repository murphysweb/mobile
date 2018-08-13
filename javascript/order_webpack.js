var popup = require('../src/common/js/module/popup.js').default;//如果require 进来的需要.default
import ua from 'dvd-base-js-ua';
import native from 'dvd-service-js-native';

$('.orderAftersale').click(function(event) {
  var $ts = $(this);

  if (showReturnGoodsApply == 1) {
    popup.confirm({
      text: '如需申请售后，系统将自动确认收货，订单状态将设置为“已完成。',             // 文本（支持传入html。有则显示。）
      okBtnTitle: '',       // 确定按钮标题（支持传入html。有则显示，无则显示默认'确定'。）
      okBtnCallback: function() {     // 确定按钮点击回调（有则执行该回调）

        var id = $(this).attr('data-for-order-id');
        id = window.deliveryId ? window.deliveryId : id;
        bravetime.addLoader({little: true});
        $.ajax({
          url: arriveUrl,
          dataType: 'json',
          data: {
            id: id
          },
          success: function(result) {
            bravetime.removeLoader();
            if (result['error'] == 0) {
              //成功之后跳转到确认收货页面
              location.href = $ts.attr('href');
              //一进页面在最上面代码获取下面的orderList，如果有就刷新页面
              // sessionStorage.setItem('orderDetail', "Refresh");
            } else {
              bravetime.info(result['msg']);
            }
          },
          error: function() {
            bravetime.removeLoader();
            bravetime.ajaxError(26);
          }
        });
      },
      cancelBtnTitle: '',   // 取消按钮标题（支持传入html。有则显示，无则不显示，传''时显示默认值'取消'。）
      cancelBtnCallback: function() { // 取消按钮点击回调（有则执行该回调）

      }
    });
    event.preventDefault();
  }
});
$('#wechatEnter').click(function(){
  let isApp = ua.isDvdApp();
  let appV = ua.getDvdAppVersion();
  if ((isApp === true) && (ua.compareVersion('5.8.0', appV) <= 0)) {
    // 调用command
    native.Common.openWXMiniProgram({
      'programId': miniAppId, //小程序原始id
      'path': miniAppPage + "?groupId=" + miniGroupId, //打开小程序的页面路径 + groupId
      'success': function(call) {
        //do nothing
      },
      'error': function() {
        // 调用command失败的话 跳转到h5页面
        // location.href = '/m/wechat_flock_enter.html?' + 'icon=' + icon + '&qrCodeUrl=' + qrCodeUrl + '&name=' + name;
        location.href = '/m/wechat_flock_enter.html?' + 'groupId=' + miniGroupId;
      }
    });
  } else {
    // 跳转到h5页面
    // location.href = '/m/wechat_flock_enter.html?' + 'icon=' + icon + '&qrCodeUrl=' + qrCodeUrl + '&name=' + name;
    location.href = '/m/wechat_flock_enter.html?' + 'groupId=' + miniGroupId;
  }
})

