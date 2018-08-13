<template>
	<div class="earn-footer">
		<div class="btns">
			<a class="btn" href="/sm/earn_home.html">
				<div class="pic-title">
					<img src="//9i.dvmama.com/free/0422/btn1.png" class="pic">
					<div class="title">我的</div>
				</div>
			</a>
			<a class="btn active">
				<div class="pic-title">
					<img src="//9i.dvmama.com/free/0422/btn2active.png" class="pic">
					<div class="title">素材</div>
				</div>
			</a>
			<a v-if="position==3" class="btn" :href='"https://"+host+"/index.php?m=admin&c=mamaAdviser&a=getMember"'>
				<div class="pic-title">
					<img src="//9i.dvmama.com/free/0422/btn3.png" class="pic">
					<div class="title">服务社群</div>
				</div>
			</a>
		</div>
	</div>
</template>
<style type="text/css">
.earn-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: #fff;
    border-top: #eee solid 1px;

    font-size: 0;
    max-width: 640px;
    z-index: 10;
    box-sizing: border-box;

}
	.btns{
		display: -webkit-box;
	    display: -webkit-flex;
	    display: -moz-box;
	    display: -ms-flexbox;
	    display: flex;
	    height: 50px;
	}
	.btns .btn {
	    -webkit-box-flex: 1;
	    -webkit-flex: 1;
	    -moz-box-flex: 1;
	    -ms-flex: 1;
	    flex: 1;
	    display: block;
	    text-align: center;
	}
	.btns .btn .pic-title {
	    position: relative;
  display: inline-block;
  width: 50px;
  height: 50px;
	}
	.btns .btn .pic-title .pic {
	    display: inline-block;
  margin-top: 7px;
  width: 18px;
  height: 21px;
	}
	.btns .btn .pic-title .title {

	    top: 30px;
	    width: 100%;
	    line-height: 18px;
	    font-size: 10px;
	    color: #999;
	}
	.btns .btn.active .pic-title .title{
		color: #FF4A7D;
	}
</style>
<script type="text/javascript">
	import popup from 'dvd-service-js-popup';
	import login from 'dvd-service-js-login';
	import encrypt from 'dvd-service-js-encrypt';
	export default {
		data(){
			return {
				position:0,
				host:'s.davdian.com'
			}
		},
		created(){
			this.getData();
			this.setHost();
		},
		methods:{
			setHost(){
				if('[[env]]'=='gray'){
					this.host = 's[[num]].davdian.com';
				}else if('[[env]]'=='beta'){
					this.host = 's[[num]].vyohui.cn';
				}
			},
			getData(){
				let ts = this;

      // 取缓存
      /*let response = cache.getItem('/[[project]]/earn_home');
       if (response) {
       ts.response = response;
       document.body.className += ' loaded';
       return;
       }*/

      // 调接口
      $.ajax({
        cache: false,
        async: true,
        url: '/api/mg/community/earning/index?_=' + Date.now(),
        type: 'post',
        dataType: 'json',
        data: encrypt.ajax({
          // js_wx_info: 1,
        }),
        success(response) {
          try {
            if(login.isBuyer()){
              location.replace("/");
              return false;
            }
            if (response.code === 0) {
              	if(response.data&&response.data.userInfo&&response.data.userInfo.position){
              		ts.position = response.data.userInfo.position;
              	}
              }
          } catch (err) {
            // 这个try-catch不要去掉，因为有异常时会阻止强制跳转
          }
        },
        error(error) {
          // 只有本地调试版本才能使用mock数据
          if (!'[[env]]') {
            console.error(`ajax已执行error回调方法: url=${this.url}, reason=${error.status} ${error.statusText} `);
            this.success(require('../json/earn_home.json'));
            console.warn(`ajax已使用mock数据: url=${this.url}, mock=earn_home.json`);
          }
        }
      });
			}
		}
	}
</script>
