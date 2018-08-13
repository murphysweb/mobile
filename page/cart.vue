<template>
<div>
  <!--<div class="top0">-->
  <!--<div class="top_container">-->
  <!--&lt;!&ndash;top_back改为a标签，如果有上一页链接地址改为 javascript:history.back();或者你想执行的语句，否则链接改为真正的链接&ndash;&gt;-->
  <!--<div class="top_left">-->
  <!--<a class="top_back" href="javascript:history.back();">-->
  <!--<span class="home_arrow"></span>-->
  <!--</a>-->
  <!--</div>-->
  <!--<div class="title_container">-->
  <!--购物车<span class="cart_number" v-text="'('+cartInfo.sku_count_all+')'"-->
  <!--v-if="cartInfo.sku_count_all"></span>-->
  <!--</div>-->
  <!--<div class="top_right" @click="toggleEditMode">-->
  <!--<a v-if="cartInfo.isEmpty" href="/" class="top_home">-->
  <!--<span class="home_icon"></span>-->
  <!--</a>-->
  <!--<a v-else class="top_btn">-->
  <!--<span class="text_btn" v-text="editMode?'完成':'编辑'">编辑</span>-->
  <!--</a>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <com-top-title :home="cartInfo.isEmpty">
    <div slot="center">
      购物车<span class="cart_number" v-text="'('+cartInfo.sku_count_all+')'" v-if="cartInfo.sku_count_all"></span>
    </div>
    <div slot="right">
      <div class="top_right" @click="toggleEditMode">
        <!--<a v-if="cartInfo.isEmpty" href="/" class="top_home">-->
        <!--<span class="home_icon"></span>-->
        <!--</a>-->
        <a class="top_btn" v-if="!cartInfo.isEmpty">
          <span class="text_btn" v-text="editMode?'完成':'编辑'">编辑</span>
        </a>
      </div>
    </div>
  </com-top-title>


<!-- <div class="center dav-small dav-red info59" v-if="!cartInfo.isEmpty&&cartInfo.total_number==0">
  <span>满59元可享包邮 </span>
</div>

<div class="center dav-small dav-red info59" v-if="!cartInfo.isEmpty&&cartInfo.goods_amount<59&&cartInfo.total_number>0&&!book_stacks_data.dataList.length">
  <span>未满59元，<a class="underline" href="/">去凑单</a> ></span>
</div>
<div class="center dav-small dav-red info59" v-if="(!cartInfo.isEmpty&&cartInfo.goods_amount>=59)||book_stacks_data.dataList.length">
  <span>已享受包邮 </span>
