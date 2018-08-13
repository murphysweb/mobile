$(function() {

  // 针对PC 端调整样式
  if (!Units.isApp()) {
    $('.js-to-hide-cart').addClass('hideTop');
  }

  // 去掉价格后面的0
  function removeZero(price) {
    var regs = /\f.[1-9]0$/ig;
    var oldPrice = price.toFixed(2);
    var newPrice = 0;

    if (oldPrice.indexOf('.00') > -1) {
      newPrice = parseInt(oldPrice);
    } else if (regs.test(oldPrice)) {
      newPrice = oldPrice.substring(0, oldPrice.length - 1);
    } else {
      newPrice = oldPrice;
    }

    return newPrice;
  }

  var password = null,
    commissionNumber = 0;

  // 年终奖相关
  function compareYear(item1, item2) {
    return item2 - item1;
  }

  var yearMoneyKey = [],
    yearMoneyVal = [];
  if (window.yearPaidSill) {
    for (var i in window.yearPaidSill) {
      yearMoneyKey.push(i);
      yearMoneyVal.push(window.yearPaidSill[i]);
    }
  }
  if (yearMoneyKey.length) {
    yearMoneyKey.sort(compareYear);
    yearMoneyVal.sort(compareYear);
  }

  // 选择身份证信息返回来刷新页面
  // 获取身份证添加页面的cookie
  var idcardreload = sessionStorage.getItem('checkout_cookie');
  if (idcardreload == 'checkout_idcard') {
    sessionStorage.removeItem('checkout_cookie');
    location.reload();
  }

  // 切换身份证信息
  $('.idcard').click(function() {
    if ($('.change_address_container').length) {
      var Addressee = $.trim($('.change_address_container .name').html());
      sessionStorage.setItem('Addressee', Addressee);
    }
    if (window.Units && Units.isApp()) {
      appdata();
    } else {
      location.href = window.idcardListUrl;
    }
  });

  function appdata() {
    var callback = function(result) {
      if (window.__DEBUG) {
        alert('call');
      }

      if (+result.code) {
        var Addressee = sessionStorage.getItem('Addressee');
        bravetime.addLoader({little: true});
        common.getDataWithSign({
          url: window.idcardCheckoutUrl,
          type: 'POST',
          dataType: 'json',
          updata: {
            id: result.id,
            cardName: Addressee
          },
          success: function(result) {
            bravetime.removeLoader();
            if (window.__DEBUG) {
              alert('result' + JSON.stringify(result));
            }
            if (result.code) {
              bravetime.info(result.data.msg);
            } else {

              // 选择证件信息成功后去掉收货人姓名
              sessionStorage.removeItem('Addressee');

              // 记录被选中,在订单确认页获取,如果有就刷新订单确认页面
              // sessionStorage.setItem("idcard","idcardcheck");
              location.reload();
            }
          },
          error: function() {
            if (window.__DEBUG) {
              alert('error');
            }
            bravetime.removeLoader();
            bravetime.info('网络异常，请稍后重试');
          }
        });
      } else {
        if (window.__DEBUG) {
          alert('code :' + result.code);
        }
        bravetime.removeLoader();
        location.reload();
      }
    };
    var mincallback = function() {
      location.href = window.idcardListUrl;
    };
    window.bravetime.selectIdentity(callback, mincallback);
  }

  // 更换身份证信息从列表页返回来刷新页面,清空cookie
  var checkout = sessionStorage.getItem('idcard');
  if (checkout == 'idcardcheck') {
    sessionStorage.removeItem('idcard');
    location.reload();
  }

  var cartConfirmContainer = $('.cart_confirm_container');
  if (cartConfirmContainer && cartConfirmContainer.length) {
    var page = window.page || '订单确认页',
      scroller, bounsId = defaultBonusId || 0,
      line_price = window.line_price || 59,
      orderAmount = window.orderAmount || 0,
      fee = +window.fee_price || 0;

    // 重新加载
    reload();

    // // 提示输入身份证
    // cartConfirmContainer.find(".other_address").find(".icon").click(function (event) {
    //    window.bravetime.newConfirm("<span style='color:#666;text-align:left;'>您的订单中包含跨境商品，需要办理正常的清关手续，请填写与收货人姓名一致的身份证号和邮编信息，否则无法办理清关手续，影响您及时收货。</span>", {
    //        okText: "新技能get",
    //        hideCancel: true
    //    });
    // });

    var bonus_cart = $('.js-to-hide-cart');
    var bonus_b = $('.js-to-hide-bonus');
    var commission = $('.js-to-hide-commission');
    var no_bonus = bonus_b.find('.not_used_red');
    var no_bonus_flag = no_bonus.find('.selected_state_small_default');
    var bonus_list = bonus_b.find('.bouns_item');
    var bonus_list_flags = bonus_b.find('.bouns_item .selected_state_default');
    var bonus_text = bonus_cart.find('.bonus_num');

    // 红包
    $('.bouns_con').click(function() {
      bonus_cart.addClass('hide');
      bonus_b.removeClass('hide');
      history.pushState('__virtual__page__bonus', '????');
    });

    window.onpopstate = function(event) {
      showCart();
    };

    function showCart() {

      // TODO 在红包列表页和订单确认页之间切换时会带着滚动
      // TODO 在红包返回时会莫名其妙刷新，什么时候刷新呀 也没有注释fffff
      bonus_cart.removeClass('hide');
      bonus_b.addClass('hide');
      commission.addClass('hide');
    }

    // 返现
    $('.commission_con').click(function() {

      // 已经使用返现就展示不用返现
      var alreadyUse = $(this).hasClass('already_use');

      $('.no_commission').toggleClass('hide', !alreadyUse);
      $('.enter_password_con').toggleClass('hide', alreadyUse);

      $('.enter_password_input').val('');
      bonus_cart.addClass('hide');
      bonus_b.addClass('hide');
      commission.removeClass('hide');
      $('body').addClass('commission_use');
      history.pushState('__virtual__page__commission', '????');
    });

    // 点击不使用返现
    $('.no_commission').click(function() {
      password = null;
      $('.password').html('输密码可使用').addClass('enter_password').removeClass('commission_num');
      $('#brokerage').html('-￥0');
      $('.commission_con').removeClass('already_use');
      var numStr = $('#reduce_bouns').html(),
        num;
      if (numStr) {
        num = +numStr.replace('-￥', ''); // 获取红包
      } else {
        num = 0;
      }
      if (orderAmount - num >= line_price) {
        var postFee = 0;
      } else {
        var postFee = fee;
      }

      // 修改邮费 removeZero
      $('.price_add').find('.item_num').html('￥' + removeZero(postFee));

      // 改应付金额
      // $("#all_price_reduce_bouns").html("￥" + removeZero(orderAmount - num+postFee));

      // 使用年终奖
      var currentUseMoney = removeZero(orderAmount - num + postFee);
      if (window.yearPaid && window.yearPaid != '0') {

        /* for (var useIndex = 0,useLen = yearMoneyKey.length; useIndex < useLen; useIndex++) {
            if (currentUseMoney < yearMoneyKey[useIndex] && currentUseMoney >= yearMoneyKey[useIndex+1]) {
                if (window.isYearAward == "0") {
                    window.isYearAward = 1;
                }
                $(".year_ward_num").html('<span classs = "year_num" style = "vertical-align: super;margin-right: 5px;color: #FF4A7D;"><span class = "yearNums">'+ window.yearPaid +'</span>元</span><i class = "year_ward_ipt year_ward_ipt_checked"></i>')
                if (window.userYearPaid > yearMoneyVal[useIndex+1]) {
                    $(".yearNums").html(yearMoneyVal[useIndex+1])
                    break;
                }
            }
            if (useIndex == 0) {
                if (currentUseMoney >= yearMoneyKey[useIndex]) {
                    $(".yearNums").html(window.yearPaid);
                    if (window.userYearPaid > yearMoneyVal[useIndex]) {
                        $(".yearNums").html(yearMoneyVal[useIndex])
                        break;
                    }
                }
            }
        }*/
        // 应付金额的档次,档次的index
        var payMoney = 0,
          payIndex = 0;

        // 年终奖的档次
        var yearMoney = window.yearPaid;

        // 计算符合年终奖哪个档次payMoney
        /* for (var useIndex = 0, useLen = yearMoneyKey.length; useIndex < useLen; useIndex++) {
          if (Number(currentUseMoney) >= Number(yearMoneyKey[useIndex])) {
            payMoney = yearMoneyKey[useIndex];
            payIndex = useIndex;
            break;
          }
        }*/
        /* if (Number(window.userYearPaid) > Number(yearMoneyVal[payIndex])) {
          yearMoney = yearMoneyVal[payIndex];
        } else {
          yearMoney = window.userYearPaid;
        }*/
        // if (payMoney == 0) {
        //   window.isYearAward = "0";
        //   $(".year_ward_num").html('<span class = "no_condition">不满足使用门槛</span>');
        // } else {
        window.isYearAward = '1';
        $('.year_ward_num').html('<span classs = "year_num" style = "vertical-align: super;margin-right: 5px;color: #FF4A7D;"><span class = "yearNums">' + yearMoney + '</span>元</span><i class = "year_ward_ipt year_ward_ipt_checked"></i>');

        // }

        debugger;

        // 年终奖选中的情况
        if ($('.year_ward_ipt').hasClass('year_ward_ipt_checked')) {
          var yearUseNums = Number($('.yearNums').html());
          $('#all_price_reduce_bouns').html('￥' + removeZero(orderAmount - num - yearUseNums + postFee));
        } else {
          $('#all_price_reduce_bouns').html('￥' + removeZero(orderAmount - num + postFee));
        }
      } else {
        $('#all_price_reduce_bouns').html('￥' + removeZero(orderAmount - num + postFee));
      }


      commissionNumber = 0;
      history.back();
    });

    window.onpopstate = function(event) {
      hideCommission();
    };

    function hideCommission() {

      // TODO 在红包列表页和订单确认页之间切换时会带着滚动
      // TODO 在红包返回时会莫名其妙刷新，什么时候刷新呀 也没有注释fffff
      bonus_cart.removeClass('hide');
      bonus_b.addClass('hide');
      commission.addClass('hide');
      $('body').removeClass('commission_use');
    }

    // 点击确认使用
    $('.sure_use').click(function() {
      var payPassword = $('.enter_password_input').val();
      $.ajax({
        url: payPasswordUrl,
        type: 'POST',
        dataType: 'json',
        data: {password: payPassword},
        success: function(result) {
          if (result.code == 0) {
            password = payPassword;
            var be_usable = +$('.be_usable').html().replace('元', '');

            // $(".password").html((be_usable).toFixed(2)+"元").removeClass("enter_password").addClass("commission_num");
            $('.password').html(removeZero(be_usable) + '元').removeClass('enter_password').addClass('commission_num');

            // $("#brokerage").html('-￥'+ (be_usable).toFixed(2));
            $('#brokerage').html('-￥' + removeZero(be_usable));
            $('.commission_con').addClass('already_use');

            history.back();
            var numStr = $('#reduce_bouns').html(),
              num;
            if (numStr) {
              num = +numStr.replace('-￥', ''); // 获取红包 removeZero
            } else {
              num = 0;
            }

            if (orderAmount - num >= line_price) {
              var postFee = 0;
            } else {
              var postFee = fee;
            }


            // 修改邮费
            $('.price_add').find('.item_num').html('￥' + removeZero(postFee));

            // 改应付金额
            // $("#all_price_reduce_bouns").html("￥" + removeZero(orderAmount - num - be_usable+postFee));

            debugger;

            // 111
            // 使用年终奖
            var currentUseMoney = Number(removeZero(orderAmount - num + postFee));
            if (window.yearPaid && window.yearPaid != '0') {

              // 应付金额的档次,档次的index
              var payMoney = 0,
                payIndex = 0;

              // 年终奖的档次
              var yearMoney = window.yearPaid;

              debugger;

              /* for (var useIndex = 0, useLen = yearMoneyKey.length; useIndex < useLen; useIndex++) {
                if (Number(currentUseMoney) >= Number(yearMoneyKey[useIndex])) {
                  payMoney = yearMoneyKey[useIndex];
                  payIndex = useIndex;
                  break;
                }
              }*/
              /* if (Number(window.userYearPaid) > Number(yearMoneyVal[payIndex])) {
                yearMoney = yearMoneyVal[payIndex];
              } else {
                yearMoney = window.userYearPaid;
              }*/
              // if (payMoney == 0) {
              //   window.isYearAward = "0";
              //   $(".year_ward_num").html('<span class = "no_condition">不满足使用门槛</span>');
              // } else {
              window.isYearAward = '1';
              $('.year_ward_num').html('<span classs = "year_num" style = "vertical-align: super;margin-right: 5px;color: #FF4A7D;"><span class = "yearNums">' + yearMoney + '</span>元</span><i class = "year_ward_ipt year_ward_ipt_checked"></i>');

              // }

              // 年终奖选中的情况
              if ($('.year_ward_ipt').hasClass('year_ward_ipt_checked')) {
                var yearUseNums = Number($('.yearNums').html());
                var resultPay = removeZero(orderAmount - num - yearUseNums - be_usable + postFee);

                // $("#all_price_reduce_bouns").html("￥" + (resultPay < 0 ? '0.01' : resultPay));
                $('#all_price_reduce_bouns').html('￥' + resultPay);
              } else {
                var resultPay = removeZero(orderAmount - num - be_usable + postFee);

                // $("#all_price_reduce_bouns").html("￥" + (resultPay < 0 ? '0.01' : resultPay));
                $('#all_price_reduce_bouns').html('￥' + resultPay);
              }
            } else {
              $('#all_price_reduce_bouns').html('￥' + removeZero(orderAmount - num - be_usable + postFee));
            }

            commissionNumber = be_usable;

            // 触发重新计算
            $('.year_ward').click();
            setTimeout(function() {
              $('.year_ward').click();
            }, 100);
          } else {
            bravetime.info(result.msg);
          }
        },
        error: function() {
          bravetime.info('网络错误,请重试');
        }
      });
    });

    // 选择暂时不用红包
    no_bonus.click(function() {
      window.selectedRedpackNum = 0;
      no_bonus_flag.addClass('selected_state_red');
      bounsId = 0;
      bonus_list_flags.removeClass('selected_state_selected');
      bonus_text.html('暂不使用红包').addClass('enter_password');
      cartConfirmContainer.find('.bouns_title').find('.bouns_number').html('0元');
      $('#reduce_bouns').html('-￥0');

      if (orderAmount >= line_price) {
        var postFee = 0;
      } else {
        var postFee = fee;
      }


      // removeZero
      // $(".price_add").find(".item_num").html('￥'+(postFee).toFixed(2));
      $('.price_add').find('.item_num').html('￥' + removeZero(postFee));

      // 重新计算返现金额
      commissionNumber = Math.min(window.maxUseIncome, (orderAmount + postFee) * commissionRate);

      // 改应付金额
      var payAmount = orderAmount - commissionNumber * +!!password + postFee;

      // $("#all_price_reduce_bouns").html("￥" + removeZero(payAmount));

      // 使用年终奖
      var currentUseMoney = removeZero(Number(orderAmount) + Number(postFee));
      if (window.yearPaid && window.yearPaid != '0') {

        // 应付金额的档次,档次的index
        var payMoney = 0,
          payIndex = 0;

        // 年终奖的档次
        var yearMoney = window.yearPaid;

        debugger;

        /* for (var useIndex = 0, useLen = yearMoneyKey.length; useIndex < useLen; useIndex++) {
          if (Number(currentUseMoney) >= Number(yearMoneyKey[useIndex])) {
            payMoney = yearMoneyKey[useIndex];
            payIndex = useIndex;
            break;
          }
        }*/
        /* if (Number(window.userYearPaid) > Number(yearMoneyVal[payIndex])) {
          yearMoney = yearMoneyVal[payIndex];
        } else {
          yearMoney = window.userYearPaid;
        }*/
        // if (payMoney == 0) {
        //   window.isYearAward = "0";
        //   $(".year_ward_num").html('<span class = "no_condition">不满足使用门槛</span>');
        // } else {
        window.isYearAward = '1';
        $('.year_ward_num').html('<span classs = "year_num" style = "vertical-align: super;margin-right: 5px;color: #FF4A7D;"><span class = "yearNums">' + yearMoney + '</span>元</span><i class = "year_ward_ipt year_ward_ipt_checked"></i>');

        // }

        // 年终奖选中的情况
        if ($('.year_ward_ipt').hasClass('year_ward_ipt_checked')) {
          var yearUseNums = Number($('.yearNums').html());

          // 重新计算返现金额
          commissionNumber = Math.min(window.maxUseIncome, (orderAmount + postFee - yearUseNums) * commissionRate);

          // 改应付金额
          payAmount = orderAmount - commissionNumber * +!!password + postFee;
          $('#all_price_reduce_bouns').html('￥' + removeZero(payAmount - yearUseNums));
        } else {
          $('#all_price_reduce_bouns').html('￥' + removeZero(payAmount));
        }
      } else {
        $('#all_price_reduce_bouns').html('￥' + removeZero(payAmount));
      }


      $('#brokerage').html('-￥' + removeZero(commissionNumber * +!!password));
      $('.be_usable').html(removeZero(commissionNumber) + '元');
      $('.commission_num').html(removeZero(commissionNumber) + '元');
      history.back();
      showCart();
      $.ajax({
        url: window.changeUrl,
        data: {bonus_id: 0},
        success: function() {
          bravetime.removeLoader();
        },
        error: function() {
          bravetime.removeLoader();
        }
      });
    });

    // 选择一个红包的时候 removeZero
    bonus_list.click(function() {
      var minAmount = $(this).attr('data-for-min-amount');
      var num = +$(this).attr('data-for-num');
      window.selectedRedpackNum = num;
      var tmp_bonus_id = $(this).attr('data-for-id');

      // var numTxt = num.toFixed(2);
      var numTxt = removeZero(num);

      if ($(this).hasClass('bouns_pink')) {
        bravetime.newAlert('此红包满' + minAmount + '元才能使用');
        return false;
      } else if ($(this).hasClass('bouns_red')) {
        no_bonus_flag.removeClass('selected_state_red');
        bonus_list_flags.removeClass('selected_state_selected');
        $(this).find('.selected_state_default').addClass('selected_state_selected');
        bonus_text.html(num + '元').removeClass('enter_password');
        bounsId = tmp_bonus_id;
        changeOtherHtml();
        history.back();
        showCart();
        bravetime.addLoader({little: true});
        $.ajax({
          url: window.changeUrl,
          data: {bonus_id: bounsId},
          success: function() {
            bravetime.removeLoader();
          },
          error: function() {
            bravetime.removeLoader();
          }
        });
      }

      function changeOtherHtml() {
        if (orderAmount >= minAmount) {
          $('#reduce_bouns').html('-￥' + numTxt);

          if (orderAmount - num >= line_price) {
            var postFee = 0;
          } else {
            var postFee = fee;
          }

          // 修改邮费 removeZero
          // $(".price_add").find(".item_num").html('￥'+(postFee).toFixed(2));
          $('.price_add').find('.item_num').html('￥' + removeZero(postFee));

          // 重新计算返现金额
          commissionNumber = Math.min(window.maxUseIncome, (orderAmount + postFee - num) * commissionRate);

          // 改应付金额
          var payAmount = orderAmount - num - commissionNumber * +!!password + postFee;

          // $("#all_price_reduce_bouns").html("￥" + removeZero(payAmount));

          // 使用年终奖
          var currentUseMoney = removeZero(orderAmount - num + postFee);
          if (window.yearPaid && window.yearPaid != '0') {

            // 应付金额的档次,档次的index
            var payMoney = 0,
              payIndex = 0;

            // 年终奖的档次
            var yearMoney = window.yearPaid;

            debugger;

            /* for (var useIndex = 0, useLen = yearMoneyKey.length; useIndex < useLen; useIndex++) {
              if (Number(currentUseMoney) >= Number(yearMoneyKey[useIndex])) {
                payMoney = yearMoneyKey[useIndex];
                payIndex = useIndex;
                break;
              }
            }*/
            /* if (Number(window.userYearPaid) > Number(yearMoneyVal[payIndex])) {
              yearMoney = yearMoneyVal[payIndex];
            } else {
              yearMoney = window.userYearPaid;
            }*/
            // if (payMoney == 0) {
            //   window.isYearAward = "0";
            //   $(".year_ward_num").html('<span class = "no_condition">不满足使用门槛</span>');
            // } else {
            // yearMoney -= window.selectedRedpackNum;
            window.isYearAward = '1';
            $('.year_ward_num').html('<span classs = "year_num" style = "vertical-align: super;margin-right: 5px;color: #FF4A7D;"><span class = "yearNums">' + yearMoney + '</span>元</span><i class = "year_ward_ipt year_ward_ipt_checked"></i>');

            // }

            // 年终奖选中的情况
            if ($('.year_ward_ipt').hasClass('year_ward_ipt_checked')) {
              var yearUseNums = Number($('.yearNums').html());

              // 重新计算返现金额
              commissionNumber = Math.min(window.maxUseIncome, (orderAmount + postFee - num - yearUseNums) * commissionRate);

              // 改应付金额
              payAmount = orderAmount - num - commissionNumber * +!!password + postFee;

              $('#all_price_reduce_bouns').html('￥' + removeZero(payAmount - yearUseNums));
            } else {
              $('#all_price_reduce_bouns').html('￥' + removeZero(payAmount));
            }
          } else {
            $('#all_price_reduce_bouns').html('￥' + removeZero(payAmount));
          }


          $('#brokerage').html('-￥' + removeZero(commissionNumber * +!!password));
          $('.be_usable').html(removeZero(commissionNumber) + '元');
          $('.commission_num').html(removeZero(commissionNumber) + '元');

          // commission_num
        } else {
          window.bravetime.newAlert('您选择的红包金额过大');
        }
      }
    });


    // 点击年终奖
    $('.year_ward').on('click', function(e) {
      if (e.target.className == 'dealIcon') {

        // location.href = "/t-14491.html";
        return;
      }
      if (window.isYearAward == '0') {
        $('.year_ward_num').html('<span class = "no_condition">不满足使用门槛</span>');
        return;
      }

      // var yearMoneyKey = [],yearMoneyVal = [];
      // if ($(".year_ward_ipt").hasClass("isDisabled")) {
      //     return;
      // }

      // 获取红包
      var yearNumStr = $('#reduce_bouns').html(),
        yearBounsNum,
        yearPostFee = $('.price_add').find('.item_num').html(),
        yearPostFeeNum;
      if (yearNumStr) {
        yearBounsNum = Number(+yearNumStr.replace('-￥', '')); // 获取红包
      } else {
        yearBounsNum = 0;
      }

      // 得到邮费
      if (yearPostFee) {
        yearPostFeeNum = Number(yearPostFee.replace('￥', ''));
      } else {
        yearPostFeeNum = 0;
      }
      var yearNum = $('.yearNums').html();

      // 重新计算返现
      if ($('.year_ward_ipt').hasClass('year_ward_ipt_checked')) {
        commissionNumber = Math.min(window.maxUseIncome, (orderAmount + yearPostFeeNum - yearBounsNum) * commissionRate);
      } else {
        commissionNumber = Math.min(window.maxUseIncome, (orderAmount + yearPostFeeNum - yearBounsNum - yearNum) * commissionRate);
      }

      $('#brokerage').html('-￥' + removeZero(commissionNumber * +!!password));
      $('.be_usable').html(removeZero(commissionNumber) + '元');
      $('.commission_num').html(removeZero(commissionNumber) + '元');

      // 得到返现
      var backMoney = $('.commission_num').html(),
        backNum;
      if (backMoney) {
        backNum = backMoney.replace('元', '');
      } else {
        backNum = 0;
      }

      // 未减年终奖的金额
      var finalYearNum = Number(removeZero(Number(orderAmount) - Number(backNum) + Number(yearPostFeeNum) - Number(yearBounsNum)));

      $(this).find('.year_ward_ipt').toggleClass('year_ward_ipt_checked');
      if ($('.year_ward_ipt').hasClass('year_ward_ipt_checked')) {
        $('#all_price_reduce_bouns').html('￥' + removeZero(finalYearNum - Number(yearNum)));
      } else {
        $('#all_price_reduce_bouns').html('￥' + finalYearNum);
      }
    });


    function oldBonus() {
      var items = cartConfirmContainer.find('.b_item');
      var bounsNum = items.length; // 红包数量
      if (bounsNum) {
        $('.bouns_scroll').css('width', 170 * items.length + 'px');
        var myScroll = new IScroll('#fffuc', {
          scrollX: true,
          scrollY: false,
          mouseWheel: true,
          tap: true,
          preventDefaultException: false,
          preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|DIV)$/}
        });
        scroller = myScroll;
        cartConfirmContainer.find('.choice_bouns').on('click', function() {
          var me = $(this);
          if ($('.bouns_container').hasClass('hide')) {
            $('.bouns_container').removeClass('hide');
            me.find('.icon').removeClass('down');
          } else {

            $('.bouns_container').addClass('hide');
            me.find('.icon').addClass('down');
          }
        });
        var tmpBonusId = false;
        for (var i = 0; i < items.length; i++) {
          $(items.get(i)).click(function() {
            selectBonus(this);
          });
          if (!bounsId && orderAmount > +$(items.get(i)).attr('data-for-num')) {
            selectBonus(items.get(i), true);
            tmpBonusId = true;

          } else if (!bounsId) {
            $(items.get(i)).addClass('big');
          } else {
            if ($(items.get(i)).attr('data-for-id') == bounsId) {
              selectBonus(items.get(i), true);
              tmpBonusId = true;
            }
          }
        }

        if (!bounsId) {
          selectBonus(false);
        } else {
          if (!tmpBonusId) {
            selectBonus(false);
          }
        }

        $('.cancel_bouns').click(function() {
          selectBonus(false);
        });

        function selectBonus(el, flag) {
          if (el) {
            var num = +$(el).attr('data-for-num');
            var id = $(el).attr('data-for-id');
          } else {
            var num = 0;
            var id = null;
            items.removeClass('selected');
          }

          // removeZero
          // var numTxt = num.toFixed(2);
          var numTxt = removeZero(num);
          if (orderAmount > num) {
            items.removeClass('selected');
            $(el).addClass('selected');
            cartConfirmContainer.find('.bouns_title').find('.bouns_number').html(numTxt + '元');
            $('#reduce_bouns').html('-￥' + numTxt);

            // $("#all_price_reduce_bouns").html("￥" + (orderAmount - num).toFixed(2));
            $('#all_price_reduce_bouns').html('￥' + removeZero(orderAmount - num));
            if (!flag) {

              $('.bouns_container').addClass('hide');
              cartConfirmContainer.find('.choice_bouns').find('i').addClass('down');
            } else {
              scroller.scrollToElement(el);
            }

          } else {
            window.bravetime.newAlert('您选择的红包金额过大');
          }

          bounsId = id;
        }
      } else {

        // 没有红包直接
      }
    }


    // 底部支付
    // $(".cart_confirm_bottom_container").find(".buy").click(pay);
    $('.cart_confirm_bottom_container').find('.newConfirm_right').click(pay);

    // 返回
    $('.cart_confirm_bottom_container').find('.back').click(function() {
      history.back();
    });


    // 切换地址统计
    cartConfirmContainer.find('.change_address_container').find('a').click(function(event) {

      /* Act on the event */
      window.iii = setInterval(
        function() {
          reload();
        }, 100
      );

      var url = location.href;
      if (url.indexOf('abct=') > -1) {
        url = url.replace(/t=[\d]+/g, 't=' + Date.now());
      } else if (url.indexOf('?') > -1) {
        url += '&abct=' + Date.now();
      } else {
        url += '?abct=' + Date.now();
      }
      history.replaceState(null, document.title, url);

      window.open($(this).attr('href'), '_self');
      event.preventDefault();
      return false;
    });


    // ios fix

    window.inputFocusFixFunction = function() {
      $('.cart_confirm_bottom_container').addClass('nofixed');
      $('.top0').addClass('nofixed');
      $('body').addClass('pb300');
    };
    window.inputBlurFixFunction = function() {
      $('.cart_confirm_bottom_container').removeClass('nofixed');
      $('.top0').removeClass('nofixed');
      $('body').removeClass('pb300');
    };
  } else {
    window.inputFocusFixFunction = function() {
      $('.top0').addClass('nofixed');
    };
    window.inputBlurFixFunction = function() {
      $('.top0').removeClass('nofixed');
    };
  }

  var parm = {
    toObj: function(searchStr) {
      var obj = {};
      searchStr = searchStr || location.search.split('?')[1];
      if (searchStr) {
        var paramMapArr = searchStr.split('&');
        for (var i in paramMapArr) {
          var paramMap = paramMapArr[i].split('=');
          obj[paramMap[0]] = paramMap[1] || '';
        }
      }
      return obj;
    },
    getAll: function(url) {
      url = url || location.href;
      var searchStr = url.split('?')[1];
      searchStr = searchStr ? searchStr.split('#')[0] : searchStr;
      return this.toObj(searchStr);
    },
    get: function(name, url) {
      if (name) {
        return this.getAll(url)[name];
      } else {
        throw new Error('name参数不能为空');
      }
    }
  };
  var is_story = parm.get('is_story', location.href);

  // jianchep
  if (window.Units.getQuery('after_sale') && window.Units.getQuery('refer_page_type') == 'barter' && window.Units.getQuery('deliveryId')) {
    var addressId = sessionStorage.getItem('after_sale_address_' + window.Units.getQuery('deliveryId')) || $('.address_list .default').parents('.address').attr('data-for');
    var $addressList = $('.address_list li');
    for (var i = 0; i < $addressList.length; i++) {
      if ($($addressList[i]).attr('data-for') == addressId) {
        $addressList[i].setAttribute('class', 'address without_id_card current');
      }
    }
  }

  var addressList = $('.wd_address_list');
  var addressLink = addressList.find('.address');
  addressLink.each(function(index, el) {
    var address_id = $(el).attr('data-for');
    $(el).find('a.show').click(function(event) {
      if (localStorage.getItem('fromGuinness')) {
        if (localStorage.getItem('address_id')) {
          localStorage.removeItem('address_id');
        }
        localStorage.setItem('address_id', address_id);
        localStorage.removeItem('fromGuinness');
        window.history.back = function() {
          return;
        };
        window.location.href = '/guinness.html';
        return;

        // alert("fromGuinness");
      }

      // window.location.href="/guinness.html";
    });
  });

  // 地址列表页
  var addressList = $('.wd_address_list');
  if (addressList && addressList.length) {
    var page = window.page || '地址列表页';
    $.cookie('dvd_cart_to_confirm', 1);
    $.cookie('PassOrderDetail', 1);
    var addressLink = addressList.find('.address');
    addressLink.each(function(index, el) {
      var address_id = $(el).attr('data-for');
      $(el).find('a.show').click(function(event) {

        /* Act on the event */
        addressLink.removeClass('current');
        $(el).addClass('current');
        var obj = {};
        if (is_story == 1) {
          obj = {
            address_id: address_id,
            is_story: is_story
          };
        } else {
          obj = {address_id: address_id};
        }

        // 这里是售后页面进地址列表页面，啥时候做个前后端分离吧太恶心了jianchep
        if (window.Units.getQuery('after_sale')) {
          sessionStorage.setItem('after_sale_address_' + window.Units.getQuery('deliveryId'), address_id);
          window.sessionStorage.setItem('state', 1);
          history.back();
          return false;
        }

        $.ajax({
          url: setCurrentUrl,
          type: 'POST',
          dataType: 'json',
          data: obj,
          success: function(result) {
            if (result['error'] == 0) {

              // 2018-07-09 暑假活动存储地址id
              sessionStorage['holiday_address_id'] = address_id;

              history.back();
            } else {
              bravetime.newAlert(result['msg']);
            }
          },
          error: function() {
            bravetime.ajaxError(7);
          }
        });
        return false;
      });
      $(el).find('.default_switcher').click(function(event) {

        /* Act on the event */
        addressLink.find('.default_switcher').removeClass('default');
        $(this).addClass('default');
        $.ajax({
          url: setDefaultUrl,
          data: {address_id: address_id},
          error: function() {
            bravetime.ajaxError(8);
          }

        });
      });
    });


    // 删除地址
    $('.delete').each(function(index, el) {

      $(el).click(function() {
        var address_id = $(el).parents('.address').attr('data-for');
        window.bravetime.newConfirm('您确定要删除改地址么？', {
          okLink: function() {
            window.bravetime.newInfo('地址删除中');
            $.ajax({
              url: deleteUrl,
              type: 'POST',
              dataType: 'json',
              data: {address_id: address_id},
              success: function(result) {
                if (result['error'] == 0) {
                  location.reload();
                } else {
                  var msg = result['msg'] || '后台接口问题？？';
                  bravetime.newAlert(msg);
                }
              },
              error: function() {
                bravetime.ajaxError(9);
              }
            });
          },
          cancelLink: function() {

          }
        });
        return false;
      });
    });


  }


  function reload() {
    if ($.cookie('set_from_mobile')) {

      location.reload();

      // locationSub.reload();
    }
    if ($.cookie('dvd_cart_to_confirm') || $.cookie('set_from_mobile')) {
      clearInterval(window.iii);
      $.removeCookie('dvd_cart_to_confirm');
      $.cookie('no_refresh', 1);
      var url = location.href;
      if (url.indexOf('abct=') > -1) {
        url = url.replace(/t=[\d]+/g, 't=' + Date.now());
      } else if (url.indexOf('?') > -1) {
        url += '&abct=' + Date.now();
      } else {
        url += '?abct=' + Date.now();
      }

      //
      // if (url.indexOf('goods') > -1) {
      //   var locationIdx = url.indexOf('?'),
      //     url = url.substring(0,locationIdx);
      // }
      location.replace(url);
    }
  }

  function changeObj(str) {
    var numbers = str.split('&');
    var obj = {},
      isNum = true;
    numbers.map(function(item) {
      var idx = item.indexOf('=');
      var num = item.slice(idx + 1);

      // if (isNum) {
      //   obj["id"] = num;
      //   isNum = false;
      // } else {
      //   obj["number"] = num;
      //   isNum = true;
      // }
      var subStr = item.slice(8).match(/\[(\S*)\]/ig)[0],
        subStrLen = subStr.length;
      obj[subStr.slice(1, subStrLen - 1)] = num;
    });

    return JSON.stringify(obj);
  }

  function pay() {

    // 如果不是预定商品就不走这一行代码
    if (window.is_advance && window.is_advance == '1') {
      if (!$('.order_rule_ipt').hasClass('order_rule_ipt_checked')) {
        $('.order_navList').addClass('order_navList_line');
        document.body.scrollTop = document.body.scrollHeight;
        bravetime.info('请先同意定金不退相关规则，才能去支付哦～');
        return;
      }
    }

    var payData = {},
      el;

    // 校验身份证
    if ($('#idcard').length) {
      var idcard = window.idcard_id;

      if (!idcard) {
        bravetime.newAlert('请选择身份证');
        return;
      }

      payData['idcard'] = idcard;
    }

    // 校验邮编
    // if ($("#zipcode").length) {
    //     var zipcode = $("#zipcode").val();
    //     if (!Units.isZipcode(zipcode)) {
    //         bravetime.newAlert("请填写正确的邮编");
    //         return;
    //     }
    //     payData['zipcode'] = zipcode;
    // }
    // 如果order_id不为空，传order_id，为空传goods.
    // payData["order_id"] = $("#order_id").attr("value");
    payData['order_id'] = $('#order_id').attr('value');
    var goodsId = $('#goods').attr('value');

    // if (goodsId) {
    //   payData["goods"] = goodsId;
    // }

    payData['note'] = $('#note').val();
    payData['bonus_id'] = bounsId || 0;
    payData['address_id'] = window.addressId;
    payData['password'] = password;
    payData['commission'] = commissionNumber;

    // 年终奖
    if (window.yearPaid && window.yearPaid != '0') {
      if ($('.year_ward_ipt').hasClass('year_ward_ipt_checked')) {
        payData['isUseYearAward'] = 1;
      } else {
        payData['isUseYearAward'] = 0;
      }
    }

    var successFunction = function(data) {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      if (data['status'] == 0) {

        // 如果是 低版本 app 低于 5.6.0 则对预定商品做弹框提示
        window.bravetime.nativePay(data['url'], function(flag, order_id) {
          if (flag) {

            // 支付成功
            // $.cookie("dvd_cart_to_confirm", 1);
            // history.back();
            // 分解URL里的参数
            try {
              var url2 = data['url'];
              var option = {};
              if (url2.split('app_pay/').length > 1) {
                var list = url2.split('app_pay/')[1].split('&');
                for (var i = 0; i < list.length; i++) {
                  var key = list[i].split('=')[0];
                  var value = list[i].split('=')[1];
                  option[key] = value;
                }
              }
              window.bravetime.hideNew();
              if (option['succeedRedirectUrl'] && option['succeedRedirectUrl'] != '') {
                location.replace(decodeURIComponent(option['succeedRedirectUrl']));
              } else {
                $.cookie('dvd_cart_to_confirm', 1);
                history.back();
              }
            } catch (err) {
              console.log(err);
            }
          } else {

            // 支付失败
            window.bravetime.hideNew();
            location.replace('/o-' + order_id + '.html');
          }
        });
        $.cookie('dvd_cart_to_confirm', 1);

        // window.bravetime.goto(data["url"]);
      } else if (data['status'] == -3) {
        window.bravetime.hideNew();
        location.replace(data['url']);
      } else if (data['status'] == -10) {
        window.bravetime.hideNew();
        window.bravetime.newAlert(data['msg'], function() {
          window.bravetime.goto(data['url']);
        });
      } else {
        window.bravetime.newAlert(data['msg']);
      }
      $('.cart_confirm_bottom_container').removeClass('hide');
    };
    var errorFunction = function(result) {
      bravetime.hideNew();
      bravetime.ajaxError(10);
      $('.cart_confirm_bottom_container').removeClass('hide');
    };

    window.bravetime.newInfo('正在连接安全支付...');
    $('.cart_confirm_bottom_container').addClass('hide');

    if (goodsId) {
      $.ajax({
        url: payActionUrl + '&' + goodsId,
        data: payData,
        success: successFunction,
        error: errorFunction
      });
    } else {
      $.ajax({
        url: payActionUrl,
        data: payData,
        success: successFunction,
        error: errorFunction
      });
    }
  }

  window.submitConfirm = function() {

    var maybeError = false; // 收货人可能是错的
    var consignee = $('#consignee').val();
    var maybeArray = ['先生', '女士', '小姐'];
    for (var index = 0, maybeStr; maybeStr = maybeArray[index++];) {
      if (consignee.indexOf(maybeStr) > -1) {
        maybeError = true;
      }
    }

    if (consignee.search(/[^\u4E00-\u9FA5]/) > -1) {
      maybeError = true;
    }


    if (!consignee.length) {
      bravetime.newAlert('请填写收货人姓名');
      return false;
    }
    if (consignee.length > 16) {
      bravetime.newAlert('收货人姓名过长');
      return false;
    }

    var tel = $('#mobile').val();

    // 手机号去空格和-处理
    tel = tel.replace(/[ -]/g, '');
    $('#mobile').val(tel);
    if (!Units.isTel(tel)) {
      bravetime.newAlert('请填写正确的电话号码');
      return false;
    }

    var selProvincesValue = $('#selProvinces').val();
    if (selProvincesValue == 0) {
      bravetime.newAlert('请选择省份');
      return false;
    }

    var selCitiesValue = $('#selCities').val();
    if (selCitiesValue == 0) {
      bravetime.newAlert('请选择城市');
      return false;
    }

    var selDistrictsValue = $('#selDistricts').val();
    if (selDistrictsValue == 0) {

      // 未选择的状态
      bravetime.newAlert('请选择地区');
      return false;
    }

    var selStreetValue = $('#street').val();
    if (selStreetValue == 0 && $('#selDistricts').val() >= 0) {
      bravetime.newAlert('请选择街道');
      return false;
    }

    var address = $('#address').val();
    if (!address.length) {
      bravetime.newAlert('请输入详细地址');
      return false;
    }

    if ($('#idcard').length) {
      var id = $('#idcard').html();
      if (!Units.isIdcard(id)) {
        bravetime.newAlert('请填写正确的身份证号码');
        return false;
      }
    }
    if ($('#zipcode').length) {
      var zipcode = $('#zipcode').val();
      if (!Units.isZipcode(zipcode)) {
        bravetime.newAlert('请填写正确的邮政编码');
        return false;
      }
    }

    var idCardContainer = $('#idcard');
    if (idCardContainer.length && maybeError) {
      bravetime.newConfirm('您确定身份证号<br/>' + id + '<br/>对应的姓名为 <span class=\'dav-red\'>' + consignee + '</span> 么?', {
        cancelText: '再改下',
        okLink: function() {
          submitFunction();
        }
      });
    } else {
      submitFunction();
    }

    function submitFunction() {
      var btn = $('#consigneeForm').find('.dav-btn');

      btn.addClass('btn-disable').find('span.text').html('提交中...');

      bravetime.info('地址提交中...');

      $('#consigneeForm').ajaxSubmit({
        success: function(result) {

          if (localStorage.getItem('fromGuinness')) {
            window.location.href = '/user_address.html';
            return;
          }
          btn.removeClass('btn-disable').find('span.text').html('确认');
          if (typeof result === 'string') {
            result = JSON.parse(result);
          }
          if (result['error'] == 0) {
            if (!window.isPrivateMode && window.sessionStorage) {
              sessionStorage.setItem('share_get_flag', 1);
            }
            $.cookie('share_get_flag', 1);
            eval(result['callbackStr']);
          } else if (result['error'] == '-2') {
            window.bravetime.newAlert(result['msg'], function() {
              eval(result['callbackStr']);
            });
          } else if (result['error'] == '-10') {
            bravetime.newConfirm(result['msg'], {
              cancelText: '取消',
              okLink: function() {

                // 添加force=1参数
                $('#force').val(1);

                // 再次提交
                window.submitConfirm();
              }
            });
          } else {
            bravetime.newAlert(result['msg']);
          }
        },
        error: function(error) {
          btn.removeClass('btn-disable').find('span.text').html('确认');
          bravetime.ajaxError(11);
        }
      });
    }


  };



  var addressData, proContainer = $('#selProvinces'),
    cityContainer = $('#selCities'),
    disContainer = $('#selDistricts'),
    StreetContainer = $('#street');
  if (window.addressStaticDataUrl) {
    var isReady = false,
      isError = false,
      currentCityList = [],
      currentDisList = [],
      currentStreetList = [];
    regionHandler(function() {

      // 初始化的东西
      // 如果有已经选中的
      var proIndex = proContainer.val(),
        cityIndex = cityContainer.val(),
        disIndex = disContainer.val();
      console.log('proIndex:', proIndex);
      console.log('cityIndex:', cityIndex);
      console.log('disIndex:', disIndex);
      if (proIndex) {
        selectProvince(proIndex, true);
      }
      if (cityIndex) {
        selectCity(cityIndex, true);
      }
      if (disIndex) {
        selectDis(disIndex, true);
      }
    });
    $('.input_wrap select').change(function() {
      var name = $(this).attr('name'),
        index = $(this).val();

      // console.log("name:",name);
      // console.log("index:",index);
      if (name == 'province' && index > 0) {
        selectProvince(index);
      } else if (name == 'city' && index > 0) {
        selectCity(index);
      } else if (name == 'district') {

        // index=0和index=-1代表请选择和暂不选择都没有d[2]所以不展示四级地址
        selectDis(index);
      }
    });


    function selectProvince(index, initFlag) {
      if (isError) {
        bravetime.info('地址列表数据获取异常,请刷新重试');
      } else if (!isReady) {
        bravetime.info('地址列表数据获取中,请稍后');
      } else {
        for (var i = 0, d; d = addressData[i++];) {
          if (d[0] == index) {
            currentCityList = d[2];
            break;
          }
        }
        console.log('currentCityList:', currentCityList);
      }
      if (initFlag && cityContainer.val()) {
        return false;
      }
      cityContainer.empty();
      disContainer.empty();
      StreetContainer.empty();
      var opt = $('<option></option>').text('请选择').val(0);
      StreetContainer.append(opt);
      var opt = $('<option></option>').text('请选择区').val(0);
      disContainer.append(opt);
      var opt = $('<option></option>').text('请选择市').val(0);
      cityContainer.append(opt);
      for (var i = 0, d; d = currentCityList[i++];) {
        var opt = $('<option></option>').text(d[1]).val(d[0]);
        cityContainer.append(opt);
      }
    }

    function selectCity(index, initFlag) {
      for (var i = 0, d; d = currentCityList[i++];) {
        if (d[0] == index) {
          currentDisList = d[2];
          break;
        }
      }
      if (initFlag && disContainer.val()) {
        return false;
      }
      disContainer.empty();
      StreetContainer.empty();
      var opt = $('<option></option>').text('请选择').val(0);
      StreetContainer.append(opt);
      var opt = $('<option></option>').text('请选择区').val(0);
      disContainer.append(opt);
      console.log('currentDisList:', currentDisList);
      for (var i = 0, d; d = currentDisList[i++];) {
        var opt = $('<option></option>').text(d[1]).val(d[0]);
        disContainer.append(opt);
      }
    }

    function selectDis(index, initFlag) {
      console.log('index:', index);

      for (var i = 0, d; d = currentDisList[i++];) {
        if (d[0] == index) {

          // 一定能走到

          if (d[2]) {
            currentStreetList = d[2];
            $('#street').show();
          } else {
            $('#street').hide();
          }
          break;
        }
      }
      if (initFlag && StreetContainer.val()) {
        return false;
      }
      StreetContainer.empty();
      var opt = $('<option></option>').text('请选择').val(0);
      StreetContainer.append(opt);
      console.log('currentStreetList:', currentStreetList);
      for (var i = 0, d; d = currentStreetList[i++];) {
        var opt = $('<option></option>').text(d[1]).val(d[0]);
        StreetContainer.append(opt);
      }
    }
  }

  function regionHandler(callback) {

    $.ajax({
      url: window.addressStaticDataUrl,
      dataType: 'json',
      success: function(result) {
        isReady = true;
        addressData = result;
        if (typeof callback === 'function') {
          callback();
        }
      },
      error: function() {
        $.ajax({
          url: window.addressStaticDataUrl.replace('fe.', 'fe6.').replace('fe2.', 'fe6.').replace('fe3.', 'fe6.'),
          dataType: 'json',
          success: function(result) {
            isReady = true;
            addressData = result;
            if (typeof callback === 'function') {
              callback();
            }

            // bravetime.tj.evSend({category: tj_path, action: "address_tj", label: "address_ok", value: 1, nodeid: tj_id});
          },
          error: function() {

            isError = true;

            // bravetime.tj.evSend({category: tj_path, action: "address_tj", label: "address_error", value: 1, nodeid: tj_id});
          }
        });
      }
    });
  }

  // 订单确认页,监听邮编输入
  if ($('.cart_confirm_zipcode').length) {
    public_changse();
    $('.cart_confirm_zipcode').on('input propertychange', function() {
      var zipcode = $('#zipcode').val();
      public_changse();
    });
  }

  // 订单确认页,监听邮编输入
  if ($('#idcard').length) {
    public_changse();
  }

  // 如果身份证或邮编为空,支付按钮不可以点击
  function public_changse() {
    var idcard = $('#idcard').html();
    var zipcode = $('#zipcode').val();
    if (zipcode == '' || idcard == '') {
      $('.newConfirm_right').addClass('disableGray');

      // $(".buy").removeClass("btn-red");
      // $(".buy").addClass("btn-disable")
    } else {
      $('.newConfirm_right').removeClass('disableGray');

      // $(".buy").addClass("btn-red");
      // $(".buy").removeClass("btn-disable")
    }
  }

  // 预定商品点击相关规则
  $('.order_navList').on('click', function(e) {
    if (e.target.className == 'dealIcon') {
      location.href = '/t-14491.html';
      return;
    }
    $(this).find('.order_rule_ipt').toggleClass('order_rule_ipt_checked');
    if ($('.order_rule_ipt').hasClass('order_rule_ipt_checked')) {
      $(this).removeClass('order_navList_line');
    }
  });

  // 年终奖相关
  // if (Date.now() > new Date("2017/12/12 00:00:00").getTime() && Date.now() < new Date("2017/12/13 00:00:00").getTime()) {
  if (window.yearPaid) {

    // var yearTotalMoney = $("#all_price_reduce_bouns").html().substr(1);
    $('.yearNums').html(window.yearPaid);
    if (window.yearPaid != '0') {
      if (window.isYearAward != '0') {
        var yearNum = $('.yearNums').html();

        $('.year_ward_ipt').addClass('year_ward_ipt_checked');
      } else {
        $('.year_ward_num').html('<span class = "no_condition">不满足使用门槛</span>');
      }
      $('.year_ward_cont').show();
    }
  }

  function yearRule() {
    $('.dealIcon').click(function() {

      // $(".yearRule_cont").show();
    });
    $('.tax-close').click(function() {
      $('.yearRule_cont').hide();
    });
    $('.weui-mask').click(function(e) {
      $('.yearRule_cont').hide();
    });
  }

  yearRule();

  // }


  // 显示mua值说明
  $('.dealIcon').click(function() {
    $('.yearRule_cont').css('display', 'block');
  });


  $('.account_bouns').click(function() {
    setTimeout(function() {
      location.reload();
    }, 500);
  });
});
