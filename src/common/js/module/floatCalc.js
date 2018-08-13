/**
 * 浮点数数学操作，解决浮点数精度问题
 * @module float-calc
 */
export default {
  /**
   * 浮点数计算-加法
   * @param a {Number} 数字a
   * @param b {Number} 数字b
   * @param digit {int} 有效位数（有效位之后的数字将被丢弃不予计算）
   * @returns {Number}
   */
  plus(a = 0, b = 0, digit = 2){
    let expand = Math.pow(10, digit);
    return (parseInt(a * expand) + parseInt(b * expand)) / expand;
  },
  /**
   * 浮点数计算-减法
   * @param a {Number} 数字a
   * @param b {Number} 数字b
   * @param digit {int} 有效位数（有效位之后的数字将被丢弃不予计算）
   * @returns {Number}
   */
  minus(a = 0, b = 0, digit = 2){
    let expand = Math.pow(10, digit);
    return (parseInt(a * expand) - parseInt(b * expand)) / expand;
  },
  /**
   * 浮点数计算-乘法
   * @param a {Number} 数字a
   * @param b {Number} 数字b
   * @param digit {int} 有效位数（有效位之后的数字将被丢弃不予计算）
   * @returns {Number}
   */
  multiply(a = 0, b = 0, digit = 2){
    let expand = Math.pow(10, digit);
    return (parseInt(a * expand) - parseInt(b * expand)) / expand;
  },
  /**
   * 浮点数计算-除法
   * @param a {Number} 数字a
   * @param b {Number} 数字b
   * @param digit {int} 有效位数（有效位之后的数字将被丢弃不予计算）
   * @returns {Number}
   */
  divide(a = 0, b = 0, digit = 2){
    let expand = Math.pow(10, digit);
    return (parseInt(a * expand) - parseInt(b * expand)) / expand;
  },
}