</div> -->

  <!--商品列表部分-->
  <!-- <div class="goods_in_cart" v-if="!cartInfo.isEmpty" :style="{'margin-top': ua.isDvdApp() && ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') >= 0 ? '44px' : null}"> -->
     <div class="goods_in_cart" v-if="!cartInfo.isEmpty" :style="{'margin-top': ua.isDvdApp() && ua.compareVersion(ua.getDvdAppVersion(), '5.2.0') >= 0 ? '44px' : null}">
    <!--小书库部分-->
    <div v-if="book_stacks_data.dataList.length" class="reduce_item_container">
      <div class="book_stacks_incart">
        <!--活动标签-->
        <div class="reduce_item_title">
          <i @click="bookstackselect()" class="icon dav_icon_choice_selected_40_40" :class="{'dav_icon_choice_no_selected_40_40':!book_stack_selected}" style="margin-right:10px;"></i>
          <span class="book_stack_title">小书库</span>
          <div class="price_info_reduce dav-red">已包邮</div>
          <a href="/book_stacks_new.html" class="icon_r_container">变更图书选择
        <i class="icon dav_icon_dayuhao_10_22 dav-border-red dav-border-red"></i></a>
        </div>
        <div class="goods_item_s">
          <div class="good_item checked" v-for="goods in book_stacks_data.dataList" :key="goods" track-by="$index" :class="{'checked':goods.checked}" goods-id="{{goods.goods_id}}" max-count="{{goods.purchase_limit||200}}">
            <!--图标-->
            <div class="icon_container">
              <!--书库统一线-->
              <div class="lines_top"></div>
            </div>
            <!--商品图-->
            <a class="pic_container" href="/{{goods.goodsId}}.html{{refererStr}}" @click="gotoGoods()">
          <img class="good_img" :src="goods.imgUrl"></a>
            <!--右侧-->
            <div class="right_container">
              <a class="good_title" href="/{{goods.goodsId}}.html{{refererStr}}" v-text="goods.title" @click="gotoGoods()"></a>
              <div class="goods_infos_wrap">
                <div class="book_recomWord">{{goods.recomWord}}</div>
                <!--价格-->
                <div class="good_price dav-color-price">
                  <span class="dav-red s_price_number">
                <em>￥</em>{{goods.shopPrice}}</span></div>
              </div>
            </div>
          </div>
        </div>
        <!--小书库底部标签-->
        <!--<a class="reduce_item_title"href="javascript:void()">小书库已包邮，与其他商品一起下单共享免邮<span class="icon_r_container">看更多<i class="icon dav_icon_dayuhao_10_22 dav-border-red dav-border-red"></i></span></a>--></div>
      <!--活动标签-->
      <a class="reduce_item_title" :href="activity.act_url||'javascript:void()'" v-if="activity.act_id>0">
    <span class="dav-red">{{activity.act_type_name}}</span>{{activity.act_info}}
    <span class="icon_r_container">
      <i v-if="activity.act_url != undefined && activity.act_url != null && activity.act_url != 0" class="icon dav_icon_dayuhao_10_22 dav-border-red dav-border-red"></i></span>
  </a>
      <div class="goods_item_s">
        <div class="good_item checked" v-for="goods in activity.goods" :key="goods" track-by="$index" :class="{'checked':goods.checked}" goods-id="{{goods.goods_id}}" max-count="{{goods.purchase_limit||200}}">
          <!--图标-->
          <div class="icon_container">
            <!--无效商品-->
            <span class="invalid_lable" v-if="activity.act_id==-1">失效</span>
            <!--非编辑模式-->
            <i class="icon" v-show="!editMode&&activity.act_id>=0" @click="toggleCheckStatus(goods,activity)" :class="{'dav_icon_choice_selected_40_40':goods.checked,'dav_icon_choice_no_selected_40_40':!goods.checked}"></i>
            <!--编辑模式-->
            <i class="icon" v-show="editMode&&activity.act_id>=0" @click="toggleEditStatus(goods)" :class="{'dav_icon_choice_selected_40_40':goods.edit_checked,'dav_icon_choice_no_selected_40_40':!goods.edit_checked}"></i>
          </div>
          <!--商品图-->
          <a class="pic_container" href="/{{goods.goods_id}}.html{{refererStr}}" @click="gotoGoods()">
        <img class="good_img" :src="goods.goods_thumb">
        <div class="sale_prompt_text" v-if="goods.pre_sale">预售</div>
        <span class="sold_out" v-if="goods.goods_stocks<=0">售罄</span></a>
          <!--右侧-->
          <div class="right_container">
            <a class="good_title" href="/{{goods.goods_id}}.html{{refererStr}}" v-text="goods.goods_name" @click="gotoGoods()"></a>
            <div class="goods_infos_wrap">
              <div class="cart_format" :class="{ cart_format_h: goods.goods_tags && goods.goods_tags.length }">
                <span v-for="tag in goods.goods_tags" :key="tag" v-text="tag.tag_name"></span>
              </div>
              <!--优惠-->
              <!--<div class="price_info_reduce dav-red"v-if="goods.price_act_name"-->
              <!--v-text="goods.price_act_name+'价'"></div>-->
              <div v-if="goods.price_act_name == '限时'" class="price_info_reduce dav-red" v-text="goods.price_act_name+'购'"></div>
              <div v-else class="price_info_reduce dav-red" v-text="goods.price_act_name+'价'"></div>
              <div class="price_info_reduce dav-red" v-if="!goods.price_act_name&&goods.purchase_limit" v-text="'限购'+goods.purchase_limit+'件'"></div>
              <!--价格-->
              <div class="good_price dav-color-price">
                <span class="dav-red s_price_number">
              <em>￥</em>{{goods.goods_price}}</span></div>
              <!--会员返返现-->
              <div v-if="goods.seller_income != '0' && userStatus == 3" class="income_vip">会员返
                <em>￥</em>{{goods.seller_income}}</div>
              <!--商品数量-->
              <div class="sold_out_collect" v-if="activity.act_id>=0&&!goods.goods_stocks" @click="collect(goods)">转到收藏</div>
              <div class="good_number_container" v-if="activity.act_id>=0&&goods.goods_stocks">
                <div class="input_control">
                  <div class="minus change_num" @click="changeGoodsNumber(goods,-1,activity)">-</div>
                  <input type="tel" v-model="goods.goods_number" @change="changeGoodsNumber(goods,0,activity)">
                  <div class="plus change_num" :class="{'disable':goods.goods_number>=goods.max_amount}" @click="changeGoodsNumber(goods,1,activity)">+</div>
                </div>
              </div>
            </div>
          </div>
          <!--超出库存-->
          <div class="seckill_countdown_right" v-if="goods.goods_stocks>0&&goods.goods_number>goods.goods_stocks">
            <span>商品数量超出库存</span></div>
          <!--降价-->
          <div class="price_change" v-if="!(goods.sag_left_time > 0)&&!(goods.fsp_left_time > 0)&&!(goods.bkg_left_time > 0) && goods.reduce_money">比加入时降{{goods.reduce_money}}元</div>
          <!--限时购倒计时和其他信息-->
          <!--秒杀商品-->
          <span v-if="goods.sag_left_time > 0">
        <!--秒杀和几倍返现同事存在-->
        <span v-if="goods.bkg_left_time > 0">
          <!--秒杀剩余时间少于翻倍返现剩余时间-->
          <div class="ts_info_limit seckill_countdown" v-if="goods.bkg_left_time > goods.sag_left_time" style="color:#ff4a7d;">{{goods.sag_left_time|datetimeFormat}}，可享受秒杀和{{goods.act_income.ratio}}倍返利优惠
            <span v-if="goods.reduce_money">，比加入时降
              <span class="dav-red">{{goods.reduce_money}}元</span></span>
        </div>
        <!--秒杀剩余时间大于翻倍返现剩余时间-->
        <div class="ts_info_limit seckill_countdown" v-else style="color:#ff4a7d;">{{goods.bkg_left_time|datetimeFormat}}，可享受秒杀和{{goods.act_income.ratio}}倍返利优惠
          <span v-if="goods.reduce_money">，比加入时降
              <span class="dav-red">{{goods.reduce_money}}元</span></span>
        </div>
        </span>
        <!--只有秒杀-->
        <span v-else>
          <div class="ts_info_limit seckill_countdown dav-red" style="color:#ff4a7d;">{{goods.sag_left_time|datetimeFormat}}
            <span v-if="goods.reduce_money">，比加入时降
              <span class="dav-red">{{goods.reduce_money}}元</span></span>
      </div>
      </span>
      </span>
      <!--限时购商品-->
      <span v-if="goods.fsp_left_time > 0">
        <!--限时购和几倍返现同事存在-->
        <span v-if="goods.bkg_left_time > 0">
          <!--限时购剩余时间少于翻倍返现剩余时间-->
          <div class="ts_info_limit seckill_countdown" v-if="goods.bkg_left_time > goods.fsp_left_time">在
            <span class="dav-red">{{goods.fsp_left_time|datetimeFormatNew}}</span>内
      <span v-if="userStatus == 3">支付</span>
      <span v-else>成为会员</span>，可享受限时购和{{goods.act_income.ratio}}倍返利优惠
      <span v-if="goods.reduce_money">，比加入时降
              <span class="dav-red">{{goods.reduce_money}}元</span></span>
    </div>
    <!--限时购剩余时间大于翻倍返现剩余时间-->
    <div class="ts_info_limit seckill_countdown" v-else>在
      <span class="dav-red">{{goods.bkg_left_time|datetimeFormatNew}}</span>内
      <span v-if="userStatus == 3">支付</span>
      <span v-else>成为会员</span>，可享受限时购和{{goods.act_income.ratio}}倍返利优惠
      <span v-if="goods.reduce_money">，比加入时降
              <span class="dav-red">{{goods.reduce_money}}元</span></span>
    </div>
    </span>
    <!--只有限时购-->
    <span v-else>
          <div class="ts_info_limit seckill_countdown">在
            <span class="dav-red">{{goods.fsp_left_time|datetimeFormatNew}}</span>内
    <span v-if="userStatus == 3">支付</span>
    <span v-else>成为会员</span>，可享受限时购优惠
    <span v-if="goods.reduce_money">，比加入时降
              <span class="dav-red">{{goods.reduce_money}}元</span></span>
  </div>
  </span>
  </span>
  <!--只有返现翻倍-->
  <div class="ts_info_limit seckill_countdown" v-if="goods.bkg_left_time > 0 && !(goods.fsp_left_time > 0) && !(goods.sag_left_time > 0) ">在
    <span class="dav-red">{{goods.bkg_left_time|datetimeFormatNew}}</span>内
    <span v-if="userStatus == 3">支付</span>
    <span v-else>成为会员</span>，可享受{{goods.act_income.ratio}}倍返利优惠
    <span v-if="goods.reduce_money">，比加入时降
          <span class="dav-red">{{goods.reduce_money}}元</span></span>
  </div>
  <div class="ts_info_limit seckill_countdown" v-if="!(goods.sag_left_time > 0)&&!(goods.fsp_left_time > 0)&&!(goods.bkg_left_time > 0)&&goods.secondsp">
    <span style="color:#ff4a7d;">商品失效，请重新添加购物车</span></div>
  <div class="buy_gift" v-if="goods.buy_gift&&goods.buy_gift.length">
    <span class="dav-red">[赠品]</span>
    <div class="buy_gift_con">
      <a v-for="g in goods.buy_gift" :key="g" href="/{{g.gift_id}}.html">
        <sapn class="text" v-text="g.goods_name"></sapn>
        <span class="number" v-text="'X'+g.gift_number"></span>
      </a>
    </div>
  </div>
</div>
</div>
<!--商品列表-->
<!--赠品-->
<div class="premiums" v-if="activity.gifts&&activity.gifts.length">
  <div class="premiums_con" @click="show_gift(gift)" v-for="gift in activity.gifts" :key="gift" v-if="gift.gift_stocks != 0">
    <span class="dav-red">[满送]</span>{{gift.goods_name}}
    <span class="premiums_con_number" v-if="gift.gift_stocks">X{{gift.gift_number||1}}</span>
    <span class="premiums_con_number dav-red" v-if="!gift.gift_stocks">[已赠完]</span></div>
</div>
<!--清空失效-->
<div class="clear_shop april_border hairlines" v-if="activity.act_id==-1">
  <div class="dav-btn btn-small border_inner" @click="clearInvalidGoods">清空失效商品</div>
