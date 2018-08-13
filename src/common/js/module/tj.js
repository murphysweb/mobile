import $ from '$';
import login from './login.js';
import ua from './ua.js';

// 前端点击数据采集格式，具体如下：
let defaultParam = {
  ip: '', // ip
  nxtime:'', // ng时间，留空，数据由nginx生成
  timestamp:  Date.now(), // 日志时间
  production: 5, // 业务线 默认为0，APP分享为4，H5分享为5
  log_source: 0, // 日志来源 默认为0，首页点击为1
  user_agent: navigator.userAgent, // 浏览器UA
  market: '', // 来源市场，andriod是渠道号，ios为空
  uid: login.getUserId(), // 用户id
  session: login.getSessionId(), // session id
  status: login.getUserStatusCode(), // 卖家状态 (0：游客 1:买家 3:卖家)
  action: 1, // 1：点击
  action_type:  0, // 填默认值：0
  object_id:'', // 模板id
  device_id: '', // 设备号
  device: ua.isIos() ? 'ios' : ua.isAndroid() ? 'android' : '', // 设备类型
  sys_version: '', // 设备版本号
  resolution: window.screen.width + '*' + window.screen.height, // 分辨率
  location: location.href, // 当前位置
  app_version: '', // APP版本号
  production_data: { // 详细信息
    share_source:'1', // 具体见上面的表格
    source_url:'', // 来源url
    share_type:0, // 具体见上面的表格
    dp:'share_source_1' // 默认为share_source_0
  }
};

export default {

  /**
     * 功能：发送统计信息
     * wiki :http://wiki.bravetime.net/pages/viewpage.action?pageId=14778431
     * 用法：
     * tj.send({
        production: 17,
        action: 1,
        action_type: action_type,
        production_data: {
          feed: {
            cmdContent: cmdContent || ''
          }
        }
      });
     */
  send(param) {
    let newParam = $.extend(true, {}, defaultParam, param);
    $.ajax({
      cache: false,
      async: false,
      url: '/appapi?_=' + Date.now(), // 这个接口值在davdian.com下存在
      type: 'post',
      dataType: 'text',
      data: JSON.stringify(newParam),
      success(response) {
        console.log(response);
      },
      error(error) {
        console.error('ajax error:' + error.status + ' ' + error.statusText);
      }
    });
  }
};
