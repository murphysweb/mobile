<template>
    <div class='articles_1_container'>
    <!-- <div class='articles_1_container' :style="{marginTop: data.marginTop +'px'}"> -->
	    <a :href="data.body.dataList[0].command.content" @click.stop="clickAnalysis"  :position="data.position">
	    	<div :style="{'background': 'url(' + data.body.dataList[0].imageUrl + ') center center / cover no-repeat' , 'background-size': 'cover'}" class='articles_1_img'></div>
	    	<img v-if='data.body.dataList[0].pageType == 2' src="http://9i.dvmama.com/free/2017/02/07/material-recorded.png" class='articles_1_imgNav'>
	    	<div class='articles_1_text' v-text='data.body.dataList[0].title'></div>
	    	<div class='articles_1_share'>
	    		<span v-text='data.body.dataList[0].menuName' v-if='data.body.dataList[0].isShowTime!=1'></span>
	    		<span v-if='data.body.dataList[0].isShowTime==1'>
	    			{{getFullTime(data.body.dataList[0].ctime)}}
	    		</span>
	    		<span class='articles_1_border'>&nbsp;&nbsp;</span>
	    		<span><span v-text='data.body.dataList[0].readTimes'></span>&nbsp;阅读数</span>

	    	</div>
	    </a>
	    <span class="share_container" @click="shareClick(data.body.dataList[0])">
		    		<span class="share_btn"></span>
		    		<span class="share_number">{{data.body.dataList[0].shareNum}}</span>
	    		</span>
    </div>
</template>
<script>
	import layout from "../layout/api.es6";
	import ua from 'dvd-base-js-ua'
    export default {
	    data(){
	        return {
	            msg: 'hello vue',
	            dataList:{},
	            mySwiper1:"1",
	        }
	    },
	    props: ['data'],
	    computed:{
	        dataList: function () {
	            return this.data || []
	        }
	    },
	    computed: {

	    },
	    created(){
	    	// console.log('articles1', this.data)
	    },
	    components: {},
	    methods:{
	    	shareClick(data){
	    		if(ua.isDvdApp()){

	    			location.href=data.shareCommand.content;
	    		}
	    	},
	        clickAnalysis:function(item) {
	        	let obj = {
	        		top: window.scrollY
	        	}
	        	layout.sStorageSet('v_list', obj)
	            // layout.clickAnalysis(item,this,'body');
	        },
	        clickGo: function(){
	        	let obj = {
	        		top: window.scrollY
	        	}
	        	layout.sStorageSet('v_list', obj)
	        	window.location = this.data.body.dataList[0].command.content
	        },
	        getFullTime: function (second) {
	        	var second = parseInt(second) * 1000
                var y = new Date(second).getFullYear();
                var monthtime = new Date(second).getMonth();
                var daytime = new Date(second).getDate();
                return y + '-' + (monthtime + 1) + '-' + daytime;
            }
	    }
	}
</script>
<style type="text/css">
	.share_btn{
	display: inline-block;
	width:0.2rem;
	height:0.2rem;
	background-size:100%;
	background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAACECAMAAABs6h+CAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA8UExURUxpcWZmZmxsbGZmZmpqamhoaGZmZmdnZ2hoaGZmZmVlZWZmZmVlZWdnZ2ZmZmZmZmlpaWZmZmhoaGZmZjUJ0W0AAAATdFJOUwCNHOoLTMyAMLL0cthZY6Y/wlPe9U0EAAABbUlEQVRo3u3Y3bKCIBSGYcRVgj+Erfu/1w11sikhmVnIyfceq88EDGJKIYQQQgghhBBCCCGUiazr5DKLy7TY+0GUXLOzuKxXPoxUY3nnM7Ciu7DsmWdnDvqakShvcvDCPJxcC7LyxDydXYWrpFwBv9fhswMsKlfBb/nWARaUK2E5uRZ+ybPvAEvJeVgbfzvMjRLyMUybnbnY2gKm4YcaXN0A3sbXs8fVHhZfZ7NuMMdDVO9L7tE+jMaoG6xqGwcyvy1KuV9w/L2W2rufsOPi+9lE1zTYqyk8+HGJ+wGHgV7pEjeFdfEFYEZBN4XDAWy/yE3hvXCCFXYTmMJI64vcBNb5vT+6s6SbwD47xSTuJvAzbFrZc7+wm8BbYfdYhN3TsHiAAQPuCHvnjDBMod93hFPK0uNrETBgwID/fR7aujt2mX8VTfweniqyhVN/7cjVNki4iqrlgZRMxtUMtZM+YCOEEEIIIYQQQgih+v4ACzMw3BycBrIAAAAASUVORK5CYII=)
}
.share_number{
	display: inline-block;
    line-height: 0.2rem;
    vertical-align: super;
}
.share_container{
	position: absolute;
    right: 0.12rem;
    bottom: 0.08rem;
    font-size: 0.12rem;
    color: #999;
}
	.articles_1_container{
		width: 3.75rem;
	    height: 2.55rem;
	    background: #fff;
	    padding-top: 0.1rem;
	    position: relative;
	}
	.articles_1_img{
		width: 3.55rem;
	    margin-left: 0.1rem;
	    height: 1.93rem;
	}
	.articles_1_text{
		margin: .05rem 0.1rem .08rem;
	    max-height: 1.3em;
	    overflow: hidden;
	    line-height: 1.5;
	    text-overflow: ellipsis;
	    -webkit-box-orient: vertical;
	    -webkit-line-clamp: 1;
	    display: -webkit-box;
	    font-size: 0.14rem;
	    color: #333333;
	    height: 0.39rem;
	}
	.articles_1_share{
		margin: 0 .1rem .12rem .1rem;
		margin-top: 0.08rem;
	    font-size: 0.11rem;
	    height: 0.16rem;
	    line-height: 0.16rem;
	    color: #999;
	    position:relative;
	}
	.articles_1_imgNav{
		position: absolute;
		top: 0.8rem;
		left: 1.6rem;
		width: 0.6rem;
		height: 0.6rem;
	}
	.articles_1_border{
		border-left: 0.5px solid #999;
		margin-left: 0.05rem;
		/*margin-right: 0.07rem;*/
	}
	.articles_1_minutes-img{
		position: absolute;
		top: 1.78rem;
		right: 0.4rem;
		height: 0.15rem;
	}
	.articles_1_minutes-span{
		position: absolute;
		top: 1.78rem;
		right: 0.1rem;
		height: 0.15rem;
		vertical-align: bottom;
		font-size: 0.12rem;
		color: #fff;
	}
</style>