</div>
</div>
<!--循环输出商品组-->
<div class="reduce_item_container" v-for="activity in cartInfo.activitys" :key="activity" track-by="$index" :class="{'fail':activity.act_id==-1}">
  <!--活动标签-->
  <a class="reduce_item_title" :href="activity.act_url||'javascript:void()'" v-if="activity.act_id>0">
        <span class="dav-red">{{activity.act_type_name}}</span>
        {{activity.act_info}}
        <span class="icon_r_container">
                <i v-if="activity.act_url != undefined && activity.act_url != null && activity.act_url != 0"
                   class="icon dav_icon_dayuhao_10_22 dav-border-red dav-border-red"></i>
            </span>
      </a>
  <div class="goods_item_s">
    <div class="good_item checked" v-for="goods in activity.goods" track-by="$index" :key="goods" :class="{'checked':goods.checked}" goods-id="{{goods.goods_id}}" max-count="{{goods.purchase_limit||200}}">
      <!--图标-->
      <div class="icon_container">
        <!--无效商品-->
        <span class="invalid_lable" v-if="activity.act_id==-1">失效</span>
        <!--非编辑模式-->
        <i class="icon" v-show="!editMode&&activity.act_id>=0" @click="toggleCheckStatus(goods,activity)" :class="{'dav_icon_choice_selected_40_40':goods.checked,'dav_icon_choice_no_selected_40_40':!goods.checked}"></i>
        <!--编辑模式-->
        <i class="icon" v-show="editMode&&activity.act_id>=0" @click="toggleEditStatus(goods)" :class="{'dav_icon_choice_selected_40_40':goods.edit_checked,'dav_icon_choice_no_selected_40_40':!goods.edit_checked}"></i>
      </div>
      <!--商品图-->
      <!--<a class="pic_container" href="/{{goods.goods_id}}.html{{refererStr}}" @click="gotoGoods()">-->
      <a class="pic_container" v-if="goods.command && goods.command.content"
         :href="goods.command.content" @click="gotoGoods()">
            <img class="good_img" :src="goods.goods_thumb">
            <div class="sale_prompt_text" v-if="goods.pre_sale">预售</div>
            <span class="sold_out" v-if="goods.goods_stocks<=0">售罄</span>
      </a>

      <a class="pic_container" v-else href="/{{goods.goods_id}}.html{{refererStr}}" @click="gotoGoods()">
        <img class="good_img" :src="goods.goods_thumb">
        <div class="sale_prompt_text" v-if="goods.pre_sale">预售</div>
        <span class="sold_out" v-if="goods.goods_stocks<=0">售罄</span>
      </a>
      <!--右侧-->
      <div class="right_container">
        <!--<a class="good_title" href="/{{goods.goods_id}}.html{{refererStr}}" v-text="goods.goods_name" @click="gotoGoods()"></a>-->
        <a class="good_title" v-if="goods.command && goods.command.content" :href="goods.command.content" v-text="goods.goods_name" @click="gotoGoods()"></a>
        <a class="good_title" v-else href="/{{goods.goods_id}}.html{{refererStr}}" v-text="goods.goods_name" @click="gotoGoods()"></a>
        <div class="goods_infos_wrap">
          <div class="cart_format" :class="{ cart_format_h: goods.goods_tags && goods.goods_tags.length }">
            <span v-for="tag in goods.goods_tags" v-text="tag.tag_name" :key="tag"></span>
          </div>
          <!--优惠-->
          <!--<div class="price_info_reduce dav-red" v-if="goods.price_act_name"-->
          <!--v-text="goods.price_act_name+'价'"></div>-->
          <div v-if="goods.price_act_name && goods.price_act_name == '限时'" class="price_info_reduce dav-red" v-text="goods.price_act_name+'购'"></div>
          <div v-if="goods.price_act_name && goods.price_act_name != '限时'" class="price_info_reduce dav-red" v-text="goods.price_act_name+'价'"></div>
          <div class="price_info_reduce dav-red" v-if="!goods.price_act_name&&goods.purchase_limit" v-text="'限购'+goods.purchase_limit+'件'"></div>
          <!--价格-->
          <div class="good_price dav-color-price">
            <span class="dav-red s_price_number"><em>￥</em>{{goods.goods_price}}</span>
          </div>
          <!--会员返返现-->
          <div v-if="goods.seller_income != '0' && userStatus == 3" class="income_vip">
            会员返<em>￥</em>{{goods.seller_income}}
          </div>
          <!--商品数量-->
          <div class="sold_out_collect" v-if="activity.act_id>=0&&!goods.goods_stocks" @click="collect(goods)">
            转到收藏
          </div>
          <div class="good_number_container" v-if="activity.act_id>=0&&goods.goods_stocks">
            <div class="input_control">
              <div class="minus change_num" @click="changeGoodsNumber(goods,-1,activity)">-</div>
              <input type="tel" v-model="goods.goods_number" @change="changeGoodsNumber(goods,0,activity)">
              <div class="plus change_num" :class="{'disable':goods.goods_number>=goods.max_amount}" @click="changeGoodsNumber(goods,1,activity)">+
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--超出库存-->
      <div class="seckill_countdown_right" v-if="goods.goods_stocks>0&&goods.goods_number>goods.goods_stocks"><span>商品数量超出库存</span>
      </div>
      <!--降价-->
      <div class="price_change" v-if="!(goods.sag_left_time > 0)&&!(goods.fsp_left_time > 0)&&!(goods.bkg_left_time > 0) && goods.reduce_money">
        比加入时降{{goods.reduce_money}}元
      </div>
      <!--限时购倒计时和其他信息-->
      <!--秒杀商品-->
      <span v-if="goods.sag_left_time > 0">
            <!--秒杀和几倍返现同事存在-->
            <span v-if="goods.bkg_left_time > 0">
              <!--秒杀剩余时间少于翻倍返现剩余时间-->
              <div class="ts_info_limit seckill_countdown" v-if="goods.bkg_left_time > goods.sag_left_time"
                   style="color:#ff4a7d;">
                {{goods.sag_left_time | datetimeFormat}}，可享受秒杀和{{goods.act_income.ratio}}倍返利优惠<span
                v-if="goods.reduce_money">，比加入时降<span class="dav-red">{{goods.reduce_money}}元</span></span>
    </div>
    <!--秒杀剩余时间大于翻倍返现剩余时间-->
    <div class="ts_info_limit seckill_countdown" v-else style="color:#ff4a7d;">
      {{goods.bkg_left_time | datetimeFormat}}，可享受秒杀和{{goods.act_income.ratio}}倍返利优惠<span v-if="goods.reduce_money">，比加入时降<span class="dav-red">{{goods.reduce_money}}元</span></span>
    </div>
    </span>
    <!--只有秒杀-->
    <span v-else>
              <div class="ts_info_limit seckill_countdown dav-red" style="color:#ff4a7d;">
                {{goods.sag_left_time | datetimeFormat}}<span v-if="goods.reduce_money">，比加入时降<span
                class="dav-red">{{goods.reduce_money}}元</span></span>
  </div>
  </span>
  </span>
  <!--限时购商品-->
  <span v-if="goods.fsp_left_time > 0">
            <!--限时购和几倍返现同事存在-->
            <span v-if="goods.bkg_left_time > 0">
              <!--限时购剩余时间少于翻倍返现剩余时间-->
              <div class="ts_info_limit seckill_countdown" v-if="goods.bkg_left_time > goods.fsp_left_time">
                在<span class="dav-red">{{goods.fsp_left_time | datetimeFormatNew}}</span>内<span v-if="userStatus == 3">支付
              </span><span v-else>成为会员</span> ，可享受限时购和{{goods.act_income.ratio}}倍返利优惠
  <span v-if="goods.reduce_money">，比加入时降<span class="dav-red">{{goods.reduce_money}}元</span></span>
</div>
<!--限时购剩余时间大于翻倍返现剩余时间-->
<div class="ts_info_limit seckill_countdown" v-else>
  在<span class="dav-red">{{goods.bkg_left_time | datetimeFormatNew}}</span>内<span v-if="userStatus == 3">支付</span><span v-else>成为会员</span>，可享受限时购和{{goods.act_income.ratio}}倍返利优惠
  <span v-if="goods.reduce_money">，比加入时降<span class="dav-red">{{goods.reduce_money}}元</span></span>
</div>
</span>
<!--只有限时购-->
<span v-else>
              <div class="ts_info_limit seckill_countdown">
                在<span class="dav-red">{{goods.fsp_left_time | datetimeFormatNew}}</span>内<span v-if="userStatus == 3">支付</span><span v-else>成为会员</span>，可享受限时购优惠<span v-if="goods.reduce_money">，比加入时降<span class="dav-red">{{goods.reduce_money}}元</span></span>
</div>
</span>
</span>
<!--只有返现翻倍-->
<div class="ts_info_limit seckill_countdown" v-if="goods.bkg_left_time > 0 && !(goods.fsp_left_time > 0) && !(goods.sag_left_time > 0) ">
  在<span class="dav-red">{{goods.bkg_left_time | datetimeFormatNew}}</span>内<span v-if="userStatus == 3">支付</span><span v-else>成为会员</span>，可享受{{goods.act_income.ratio}}倍返利优惠<span v-if="goods.reduce_money">，比加入时降<span class="dav-red">{{goods.reduce_money}}元</span></span>
</div>
<div class="ts_info_limit seckill_countdown" v-if="!(goods.sag_left_time > 0)&&!(goods.fsp_left_time > 0)&&!(goods.bkg_left_time > 0)&&goods.secondsp">
  <span style="color:#ff4a7d;">商品失效，请重新添加购物车</span>
