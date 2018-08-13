<template>
<div id="commen" v-if="nofeeddata.body">
  <category :list="nofeeddata.body.dataList" :no_more="no_more" :errors="errors" :loading="beforeFirstLoading"></category>
</div>
</template>

<script>
import category from "../src/component/com-maybeyoulike.vue";
export default {
  data() {
    return {
      no_more: true,
      errors: false,
      beforeFirstLoading: false,
      list: [],
    }
  },
  props:['nofeeddata'],
  components: {
    category: category,
  }
}
</script>
