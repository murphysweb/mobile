<template>
  <div>
    <div class="orderList_comment_list_con">
      <div v-for="item in list" class="list clearfix">
        <div class="top">
          <div class="head"><img :src="item.img.length ? item.img:'//9i.dvmama.com/free/default_head_icon_0419.png'">
          </div>
          <div class="clearfix"><span class="shopname">{{item.name}}</span><span
            class="comment_date">{{item.date}}</span>

            <ul>
              <li v-for="star in [1,2,3,4,5]" :class="{hover:star<= +item.grade}"></li>
            </ul>
          </div>
        </div>
        <div class="comment_con">{{item.comment}}</div>
        <div v-if="item.categoryInfo && item.categoryInfo.length" class="goods_property">{{item.categoryInfo || ""}}
        </div>
        <div v-if="item.comment_img && item.comment_img.length" class="add_comment_con clearfix">
          <ul>
            <li v-for="(imgItem, imgIndex) in item.comment_img">
              <img @click="imgClick( $event,imgIndex, imgItem, item)" :src="imgItem.img" :data-show-src="imgItem.big_img">
            </li>
          </ul>
        </div>
        <div v-if="item.comment_reply && item.comment_reply.length" class="ustomer_service_reply"><i
          class="up_arrow"></i>大V店客服回复：{{item.comment_reply}}
        </div>
        <div v-if="item.comment_append && item.comment_append.length">
          <div class="additionalDate_line"></div>
          <div v-if="item.comment_append_datediff" class="additionalDate">
            {{item.comment_append_datediff}}天后追加评价
          </div>
          <div v-if="item.comment_append_datediff==0" class="additionalDate">
            当日追加评价
          </div>
          <div class="comment_con">{{item.comment_append}}</div>
          <div v-if="item.comment_append_img && item.comment_append_img.length"
               class="add_comment_con clearfix">
            <ul>
              <li v-for="(imgItem, imgIndex) in item.comment_append_img"><img
                @click="imgClick( $event,imgIndex, imgItem, item)" :src="imgItem.img"
                :data-show-src="imgItem.big_img"></li>
            </ul>
          </div>
          <div v-if="item.comment_append_reply && item.comment_append_reply.length"
               class="ustomer_service_reply"><i class="up_arrow"></i>大V店客服回复：{{item.comment_append_reply}}
          </div>
        </div>
      </div>
    </div>

    <div v-show='loading' class="refresh">
      <div class="uil-default-css-normal"
           style="-webkit-transform:scale(0.15);-moz-transform:scale(0.15);-webkit-transform-origin: 0 0;-moz-transform-origin: 0 0;width:30px;height: 30px;display: inline-block;">
        <div
          style="top:80px;left:93px;width:14px;height:40px;background:#333;-webkit-transform:rotate(0deg) translate(0,-60px);transform:rotate(0deg) translate(0,-60px);border-radius:10px;position:absolute;"></div>
        <div
          style="top:80px;left:93px;width:14px;height:40px;background:#333;-webkit-transform:rotate(30deg) translate(0,-60px);transform:rotate(30deg) translate(0,-60px);border-radius:10px;position:absolute;"></div>
        <div
          style="top:80px;left:93px;width:14px;height:40px;background:#333;-webkit-transform:rotate(60deg) translate(0,-60px);transform:rotate(60deg) translate(0,-60px);border-radius:10px;position:absolute;"></div>
        <div
          style="top:80px;left:93px;width:14px;height:40px;background:#333;-webkit-transform:rotate(90deg) translate(0,-60px);transform:rotate(90deg) translate(0,-60px);border-radius:10px;position:absolute;"></div>
        <div
          style="top:80px;left:93px;width:14px;height:40px;background:#333;-webkit-transform:rotate(120deg) translate(0,-60px);transform:rotate(120deg) translate(0,-60px);border-radius:10px;position:absolute;"></div>
        <div
          style="top:80px;left:93px;width:14px;height:40px;background:#333;-webkit-transform:rotate(150deg) translate(0,-60px);transform:rotate(150deg) translate(0,-60px);border-radius:10px;position:absolute;"></div>
        <div
          style="top:80px;left:93px;width:14px;height:40px;background:#333;-webkit-transform:rotate(180deg) translate(0,-60px);transform:rotate(180deg) translate(0,-60px);border-radius:10px;position:absolute;"></div>
        <div
          style="top:80px;left:93px;width:14px;height:40px;background:#333;-webkit-transform:rotate(210deg) translate(0,-60px);transform:rotate(210deg) translate(0,-60px);border-radius:10px;position:absolute;"></div>
        <div
          style="top:80px;left:93px;width:14px;height:40px;background:#333;-webkit-transform:rotate(240deg) translate(0,-60px);transform:rotate(240deg) translate(0,-60px);border-radius:10px;position:absolute;"></div>
        <div
          style="top:80px;left:93px;width:14px;height:40px;background:#333;-webkit-transform:rotate(270deg) translate(0,-60px);transform:rotate(270deg) translate(0,-60px);border-radius:10px;position:absolute;"></div>
        <div
          style="top:80px;left:93px;width:14px;height:40px;background:#333;-webkit-transform:rotate(300deg) translate(0,-60px);transform:rotate(300deg) translate(0,-60px);border-radius:10px;position:absolute;"></div>
        <div
          style="top:80px;left:93px;width:14px;height:40px;background:#333;-webkit-transform:rotate(330deg) translate(0,-60px);transform:rotate(330deg) translate(0,-60px);border-radius:10px;position:absolute;"></div>
      </div>
      <div>数据加载中...</div>
    </div>
    <div v-show='no_more' class="refresh">没有更多评论</div>

    <div class="publish_pic_view hide">
      <div class="publish_pic_preview">
        <div class="swiper-wrapper">
        </div>
      </div>
      <div class="publish_pic_preview_bottom">
        <span class="back"><i class="back_arrow"></i>返回</span>
        <span class="num"></span>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
  import native from 'dvd-service-js-native';
  import ua from 'dvd-base-js-ua';

  export default{
    data(){
      return {
        loading: true,
        no_more: false,
        ajaxing: true,
        pageSize: window.pagesize || 20,
        pageIndex: window.pageIndexStart || 1,
        list: [],
        currentLength: 0,
        currentPageDataList: [],
      }
    },
    created(){
      /*评价详情页面*/
      if ($("#commentDetail").length) {
        this.getData();
      }
      /*评价详情列表页面，从商品详情评价点击进入*/
      else {
        this.getDataList();
        this.scroll();
      }
    },
    methods: {
      //获取评价详情数据
      getData: function () {
        var scope = this;
        scope.loading = true;//显示加载动画
        $.ajax({
          url: commentDetailUrl,
          dataType: "json",
          data: {},
          success: function (result) {
            scope.loading = false;
            if (result.code) {
              window.bravetime.info(result.msg);
            } else {
              scope.list = scope.list.concat(result.data);
            }
          }, error: function () {
            bravetime.ajaxError(89);
            scope.loading = false;
          }
        });
      },
      //获取评价详情列表数据
      getDataList: function () {
        var scope = this;
        if (!scope.no_more) {
          scope.loading = true;//显示加载动画
          if (scope.ajaxing) {
            scope.ajaxing = false;
            $.ajax({
              url: refreshUrl,
              dataType: "json",
              data: {
                page: scope.pageIndex,
                pagesize: scope.pageSize,
              },
              success: function (result) {
                scope.loading = false;
                if (result.code) {
                  scope.no_more = false;
                  window.bravetime.info(result.msg);
                } else {
                  scope.ajaxing = true;
                  if (result.data.length) {
                    scope.no_more = result.no_more;
                    scope.list = scope.list.concat(result.data);
                    scope.currentPageDataList = result.data;
                    scope.pageIndex = scope.pageIndex + 1;
                  } else {
                    scope.no_more = true;
                  }
                }
              }, error: function () {
                bravetime.ajaxError(89);
                scope.loading = false;
                scope.no_more = true;
                scope.ajaxing = true;
              }
            });
          }
        }
      },
      //下拉刷新
      scroll: function () {
        var scope = this;
        $(window).scroll(function () {//滚动条滚动事件
          var offset = window.pageYOffset;//文档现在的位置加上窗口的高度
          var offsetTop = document.body.scrollHeight;//整个页面的高度
          if (offsetTop - offset - window.screen.availHeight < 100) {//如果滚动条到一定位置
            if (!scope.no_more) {
              scope.getDataList();
            }
          }
        })
      },
      imgClick: function (event, imgIndex, imgItem, item) {
        // 调用app大图展示
        if(ua.isDvdApp() && ua.compareVersion(ua.getDvdAppVersion(), '5.5.0') >= 0) {
            debugger
          let listData = {
            data: this.list.map(function (commentItem) {
              return {
                comment: commentItem.comment,
                imageList: commentItem.comment_img && commentItem.comment_img.map(function(imageItem) {
                  return imageItem.big_img;
                }) || []
              };
            })
          };
          native.Browser.openImageBrowser({
            currentPageIndex: this.pageIndex, // 当前页码的下一页
            id: /\/(\d+).html/.exec(location.href)[1],  // 商品ID
            currentImgUrl: imgItem.big_img,  // 当前展示图片
            jsonString: JSON.stringify(listData)  //"json数据，格式为string类型" 格式：{data:[{"comment":"评论内容","imageList":["imageUrl",..]},..]}
          });
        } else {
          var scope = this;
          var bottomContainer = $(".publish_pic_preview_bottom");
          var previewContainer = $(".publish_pic_view");
          var currentLength;
          var lis = $(event.target).parents("ul").find("li");
          currentLength = lis.length;
          scope.currentLength = currentLength;
          var mySwiper = new Swiper('.publish_pic_preview', {
            observer: true,
            onTransitionEnd: function (swiper) {
              bottomContainer.find(".num").html(swiper.activeIndex + 1 + "/" + scope.currentLength);
            }
          });

          var index = imgIndex || 0, that = this;
          previewContainer.find(".swiper-wrapper").empty();

          lis.each(function (i, el) {
            if (el == that) {
              index = i;
            }
            var src = $(el).find("img").attr("data-show-src");

            var item = $('<div class="swiper-slide"><img src="' + src + '"></div>');
            previewContainer.find(".swiper-wrapper").append(item);
          });
          mySwiper.slideTo(index);

          bottomContainer.find(".num").html(mySwiper.activeIndex + 1 + "/" + scope.currentLength);
          console.log(currentLength);
          previewContainer.removeClass("hide");

          bottomContainer.find(".back").click(function () {
            previewContainer.addClass("hide");
          });
        }
      }
    }
  }
</script>