</div>
<div class="buy_gift" v-if="goods.buy_gift&&goods.buy_gift.length">
  <span class="dav-red">[赠品]</span>
  <div class="buy_gift_con">
    <a v-for="g in goods.buy_gift" href="/{{g.gift_id}}.html" :key="g">
      <sapn class="text" v-text="g.goods_name"></sapn>
      <span class="number" v-text="'X'+g.gift_number"></span>
    </a>
  </div>
</div>
</div>
</div>
<!--商品列表-->
<!--赠品 -->
<div class="premiums" v-if="activity.gifts&&activity.gifts.length">
  <div class="premiums_con" @click="show_gift(gift)" v-for="gift in activity.gifts" v-if="gift.gift_stocks != 0" :key="gift">
    <span class="dav-red">[满送]</span> {{gift.goods_name}}
    <span class="premiums_con_number" v-if="gift.gift_stocks">X{{gift.gift_number || 1}}</span>
    <span class="premiums_con_number dav-red" v-if="!gift.gift_stocks">[已赠完]</span>
  </div>
</div>
<!--清空失效-->
<div class="clear_shop april_border hairlines" v-if="activity.act_id==-1">
  <div class="dav-btn btn-small border_inner" @click="clearInvalidGoods">清空失效商品</div>
</div>
</div>
<div class="price_item">
  <span class="price_text">合计：</span>
  <span class="price_number">￥{{ cartInfo.order_amount || 0}} ＝ ￥{{ cartInfo.goods_amount || 0}}</span>
  <span class="reduce_info dav-price" v-if="cartInfo.discounts">
                <span v-for="discount in cartInfo.discounts" :key="discount">-￥{{discount.discount}}({{discount.act_type_name}}) </span>
  </span>
</div>
</div>

<div class="center dav-small dav-red info59" v-if="!cartInfo.isEmpty&&cartInfo.goods_amount<59&&!book_stacks_data.dataList.length">
  <span>温馨提示：满59包邮(偏远地区99包邮) </span><a class="underline" href="/">再去逛逛</a></div>

<!--空购物车-->
<div class="cart_blank" v-if="cartInfo.isEmpty&&!loading">
  <div class="cart_empty_pic">
    <img src="//9i.dvmama.com/free/cart_blank.png">
  </div>
  <div class="dav-color6 center">空空如也，看看为你推荐吧</div>

  <div class="order dav-shadow" v-if="cartInfo.unpay_order.length">
    <div class="order_title">
      最近未支付订单
    </div>
    <a href="/o-{{cartInfo.unpay_order[0].order_id}}.html">
      <div class="order_name_state">
        <span class="order_name">{{cartInfo.unpay_order[0].user_name}}</span>
        <span class="order_state pull-right">
                        <span>订单状态：</span>
        <span class="dav-red">待付款</span>
        </span>
      </div>
      <div class="good_container">
        <div class="img_container many_goods">
          <div class="img_container_inner" style="height: 60px;">
            <img v-for="item in cartInfo.unpay_order[0].unpay_goods_list" :key="item" :src="item.goods_thumb">
          </div>
          <div class="pull-right text-container">共{{cartInfo.unpay_order[0].unpay_goods_list.length}}件<br>商品
          </div>
        </div>
      </div>
      <div class="order_price">金额：￥{{cartInfo.unpay_order[0].order_amount}}</div>
    </a>
    <div class="out_button_container">
      <a class="dav-btn btn-small order-btn-red pull-right" href="/checkout.html?order_id={{cartInfo.unpay_order[0].order_id}}">立即支付</a>
      <a class="dav-btn btn-small pull-right" href="/index.php?c=AgentPay&amp;a=index&amp;order_id={{cartInfo.unpay_order[0].order_id}}">找人代付</a>
    </div>
  </div>
</div>
<!--<div class="loading" v-if="loading">购物车商品读取中</div>-->
<!--登录部分-->
<!--<div class="account_in_cart login_container" v-show="!cartInfo.isEmpty">-->
<!--<slot></slot>-->
<!--</div>-->
<!--会员返现提示悬框-->
<!--  <div v-if="cartInfo.total_income" class="income_bottom_fixed">
     <span v-if="userStatus == 3">本次购物可获得￥{{cartInfo.total_income}}返现，订单完成后在[我的]-[总额]中查看</span>
     <span v-else>会员下单立返￥{{cartInfo.total_income}}</span>
     <a v-if="userStatus != 3" :href="kdUrl">开通会员</a>
   </div> -->

<div class="conteianer4">
        <div class="tt_com_1_wrap">
          <div class="tt_com_1">
            <div>
              <span>为你推荐</span>
            </div>
          </div>
        </div>
        <category @click="clickGoods" :list="list"></category>
        <div class="no_more" v-if="list.length">
          没有更多商品了
        </div>
      </div>


<div v-if="cartInfo.total_income && userStatus == 3" class="income_bottom_fixed">
  <span>本次购物可获得￥{{cartInfo.total_income}}返现，订单完成后在[我的]-[总额]中查看</span>
</div>
<!--购物车结算低栏-->
<div class="cart_bottom" v-if="!cartInfo.isEmpty">
  <div class="select_all">
    <i class="icon" :class="[{'dav_icon_choice_no_selected_40_40':(!checkAll&&!editMode)||(!checkEditAll&&editMode)},{'dav_icon_choice_selected_40_40':(checkAll&&!editMode)||(checkEditAll&&editMode)}]" @click="checkAllCheck((!editMode&&!checkAll)||(editMode&&!checkEditAll))"></i>    全选
  </div>
  <div class="price_con" v-if="!editMode">
    <div v-if="cartInfo.saving == 0" class="left_price" style="margin-top: 15px;">
      <span class="price_text" style="font-weight: bold">应付:</span><span class="price_number price_number_after">￥{{
        cartInfo.order_amount}}
      </span>
    </div>
    <div v-if="cartInfo.saving != 0" class="left_price">
      <span class="price_text" style="font-weight: bold">应付:</span><span class="price_number price_number_after">￥{{ cartInfo.order_amount || 0}}  </span>
    </div>
    <div v-if="cartInfo.saving != 0" class="reduce_price">
      <span class="other_info">总额:￥{{ cartInfo.goods_amount || 0}} <span
          class="ml_10">优惠:￥{{ cartInfo.saving || 0}}</span></span>
    </div>
  </div>
  <div class="pay_button_container" @click="pay" v-show="!editMode">
    <div class="dav-btn2" :class="{'btn-disable':paying,'btn-red':!paying}" v-if="isLogin">
      <span class="text" v-if="paying">结算中...</span>
      <span class="text" v-else>结算<span class="f11">({{(book_stacks_data.dataList&&book_stacks_data.dataList.length&&book_stack_selected ? ((cartInfo.sku_count || 0)+1) : (cartInfo.sku_count || 0))}})</span></span>
    </div>
    <div class="dav-btn2 btn-red" v-else>去登录</div>
  </div>
  <div class="delete_shop_btn" v-if="editMode" @click="doSome('del')">
    <div class="dav-btn btn-red">
      <span class="text">删除商品</span>
    </div>
  </div>
  <div class="go_collect_btn" v-if="editMode" @click="doSome('collect')">
    <div class="dav-btn btn-yellow">
      <span class="text">转到收藏</span>
    </div>
  </div>
</div>
</div>
</template>

<script>
import { isTryShop } from "../utils/utils.es6";
import popup from "../src/common/js/module/popup.js";
import encrypt from "../src/common/js/module/encrypt.js";
import ua from "../src/common/js/module/ua.js";
import api from "../utils/api.es6";
var Vue = require("Vue");
import VueLazyLoad from 'vue-lazyload';

  Vue.use(VueLazyLoad
    )


