<script>
  let com = require('dvd-service-com-title');

  // 组件本身back属性默认值是false，但此处为了兼容mobile项目back默认值改为true。否则需要将php模板中'<com-top-title'修改为'<com-top-title back'
  com.props.back.default = true;

  // 兼容vue 1.x
  com.ready = com.mounted;

//  com.template = `<div class="com-top-title">\n${com.template}\n</div>}`;
//
//  alert(JSON.stringify(com));

  export default com;
</script>
