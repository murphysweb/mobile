var seriesCourse = require("../module/seriesCourse.vue");
var supervisionClass = require("../module/supervisionClass.vue");
var VueLazyload = require('vue-lazyload/vue-lazyload');
Vue.use(VueLazyload, {
    try: 3,
    preload:2
});

window.backNewData = new Vue({
    el: "#seriesCourse",
    data:function(){
        return{
            msg:'hello vue'
        }
    },
    components:{
        seriesCourse:seriesCourse
    },
    mounted(){
        console.log(234234);
    }
});