var second_tip = 0;
export default {
  el: "#cart",
  data() {
    return {
      cartInfo: {
        isEmpty: true
      },
      list:[],
      editMode: false,
      checkAll: false,
      checkEditAll: false,
      paying: false,
      loading: true,
      editStatue: {},
      isLogin: false,
      referer: {},
      userStatus: window.userStatus,
      kdUrl: window.kdUrl,
      ua: ua,
      book_stack_selected: true, //小书库默认选中状态
      book_stacks_data: {
        number: 0,
        dataList: []
      } //小书库数据
    };
  },
  components: {
    "com-top-title": require("../src/component/com-top-title.vue"),
    'category': require('../src/component/com-maybeyoulike.vue'),
  },
  watch: {
    "cartInfo.isEmpty": "cartIsEmpty",
    "cartInfo.sku_count_all": "changeCount",
    "cartInfo.total_income": "cartIncome"
  },
  computed: {
    count_stack: function() {
      let ts = this;
      return ts.book_stacks_data.dataList &&
        ts.book_stacks_data.dataList.length &&
        ts.book_stack_selected
        ? (ts.cartInfo.sku_count || 0) + 1
        : ts.cartInfo.sku_count || 0;
    }
  },
  methods: {
    clickGoods(){
      if(window.Units &&
          Units.isApp()){
        sessionStorage.setItem("clickGoods",1);
      }

    },

    getYouLike(){
        let that = this;
        api('/api/mg/sale/index/getRecommend?_='+Date.now(),{for:"cart"}).then(function(response){
          console.log("like",response);
            that.list = response.data.dataList;
        })

      },
    changeCount: function(val) {
      let ts = this;
      if (val) {
        if (
          window.Units &&
          Units.isApp() &&
          Units.getAppVersion() >= 260 &&
          Units.getAppVersion() < 520
        ) {
          window.bravetime &&
            bravetime.setHead &&
            bravetime.setHead({
              title: "购物车(" + val + ")"
            });
        }
      }
    },
    cartIsEmpty: function(val) {
      let that = this;
      if (this.cartInfo.isEmpty) {
        document.body.style.paddingBottom = "0";
      } else if(this.cartInfo.total_income&&this.isLogin) {
        document.body.style.paddingBottom = "88px";
      } else{
        document.body.style.paddingBottom = "58px";
      }
      if (
        that.book_stacks_data.dataList &&
        that.book_stacks_data.dataList.length
      ) {
        that.cartInfo.isEmpty = false;
        val = false;
      }
      if (val) {
        if (
          window.Units &&
          Units.isApp() &&
          Units.getAppVersion() >= 320 &&
          Units.getAppVersion() < 520
        ) {
          window.bravetime &&
            bravetime.setHead &&
            bravetime.setHead({
              title: "购物车",
              homeBtn: 1,
              rightBtn: 0
            });
        } else if (
          window.Units &&
          Units.isApp() &&
          Units.getAppVersion() >= 260 &&
          Units.getAppVersion() < 520
        ) {
          window.bravetime &&
            bravetime.setHead &&
            bravetime.setHead({
              title: "购物车",
              homeBtn: 1,
              rightBtn: 0
            });
        }
      }
    },
    cartIncome: function(val) {
      if (this.cartInfo.isEmpty) {
        document.body.style.paddingBottom = "0";
      } else if(this.cartInfo.total_income&&this.isLogin) {
        document.body.style.paddingBottom = "88px";
      } else{
        document.body.style.paddingBottom = "58px";
      }
    },
    clearInvalidGoods: function() {
      var that = this;

      function callback() {
        var invalidGoodsList;
        // 先清空无效商品数据
        var activityList = that.cartInfo.activitys;
        for (var i = 0; i < activityList.length; i++) {
          if (activityList[i].act_id == -1) {
            invalidGoodsList = activityList[i].goods;
            activityList.splice(i, 1);
          }
        }
        var delList = [];
        for (var i in invalidGoodsList) {
          var goods = invalidGoodsList[i];
          delList.push({
            act_id: -1,
            goods_id: goods.goods_id,
            price_act_id: goods.price_act_id,
            price_act_type: goods.price_act_type,
            deleted: 1
          });
        }
        changeCart(delList, that);
      }

      bravetime.newConfirm("您确定要清空失效商品么?", {
        okLink: callback
      });
    },
    gotoGoods: function() {
      window.setYCache();
    },
    toggleEditMode: function() {
      this.editMode = !this.editMode;
      if (this.cartInfo.activitys && this.cartInfo.activitys.length) {
        for (var i = 0, ac; (ac = this.cartInfo.activitys[i++]); ) {
          if (ac.act_id != -1) {
            for (var j in ac.goods) {
              var goods = ac.goods[j];
              if (this.editMode) {
                goods.edit_checked = false;
              }
            }
          }
        }
      } else {
      }
      // 520以下才重新设置头部
      if (
        window.Units &&
        Units.isApp() &&
        Units.getAppVersion() >= 260 &&
        ua.compareVersion(ua.getDvdAppVersion(), "5.2.0") < 0
      ) {
        bravetime.setHead({
          rightBtn: {
            text: this.editMode ? "完成" : "编辑",
            action: "window.edit()",
            textColor: "#ff4a7d"
          }
        });
      }
    },
    toggleEditStatus: function(goods) {
      goods.edit_checked = !goods.edit_checked;
      this.editStatue[goods["goods_id"]] = goods.edit_checked;
      this.checkEditAll = checkAllCheck(false, this);
    },
    toggleCheckStatus: function(goods, activity) {
      // 切换选中状态
      // 先切换自己的状态
      goods.checked = !goods.checked;
      // 然后看是否需要切换全选状态
      this.checkAll = checkAllCheck(false, this);

      var data = [
        {
          act_id: activity.act_id,
          goods_id: goods.goods_id,
          checked: +goods.checked,
          price_act_id: goods.price_act_id,
          price_act_type: goods.price_act_type
        }
      ];
      changeCart(data, this);
    },
    checkAllCheck: function(check) {
      // 全选操作对小书库操作的影响
      //如果有小书库存在才会操作如此
      let ts = this;
      if (ts.cartInfo.isEmpty && ts.cartInfo.editMode) {
        return false;
      }
      if (ts.book_stacks_data.dataList && ts.book_stacks_data.dataList.length) {
        ts.book_stack_selected = check;
        if (this.cartInfo.isEmpty) {
          ts.checkAll = ts.book_stack_selected;
          return false;
        }
      }
      checkAllCheck(true, this, check);
      if (!this.editMode) {
        var list = getAllGoods(this);
        list.map(function(x) {
          x.checked = +check;
          return x;
        });
        if (list.length) {
          changeCart(list, this);
        }
      }
    },
    changeGoodsNumber: function(goods, number, activity) {
      var that = this;
      // 先改变显示的数量
      goods.min_amount = goods.min_amount || 1;
      var afterNumber = +goods.goods_number + (number || 0);
      if (afterNumber > goods.max_amount) {
        goods.goods_number = goods.max_amount;
      } else if (afterNumber < goods.min_amount) {
        goods.goods_number = goods.min_amount;
        bravetime.newConfirm("确认删除商品么?", {
          okLink: function() {
            var list = [
              {
                goods_id: goods.goods_id,
                act_id: goods.act_id,
                deleted: 1,
                editCheck: goods.edit_checked,
                price_act_id: goods.price_act_id,
                price_act_type: goods.price_act_type
              }
            ];
            changeCart(list, that);
          }
        });
        return false;
      } else {
        goods.goods_number = afterNumber;
      }

      var data = [
        {
          act_id: activity.act_id,
          goods_id: goods.goods_id,
          goods_number: +goods.goods_number,
          editCheck: goods.edit_checked,
          price_act_id: goods.price_act_id,
          price_act_type: goods.price_act_type
        }
      ];
      changeCart(data, this);
    },
    pay: function() {
      // 更换了判断方法，所以讲此处注释
      // var flag = false;
      var ts = this;
      // for (var i = 0, ac;
      //   (ac = ts.cartInfo.activitys[i++]);) {
      //   if (ac.act_id != -1) {
      //     for (var j in ac.goods) {
      //       var goods = ac.goods[j];
      //       if (goods.checked) {
      //         flag = true;
      //         break;
      //       }
      //     }
      //   }
      // }

      if (ts.count_stack == "0") {
        bravetime.newAlert("请至少选择一个商品");
        return false;
      }
      // 如果有小书库数据并且小书库被选中
      if (ts.book_stacks_data.dataList && ts.book_stacks_data.dataList.length) {
        // 将小书库信息发给后端判断库存等，如果没有库存了提示用户从新选择小书库商品如果有则正常执行
        $.ajax({
          url: "/api/mg/good/vipbook/checkout",
          dataType: "json",
          data: encrypt({
            del: ts.book_stack_selected ? "0" : "1"
          }),
          type: "post",
          success: function(result) {
            if (result.code == "0") {
              // 如果有小书库问题书籍，则弹出
              if (result.data && result.data.dataList.length) {
                let goods;
                let gooddiv = "";
                for (let i = 0; i < result.data.dataList.length; i++) {
                  gooddiv =
                    gooddiv + "<p>" + result.data.dataList[i].title + "</p>";
                }
                popup.confirm({
                  title: gooddiv,
                  text: "以上小书库选书已下架或售罄，请您重新选书",
                  okBtnTitle: "重新选书",
                  okBtnCallback() {
                    location.href = "/book_stacks_new.html";
                  },
                  cancelBtnTitle: "知道了",
                  cancelBtnCallback() {}
                });
                return false;
              } else {
                //没有则继续验证
                if (Units.isApp() && Units.getAppVersion() >= 240) {
                  settlementNative(ts);
                } else {
                  settlement(ts);
                }
              }
            }
          },
          error: function() {
            bravetime.removeLoader();
            bravetime.info("网络异常,请稍后重试");
          }
        });
      } else {
        if (Units.isApp() && Units.getAppVersion() >= 240) {
          settlementNative(this);
        } else {
          settlement(this);
        }
      }
    },
    dumpToMamaAdviser() {
      if (isTryShop()) {
        api("/api/mg/auth/inviter/checkAdviser", {
          dataType: "json",
          type: "post"
        })
          .then(function(result) {
            if (!result.code && result.data.needPop) {
              popup.specialAlert({
                title:
                  "<div style='width: 1.51rem;margin-left: auto;margin-right: auto;margin-top: -0.5rem;'><img src='http://9i.dvmama.com/free/2017816/mamaguwen.png'></div>",
                text:
                  " <div style='text-align:left'>亲爱的大V妈妈，我们将给您分配一个1对1服务的妈妈顾问，您有任何关于购物、学习、育儿、活动等疑问，都可以向她寻求帮助</div>",
                btnTitle: "马上选择",
                btnCallback() {
                  location.replace("/choose_mama_adviser.html");
                }
              });
            }
          })
          .catch(function(error) {
            console.log("error:", error);
          });
      }
    },
    collect: function(goods) {
      var data = [
        {
          act_id: goods.act_id,
          goods_id: goods.goods_id,
          collected: 1,
          price_act_id: goods.price_act_id,
          price_act_type: goods.price_act_type
        }
      ];
      changeCart(data, this);
    },
    doSome: function(type, other) {
      let ts = this;
      // 如果小书库商品选中则不让删除和收藏
      if (
        ts.book_stacks_data.dataList &&
        ts.book_stacks_data.dataList.length &&
        ts.book_stack_selected
      ) {
        if (type == "collect") {
          bravetime.newAlert("小书库不能转到收藏");
          return false;
        }
        if (type == "del") {
          bravetime.newAlert("小书库不能删除");
          return false;
        }
      }

      var list = getCheckedList(this);
      if (!list.length) {
        bravetime.newAlert("请至少选中一个商品");
        return false;
      }
      for (var i = 0; i < list.length; i++) {
        if (type == "del") {
          list[i].deleted = 1;
        } else if (type == "collect") {
          list[i].collected = 1;
        } else if (type == "check") {
          list[i].checked = +other;
        }
      }
      changeCart(list, this);
    },
    show_gift: function(gift) {
      bravetime.newAlert(
        '<div style="text-align:center"><p style="font-size:20px">赠品信息</p><img style="max-width:200px;margin-top: 4px;" src="' +
          gift.goods_thumb +
          '" alt=""><div style="text-align:left"><p style="-webkit-box-orient:vertical;-webkit-line-clamp:2;display:-webkit-box;overflow:hidden;font-size:14px;line-height:20px;max-height:40px;margin-top: 6px;">' +
          gift.goods_name +
          '</p><div class="dav-red" style="margin-top: 4px;font-size: 12px;">剩余数量：' +
          gift.gift_stocks +
          '</div><div style="margin-top: 4px;font-size: 12px;">' +
          gift.hint_info +
          "</div></div></div>"
      );
    },
    //选中小书库
    bookstackselect: function() {
      let ts = this;
      ts.book_stack_selected = !ts.book_stack_selected;
    },
    //获取小书库信息
    getbook_stacks_data: function() {
      let ts = this;
      $.ajax({
        url: "/api/mg/good/vipbook/cart",
        type: "post",
        dataType: "json",
        data: encrypt({}),
        success: function(result) {
          if (!result.code) {
            if (result.data.dataList && result.data.dataList.length) {
              ts.book_stacks_data = result.data;
              Vue.set(ts.cartInfo, "isEmpty", false);
              Vue.set(
                ts.cartInfo,
                "sku_count_all",
                ts.cartInfo.sku_count_all ? ts.cartInfo.sku_count_all + 1 : 1
              );
            }
          }
        },
        error: function() {
          bravetime.removeLoader();
          bravetime.info("网络异常,请稍后重试");
        }
      });
    },
    // 获取购物车信息
    getCartInfo(t) {
        let that = this;

      $.ajax({
        url: window.cartInfoUrl,
        dataType: "json",
        cache: false,
        success: function(result) {

          that.loading = false;
          if (result.code) {
            bravetime.info(result.msg);
          } else {
            goodsListContainer.removeClass("hide");
            that.cartInfo = handle(result.data.cart_info, that);
            that.referer = result.referer;
            var list = [],
              str = "";
            if (that.referer) {
              for (var i in that.referer) {
                list.push(i + "=" + that.referer[i]);
              }
            }
            if (list.length) {
              str = "?" + list.join("&");
            }
            that.refererStr = str;

            setCartInfoCache(that.cartInfo);
            that.$nextTick(function() {
              if (Units.isAndroid()) {
                $(".price_info_reduce").css("font-family", "serif");
              }
            });
            timeReduce(that.cartInfo.activitys);
            alertOverInfo(result.data.over_info);

            setTimeout(function() {
              if (!(window.Units && Units.isApp())) {
                window.loginReady();
              }
            }, 100);
            that.$nextTick(function() {
              if (result.data.cart_info.sku_count_all) {
                if (
                  window.Units &&
                  Units.isApp() &&
                  Units.getAppVersion() >= 260 &&
                  Units.getAppVersion() < 520
                ) {
                  bravetime.setHead({
                    title: "购物车(" + result.data.cart_info.sku_count_all + ")"
                  });
                  document.title =
                    "购物车(" + result.data.cart_info.sku_count_all + ")";
                }
              } else {
                if (
                  window.Units &&
                  Units.isApp() &&
                  Units.getAppVersion() >= 320 &&
                  Units.getAppVersion() < 520
                ) {
                  bravetime.setHead({
                    title:
                    "购物车" +
                    (that.book_stacks_data.dataList &&
                    that.book_stacks_data.dataList.length
                      ? "(1)"
                      : ""),
                    homeBtn:
                      that.book_stacks_data.dataList &&
                      that.book_stacks_data.dataList.length
                        ? 0
                        : 1,
                    rightBtn: 0
                  });
                } else if (
                  window.Units &&
                  Units.isApp() &&
                  Units.getAppVersion() >= 260 &&
                  Units.getAppVersion() < 520
                ) {
                  bravetime.setHead({
                    title:
                    "购物车" +
                    (that.book_stacks_data.dataList &&
                    that.book_stacks_data.dataList.length
                      ? "(1)"
                      : ""),
                    homeBtn: 0,
                    rightBtn: 0
                  });
                }
                window.appData = {
                  showHead: 1,
                  showFoot: 0,
                  backOnHead: 1, // 头部返回按钮
                  homeOnHead:
                    that.book_stacks_data.dataList &&
                    that.book_stacks_data.dataList.length
                      ? 0
                      : 1, // 头部首页按钮
                  shareOnHead: 0
                };
              }
              if (that.cartInfo.isEmpty) {
                document.body.style.paddingBottom = "0";
              } else if(that.cartInfo.total_income&&that.isLogin) {
                document.body.style.paddingBottom = "88px";
              } else{
                document.body.style.paddingBottom = "58px";
              }
            });
          }
          if (window.bookStackInCart) {
            // 每次进来都要看看有没有小书库的数据
            setTimeout(function() {
              that.getbook_stacks_data();
            }, 0);
          }
          if(t === 'like'){
              that.getYouLike()
          }
        },
        error: function() {
          bravetime.info("网络异常,请稍后重试");
        }
      });
    }
  },
  mounted(){

  },
  created() {
    var that = this;
    document.addEventListener('visibilitychange', function() {
      if (window.Units && Units.isApp()) {
        var isHidden = document.hidden;
        if (isHidden) {
          // 动画视频暂停
        } else {
          that.getCartInfo();
        }
      }
    });


    if(sessionStorage.getItem("clickGoods")){
      sessionStorage.removeItem("clickGoods");
      location.reload();
    }
    if (window.logined > 0) {
      this.isLogin = true;
    }
    window.loginCallback = function() {
      that.isLogin = true;
      window.location.reload();
    };
    // 支付成功返回就刷新当前页面

    // 每次先用缓存数据
    var d = getCartInfoCache();
    if (d) {
      that.cartInfo = d;
      that.loading = false;
      that.$nextTick(function() {
        window.getYCache();
      });
    }
    this.getCartInfo('like'); // 先获取购物车 再获取猜你喜欢


    this.dumpToMamaAdviser();
  }
};
Vue.filter("formatSmallPrice", function(va) {
  var l = (va + "").split(".");
  if (l.length == 1) {
    l[1] = "00";
  } else if (l[1].length == 1) {
    l[1] += "" + "0";
  }
  return "￥" + l[0] + '.<span class="small_price">' + l[1] + "</span>";
});

