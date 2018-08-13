<template>
    <div>
      <!--<div class="img_container" v-if="environment==`menu`">-->
      <div class="img_container" v-if="environment=='menu'">
        <img src="http://9i.dvmama.com/free/theme_thu_img13.jpg" alt="">
      </div>

    </div>
</template>
<script>
  export default {
      data(){
          return{

          }
      },
    props:['environment']
  }
</script>
