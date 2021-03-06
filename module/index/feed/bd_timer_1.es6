import layout from "../layout.es6"
import * as tt_com_0 from './tt_com_0.vue'
export default {
    data(){
        return{
            hours:null,
            minutes:null,
            seconds:null,
            seckillTime:null,
        }
    },
    props:['data'],
    created:function () {
        /**
         * 数据排序
         */
        for(let i = 0 ; i < this.data.body.dataList.length; i++){
            for(let j = 0 ; j < this.data.body.dataList.length - 1; j++){
                if(parseInt(this.data.body.dataList[j+1].position) < parseInt(this.data.body.dataList[j].position)){
                    console.log(222);
                    let temp = this.data.body.dataList[j];
                    this.data.body.dataList[j] = this.data.body.dataList[j+1];
                    this.data.body.dataList[j + 1] = temp;
                }
            }
        }
        //layout.sort(this.data);
        /**
         * 秒杀倒计时
         */
        this.$nextTick(function () {
            let scope = this;
            let seckillContainer = $(".seckillCountdown");
            let timestamp = Date.parse(new Date()) / 1000;
            if (seckillContainer.length) {
                scope.seckillTime = this.data.body.endTime - timestamp;
                //网页加载即显示时间，不等计时器运行就让页面存在时间
                if (scope.seckillTime >= 0) {
                    scope.seconds = (scope.seckillTime % 60 < 10 ? "0" : "") + "" + scope.seckillTime % 60;
                    scope.minutes = (Math.floor(scope.seckillTime / 60) % 60 < 10 ? "0" : "") + "" + Math.floor(scope.seckillTime / 60) % 60;
                    scope.hours = (Math.floor(scope.seckillTime / 60 / 60) < 10 ? "0" : "") + "" + Math.floor(scope.seckillTime / 60 / 60);
                }
                let ts = setInterval(function () {
                    if (scope.seckillTime < 0) {
                        clearInterval(ts);
                    } else {
                        scope.seconds = (scope.seckillTime % 60 < 10 ? "0" : "") + "" + scope.seckillTime % 60;
                        scope.minutes = (Math.floor(scope.seckillTime / 60) % 60 < 10 ? "0" : "") + "" + Math.floor(scope.seckillTime / 60) % 60;
                        scope.hours = (Math.floor(scope.seckillTime / 60 / 60) < 10 ? "0" : "") + "" + Math.floor(scope.seckillTime / 60 / 60);
                    }
                    scope.seckillTime--;
                }, 1000);
            }
        })
    },
    computed: {
        styleObject: function () {
            var scope = this;
            return layout.styleObject(scope.data);
        }
    },
    components: {
        tt_com_0:tt_com_0
    },
    methods:{
        imgObject:function (imgSrc) {
            return{
                src: imgSrc || '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
                error: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
                loading: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png'
            }
        },
        clickAnalysis:function(e) {
            layout.clickAnalysis(e,this,'body');
        }
    },
    watch:{
        "data":function () {
            for(let i = 0 ; i < this.data.body.dataList.length; i++){
                for(let j = 0 ; j < this.data.body.dataList.length - 1; j++){
                    if(parseInt(this.data.body.dataList[j+1].position) < parseInt(this.data.body.dataList[j].position)){
                        let temp = this.data.body.dataList[j];
                        this.data.body.dataList[j] = this.data.body.dataList[j+1];
                        this.data.body.dataList[j + 1] = temp;
                    }
                }
            }
        }
    }
}