Vue.filter("datetimeFormat", function(second) {
  if (second == 0) {
    return "支付超时，请重新添加购物车";
  }
  var s = second % 60,
    m = Math.floor(second / 60) % 60,
    h = Math.floor(second / 60 / 60) % 24,
    d = Math.floor(second / 60 / 60 / 24);
  var str = "";
  if (d) {
    str = d + "天" + h + "小时" + (m < 10 ? "0" : "") + m + "分";
  } else if (h) {
    str =
      h + "小时" + (m < 10 ? "0" : "") + m + "分" + (s < 10 ? "0" : "") + s + "秒";
  } else if (m) {
    str = (m < 10 ? "0" : "") + m + "分" + (s < 10 ? "0" : "") + s + "秒";
  } else {
    str = (s < 10 ? "0" : "") + s + "秒";
  }
  return "剩余支付时间：" + str;
});
// 倒计时 秒杀-限时购-返利翻倍
Vue.filter("datetimeFormatNew", function(second) {
  if (second == 0) {
    return "支付超时，请重新添加购物车";
  }
  var s = second % 60,
    m = Math.floor(second / 60) % 60,
    h = Math.floor(second / 60 / 60);
  if (h < 10) {
    h = "0" + h;
  }
  var str = "";
  if (h) {
    str =
      h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + "";
  } else if (m) {
    str = "00:" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + "";
  } else {
    str = "00:00:" + (s < 10 ? "0" : "") + s + "";
  }
  return str;
});

