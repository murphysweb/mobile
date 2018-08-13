<style scoped>

</style>


<template>
  <div>
    <!--<lheader :title="titleN" v-if="!isApp"></lheader>-->
    <com-top-title :title="titleN"></com-top-title>
    <lmain></lmain>
  </div>
</template>


<script>
  import util from "../../../../utils/utils.es6";

  import lheader from './policy-header.vue'
  import lmain from './policy-main.vue'

  export default {
    components: {
      lheader: lheader,
      lmain:lmain,
      'com-top-title': require('../../../component/com-top-title.vue'),
    },
    data(){
      return{
        titleN: '售后政策',
        isApp: util.utils.isApp(),
      }
    },
    methods:{

    }
  }
</script>
