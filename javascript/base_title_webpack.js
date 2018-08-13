var ua = require('../src/common/js/module/ua.js').default;
var param = require('../src/common/js/module/param.js');
var scriptjs = require('scriptjs');

if (!(ua.isDvdApp() && ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') < 0)) {
  // vue.js
  var script = document.createElement('script');
  script.src = '//3n.dvmama.com/vue/2.4.2/vue.min.js';
  scriptjs('//3n.dvmama.com/vue/2.4.2/vue.min.js', function(){
    // 头部标题栏
    (function () {
      var top_other = document.querySelector('.top_other');
      // 标题栏下面有附加内容时
      if (top_other) {
        top_other.setAttribute('slot', 'bottom');
        top_other.className += ' vue';
        new Vue({
          el: document.querySelector('.top0') ? ".top0" : '.top_other',
          components: {
            'com-top-title': require('../src/component/com-top-title.vue'),
          },
          template: '<com-top-title title="'+document.title+'" home share slide>'+top_other.outerHTML+'</com-top-title>',
        });
        document.querySelector('body').style.paddingTop = (44 + document.querySelector('.top_other').clientHeight) + 'px';
        // 标题栏下面无附加内容时
      } else {
        var shareClick = null;

        // 创建挂载点
        if (!document.querySelector('.top0')) {
          var top0 = document.createElement('div');
          top0.className = 'top0';
          document.body.appendChild(top0);
        }
        var template = '<com-top-title title="'+document.title+'" home></com-top-title>';
        // 订单确认页
        if (location.href.indexOf('checkout.html') !== -1
        ) {
          template = '<com-top-title title="'+document.title+'"></com-top-title>';
          // 签到页
        } else if (location.href.indexOf('sign.html') !== -1) {
          template = '<com-top-title title="'+document.title+'"><img slot="right" id="sign_page_pop" src="//9i.dvmama.com/free/info_icon_0826.png" style="height: 24px;margin-right: 10px;"></com-top-title>';
          setTimeout(function () {
            $('#sign_page_pop').click(function () {
              $(".mask").removeClass("hide");
            });
          }, 500);
          // 红包说明按钮：红包页
        } else if (location.href.indexOf('user_bonus.html') !== -1) {
          template = '<com-top-title title="'+document.title+'"><a slot="right" href="/t-490.html" class="top_btn"><span class="border_btn">红包说明</span></a></com-top-title>';
          setTimeout(function () {
            $('#sign_page_pop').click(function () {
              $(".mask").removeClass("hide");
            });
          }, 500);
          // 无home：积分、收藏、小数库，
        } else if (location.href.indexOf('/o-shipping-') !== -1) {
          template = '<com-top-title title="物流详情" home></com-top-title>';
          // 无home：积分、收藏、小数库，
        } else if (location.href.indexOf('index.php?c=points&a=index') !== -1
          || location.href.indexOf('index.php?c=goods&a=collect_goods') !== -1
          || location.href.indexOf('/spread/') !== -1
          || location.href.indexOf('/o-shipping-') !== -1
          || location.href.indexOf('/o-') !== -1
          || location.href.indexOf('/index.php?c=points&a=points_history') !== -1
          || location.href.indexOf('/about.html') !== -1
          || location.href.indexOf('/index.php?c=points&a=exchange_prize') !== -1
          || location.href.indexOf('/grade_done.html?goods_id=') !== -1
        ) {
          template = '<com-top-title title="'+document.title+'"></com-top-title>';
        } else if(location.href.indexOf('/address.html?action=add') !== -1) {
          template = '<com-top-title title="新增地址"></com-top-title>';
        } else if(location.href.indexOf('/address.html?address_id=') !== -1) {
          template = '<com-top-title title="编辑地址"></com-top-title>';
        } else if(location.href.indexOf('/comment/') !== -1) {
          template = '<com-top-title title="'+document.title+'" back-refresh></com-top-title>';
        } else if(location.href.indexOf('/index.php?c=points&a=prize_list') !== -1) {
          template =
            '<com-top-title title="'+document.title+'">' +
            '<div class="top_right" slot="right"><a href="/index.php?c=points&amp;a=exchange_history" class="top_btn" data-dav-tj="integral_exchange_list|record|record|1|record@integral_exchange_list"><span class="border_btn">兑换记录</span></a></div>'+
            '</com-top-title>';
        } else if(location.href.indexOf('/user_address.html') !== -1) {
          template =
            '<com-top-title title="'+document.title+'">' +
            '<div class="top_right" slot="right"><a href="./address.html?action=add" class="top_btn" data-dav-tj="address_list|add|add|1|add@address_list"><span class="border_btn">新增地址</span></a></div>'+
            '</com-top-title>';
        } else if(location.href.indexOf('/index.php?m=default&c=userDetail&a=detail') !== -1 || location.href.indexOf('/my_info.html') !== -1) {
          template =
            '<com-top-title title="'+document.title+'">' +
            '<div class="top_right" slot="right" style="position: absolute;right: 0;top: 0;white-space: nowrap;">' +
            '<a class="top_btn" href="/index.php?m=default&amp;c=userDetail&amp;a=edit" style="float: right;margin-right: 15px;">' +
            '<span class="text_btn" style=" font-size: 14px;display: block;line-height: 44px;padding-left: 12px;margin-right: -15px;cursor: pointer;padding-right: 12px;color: #FF4A7D;">编辑</span>' +
            '</a>' +
            '</div>'+
            '</com-top-title>';
        } else if(location.href.indexOf('/index.php?m=default&c=userDetail&a=edit') !== -1) {
          template =
            '<com-top-title title="'+document.title+'">' +
            '<div class="top_right" slot="right" style="position: absolute;right: 0;top: 0;white-space: nowrap;">' +
            '<a class="top_btn" href="/index.php?m=default&amp;c=userDetail&amp;a=edit" style="float: right;margin-right: 15px;">' +
            '<span class="text_btn" style=" font-size: 14px;display: block;line-height: 44px;padding-left: 12px;margin-right: -15px;cursor: pointer;padding-right: 12px;color: #FF4A7D;">保存</span>' +
            '</a>' +
            '</div>'+
            '</com-top-title>';
        } else if(location.href.indexOf('/grade-') !== -1 || location.href.indexOf('/grade_append-') !== -1) {
          template =
            '<com-top-title title="'+document.title+'">' +
            '<div class="top_right" slot="right" style="position: absolute;right: 0;top: 0;white-space: nowrap;">' +
            '<a class="top_btn" style="margin-right: 12px;">'+
            '<span class="text_btn publish_comment_btn" style="color: #FF4A7D;">发表</span>'+
            '</a>'+
            '</div>'+
            '</com-top-title>';
        } else if(location.href.indexOf('/index.php?c=points&a=exchange_history') !== -1) {
          template = '<com-top-title title="'+document.title+'"></com-top-title>';
          var div = document.createElement('div');
          div.classname = 'top0';
          document.body.appendChild(div);
        } else if(location.href.indexOf('class_detail') !== -1) {
          template = '<com-top-title title="'+document.title+'" home share :share-click="shareClick"></com-top-title>';
          shareClick = function(){
            location.href = window.moreShareInfo.cmd;
          }
        } else if(location.href.indexOf('/index.php?c=ShopGoods&a=index&id=623534') !== -1) {
          template = '<com-top-title title="'+document.title+'"></com-top-title>';
        } else if(location.href.indexOf('/change_address_list.html?order_id=') !== -1
          || location.href.indexOf('/index.php?c=VipUserSelectBooks&a=vip_user_edit_address') !== -1
          || location.href.indexOf('/index.php?c=VipUserSelectBooks&a=vip_select_book_index') !== -1) {
          template = '<com-top-title title="'+document.title+'"></com-top-title>';
        } else if(location.href.indexOf('/index.php?c=VipUserSelectBooks&a=vip_user_select_book') !== -1) {
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = '.js-to-hide-cart { padding-top: 0 !important; }';
          document.head.appendChild(style);
          template = '<com-top-title title="'+document.title+'"></com-top-title>';
        } else if(location.href.indexOf('/index.php?c=VipUserSelectBooks&a=vip_book_add_address') !== -1) {
          template = '<com-top-title title="添加新地址"></com-top-title>';
        } else if(location.href.indexOf('/index.php?c=VipUserSelectBooks&a=vip_user_address_list') !== -1) {
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = '.js-to-hide-cart { padding-top: 0 !important; }';
          document.head.appendChild(style);
          template = '<com-top-title title="收货地址列表">'+
            '<div class="top_right" slot="right" style="position: absolute;right: 0;top: 0;white-space: nowrap;">'+
              '<a href="/index.php?c=VipUserSelectBooks&amp;a=vip_book_add_address" class="top_btn">'+
              '<span class="border_btn">添加新地址</span>'+
              '</a>'+
            '</div>'+
            +'</com-top-title>';
        } else if(location.href.indexOf('/change_address.html?order_id=') !== -1) {
          template =
            '<com-top-title title="编辑地址" >' +
              '<div class="top_right" slot="right" style="position: absolute;right: 0;top: 0;white-space: nowrap;">' +
              '<a class="top_btn" href="/change_address_list.html?order_id='+param.get('order_id')+'">'+
              '<span class="text_btn publish_comment_btn" style="color: #FF4A7D;">切换地址</span>'+
              '</a>'+
              '</div>'+
            '</com-top-title>';
        }

        // 创建标题栏
        new Vue({
          el: ".top0",
          components: {
            'com-top-title': require('../src/component/com-top-title.vue'),
          },
          template: template,
          methods: {
            shareClick: shareClick
          }
        });
        document.querySelector('body').style.paddingTop = '44px';
      }
    })();
  });
  document.body.append(script);
}