var goodsListContainer = $(".goods_in_cart");
var settlementContainer = $(".pay_button_container"),
  settlementButton = settlementContainer.find(".dav-btn");

/**
 * 弹出超出商品确认框
 */
function alertOverInfo(data) {
  if (!data || !data.length) {
    return false;
  }
  var str =
    '<p style="font-size:20px">提示</p><div style="text-align:left"><p style="line-height:24px">您添加的商品已经超出了购物车数量限制(200),以下商品(' +
    data.length +
    '件)没有添加成功</p><div style="max-height:150px;overflow:scroll;margin-top:20px">';
  for (var i = 0; i < Math.min(15, data.length); i++) {
    str +=
      '<div style="max-height:40px;margin-bottom:12px;line-height:20px;-webkit-box-orient:vertical;-webkit-line-clamp:2;display:-webkit-box;overflow:hidden"> 商品' +
      (i + 1) +
      ":" +
      data[i].goods_name +
      "</div>";
  }
  str +=
    '<p style="text-align:center;color:#999;font-size:12px">"已经到底了,剩余商品请转到收藏查看~"</p></div></div>';

  var list = data.map(function(x) {
    return x.goods_id;
  });
  bravetime.newConfirm(str, {
    okText: "删除商品",
    cancelText: "<span class='dav-red'>转到收藏</span>",
    okLink: function() {
      h(deleteOverUrl, list);
    },
    cancelLink: function() {
      h(collectOverUrl, list);
    }
  });

  function h(url, data) {
    bravetime.addLoader({
      small: true
    });
    $.ajax({
      url: url,
      dataType: "json",
      data: {
        goods: JSON.stringify(data)
      },
      success: function(result) {
        bravetime.removeLoader();
        if (result.code) {
          bravetime.newAlert(result.msg);
        } else {
        }
      },
      error: function() {
        bravetime.removeLoader();
        bravetime.info("网络异常,请稍后重试");
      }
    });
  }
}

/**
 * 购物车变更
 */
function changeCart(data, cart, info) {
  if (!data.length) {
    return false;
  }
  var newData = {};
  for (var i = 0; i < data.length; i++) {
    for (var j in data[i]) {
      newData["goods[" + data[i]["goods_id"] + "][" + j + "]"] = data[i][j];
    }
  }

  bravetime.addLoader({
    little: true
  });
  $.ajax({
    url: cartChangeUrl,
    cache: false,
    data: newData,
    type: "POST",
    dataType: "json",
    success: function(result) {
      bravetime.removeLoader();
      if (result.code) {
        bravetime.newAlert(result.msg, {
          okLink: function() {
            location.reload();
          }
        });
      } else {
        if (info === true) {
          bravetime.info("操作成功");
        } else if (info) {
          bravetime.info(info);
        }
        cart.cartInfo = handle(result.data.cart_info, cart);
        console.log("cart.cartInfo1", cart.cartInfo.isEmpty);
        // dosome 操作后如果购物车里有小书库存在 则 isEmpty 依然是false;
        if (
          cart.book_stacks_data.dataList &&
          cart.book_stacks_data.dataList.length
        ) {
          cart.cartInfo.isEmpty = false;
          if (cart.cartInfo.sku_count_all) {
            cart.cartInfo.sku_count_all = cart.cartInfo.sku_count_all + 1;
          } else {
            cart.cartInfo.sku_count_all = 1;
          }
        }
        setCartInfoCache(cart.cartInfo);
        cart.$nextTick(function() {
          if (Units.isAndroid()) {
            $(".price_info_reduce").css("font-family", "serif");
          }
        });
        timeReduce(cart.cartInfo.activitys);
      }
    },
    error: function() {
      bravetime.removeLoader();
      bravetime.info("网络异常,请稍后重试");
    }
  });
}

function getCheckedList(cart) {
  var checkGoodsList = [];
  var activityList = cart.cartInfo.activitys;
  for (var i = 0; i < activityList.length; i++) {
    if (activityList[i].act_id != -1) {
      for (var j in activityList[i].goods) {
        var goods = activityList[i].goods[j];
        if (goods.edit_checked) {
          checkGoodsList.push({
            goods_id: goods.goods_id,
            act_id: activityList[i].act_id,
            price_act_id: goods.price_act_id,
            price_act_type: goods.price_act_type
          });
        }
      }
    }
  }
  return checkGoodsList;
}

function getAllGoods(cart) {
  var checkGoodsList = [];
  var activityList = cart.cartInfo.activitys;
  for (var i = 0; i < activityList.length; i++) {
    if (activityList[i].act_id != -1) {
      for (var j in activityList[i].goods) {
        var goods = activityList[i].goods[j];

        checkGoodsList.push({
          goods_id: goods.goods_id,
          act_id: activityList[i].act_id,
          price_act_id: goods.price_act_id,
          price_act_type: goods.price_act_type
        });
      }
    }
  }
  return checkGoodsList;
}

/**
 * 时间减少计算
 */
function timeReduce(activity) {
  if (!activity) {
    return false;
  }
  var flag = false;
  for (var i = 0, ac; (ac = activity[i++]); ) {
    for (var id in ac.goods) {
      var goods = ac.goods[id];
      if (goods.sag_left_time > 0) {
        goods.sag_left_time--;
        goods.secondsp = true;
        flag = true;
      }
      if (goods.fsp_left_time > 0) {
        goods.fsp_left_time--;
        second_tip++;
        flag = true;
      }
      if (goods.bkg_left_time > 0) {
        goods.bkg_left_time--;
        second_tip++;
        flag = true;
      }
    }
  }
  if (flag) {
    setTimeout(function() {
      timeReduce(activity);
    }, 1000);
  }
}

