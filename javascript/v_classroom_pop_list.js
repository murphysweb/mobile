var poplist = require("../module/vClassroomPopList.vue");
var  VueLazyload = require('vue-lazyload/vue-lazyload');

Vue.use(VueLazyload, {
    // error: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
    // loading: '//9i.dvmama.com/free/2016/12/28/519_360_fdc5daf1d2eab033a50af9f80246da60.png',
    preload:2,
    try: 3 // default 1
})

new Vue({
    el: "#vPopList",
    data:function(){
        return{
            msg:'hello vue'
        }
    },
    components:{
        poplist:poplist,
    }
});