/**
 * 检测所有的选择
 */
function checkAllCheck(flag, cart, check) {
  var all = true;
  console.log("cart", cart, cart.cartInfo.activitys);
  var activityList = cart.cartInfo.activitys;
  for (var i = 0; i < activityList.length; i++) {
    if (activityList[i].act_id != -1) {
      for (var j in activityList[i].goods) {
        var goods = activityList[i].goods[j];
        if (flag == false) {
          if (cart.editMode) {
            if (!goods.edit_checked) {
              all = false;
              break;
            }
          } else {
            if (!goods.checked) {
              all = false;
              break;
            }
          }
        } else {
          if (cart.editMode) {
            goods.edit_checked = check;
            cart.checkEditAll = check;
          } else {
            goods.checked = check;
            cart.checkAll = check;
          }
        }
      }
    }
  }
  return all;
}

/**
 * 处理数据
 */
function handle(data, cart) {
  var all = true;
  for (var i in data.activitys) {
    for (var j in data.activitys[i].goods) {
      var goods = data.activitys[i].goods[j];
      goods.edit_checked =
        goods.edit_checked || cart.editStatue[goods.goods_id] || false;
      goods.min_amount = 1;
      goods.max_amount = goods.purchase_limit || 200;
      goods.act_id = data.activitys[i].act_id;
      if (goods.act_id != -1 && !goods.checked) {
        all = false;
      }
    }
  }
  data.isEmpty = !data.sku_count_all;
  cart.checkAll = all;
  console.log("data", data);
  return data;
}

/**
 * 结算
 */
function settlement(cart) {
  if (cart.isLogin) {
    bravetime.addLoader({
      small: true
    });
    $.ajax({
      url: window.selloutCheckUrl,
      dataType: "json",
      success: function(result) {
        bravetime.removeLoader();
        if (result.code) {
          var msg = "<div style='text-align:left;'>";
          if (result.data.total > 1) {
            msg +=
              result.data.goods[0] + "<br/>" + result.data.goods[1] + "</div>";
            msg += "<br/>等" + result.data.total + "件商品已售罄，请您取消勾选";
          } else {
            msg += result.data.goods[0] + "</div><br/>该商品已售罄，请您取消勾选";
          }
          bravetime.newAlert(msg);
        } else {
          bravetime.goto(result.url || "checkout.html");
        }
      },
      error: function() {
        bravetime.removeLoader();
        bravetime.goto("checkout.html");
      }
    });
  } else {
    bravetime.goto("login.html?referer=cart.html");
    //            微信登录
    //            if(Units.isWechat()){
    //                var host = window.location.host;
    //                var hostarr = host.split(".");
    //                location.href = "http://open."+hostarr[1]+"."+hostarr[2]+"/WechatLogin/index?referer=" + location.href;
    //            }else{
    //              bravetime.goto('login.html?referer=cart.html');
    //            }
  }
}

/**
 * 原生结算
 */
function settlementNative(cart) {
  var callback = function(r) {
    if (typeof r == "string") {
      r = JSON.parse(r);
    }
    var code = r.code;
    if (code == 0) {
      // 没登录
    } else if (code == 1) {
      location.reload();
    } else if (code == 2) {
      settlement(cart);
    }
  };
  bravetime.nativeLogin(callback);
}

function setCartInfoCache(data) {
  if (!window.isPrivateMode && window.sessionStorage && data) {
    sessionStorage.setItem("cart_info", JSON.stringify(data));
  }
}

function getCartInfoCache() {
  var data = null;
  if (!window.isPrivateMode && window.sessionStorage) {
    var patharr = JSON.parse(sessionStorage.history);
    if (patharr.length > 2) {
      var lastPath = patharr[patharr.length - 2].path;
      if (lastPath == "detail") {
        data = JSON.parse(sessionStorage.getItem("cart_info"));
      }
    }
  }
  return data;
}

/**
 * 初始化
 */
function init() {
  window.edit = function() {
    cartVUE.toggleEditMode();
  };
}

init();
</script>

<style>
i.icon {
  width: 36px;
  height: 36px;
  background-position: center;
}

.dav_icon_choice_selected_40_40 {
  background-image: url("//9i.dvmama.com/free/dav_icon_choice_selected_32_32_0822.png");
}

.dav_icon_choice_no_selected_40_40 {
  background-image: url("//9i.dvmama.com/free/dav_icon_choice_no_selected_42_42_2x.png");
  background-size: 16px;
  margin-right: 5px;
}

.loading {
  text-align: center;
  font-size: 16px;
  line-height: 3;
}

.cart_empty_pic {
  margin: 60px auto 30px;
  width: 130px;
}

body.in_app .top0 {
  display: block;
}

.top_right {
  position: absolute;
  right: 0;
  top: 0;
  white-space: nowrap;
}

.top0 .top_btn {
  float: right;
  margin-right: 15px;
}

.top_right .text_btn {
  margin-right: -15px;
  color: #ff4a7d;
}

.top_left .cancel_btn,
.top_right .text_btn {
  font-size: 14px;
  display: block;
  line-height: 44px;
  padding-left: 12px;
  cursor: pointer;
  padding-right: 12px;
}

/* 小书库 */

.goods_in_cart .book_stacks_incart .pic_container {
  position: relative;
}

.goods_in_cart .book_stacks_incart .pic_container::after {
  content: "";
  -webkit-transform: scale(0.5);
  -ms-transform: scale(0.5);
  transform: scale(0.5);
  width: 200%;
  height: 200%;
  border: #dddddd solid 1px;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  -webkit-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  transform-origin: 0 0;
}

.reduce_item_container .book_stacks_incart .reduce_item_title {
  border-bottom: none;
}

.goods_in_cart .dav_icon_choice_selected_40_40,
.goods_in_cart .dav_icon_choice_no_selected_40_40 {
  width: 20px;
  height: 20px;
}

.goods_in_cart .icon_container {
  position: relative;
}

.goods_in_cart .icon_container .lines_top {
  width: 30px;
  height: 232px;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  position: absolute;
  left: 16px;
  bottom: -55px;
  transform: scale(0.5);
}

.goods_in_cart .good_item:nth-of-type(1) .icon_container .lines_top {
  height: 132px;
  bottom: -30px;
}

.book_stack_title {
  font-size: 14px;
  color: #333333;
}

.reduce_item_container .book_stacks_incart .reduce_item_title .dav-red {
  color: #ff4a7d;
  background: none;
  margin-left: 10px;
}

.book_stacks_incart .price_info_reduce:after {
  border-radius: 7px;
  z-index: 0;
}

.book_recomWord {
  overflow: hidden;
  color: #999999;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  font-size: 11px;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  height: 10px;
  line-height: 11px;
  margin: 5px 0 10px 0;
}


 .tt_com_1_wrap{
    background-color: rgb(255, 255, 255);
    height: 40px;
    width: 100%;
    margin: .1rem 0;
    /*margin-bottom: 0.14rem;*/
  }
  .tt_com_1{
        height: 0.4rem;
    font-size: 0.16rem;
    color: #FF4A7D;
    text-align: center;
    line-height: 0.4rem;
    background: #FFF;
    /*z-index: 5;*/
    width: 100%;
    max-width: 640px;
    position: relative;
  }
  .tt_com_1 div span {
    display: inline-block;
    /* background-image: url(//9i.dvmama.com/free/2017/06/10/tt_com_1.png); */
    background-image: url(//9i.dvmama.com/free/2017/07/25/heart.png);
    padding-right: 0.21rem;
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: .16rem;
}

.good_list_con{
  margin-top: .05rem;
}
#cart .dvd-service-com-title, .info59{
  z-index: 11;
}
.no_more{
      text-align: center;
    margin: 10px;
      margin-bottom: 20px;
}
.good_title .type_box:before{
  position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 197%;
    height: 200%;
    border: 1px solid #3E8CE4;
    border-radius: 8px;
    -webkit-transform: scale(0.5);
    -ms-transform: scale(0.5);
    transform: scale(0.5);
    -ms-transform-origin: left top;
    transform-origin: left top;
    -webkit-transform-origin: left top;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 1;
}
</style>
