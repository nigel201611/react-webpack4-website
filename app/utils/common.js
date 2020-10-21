/*
 * @Author: ,: nigel
 * @Date: ,: 2020-09-17 14:22:07
 * @LastEditTime: ,: 2020-10-21 17:36:01
 */
/*
 * @name: 防抖函数
 * @msg:
 * @param {type}
 * @return {type}
 */
export function debounce(func, wait, immediate = true) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
}
/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
export function throttle(func, wait, type = 1) {
  let previous = 0,
    timeout;
  return function () {
    let context = this;
    let args = arguments;
    if (type === 1) {
      let now = Date.now();
      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    }
  };
}
/*
 * @name: 获取DOM元素相对于文档的顶部距离
 * @msg:
 * @param {type}
 * @return {type}
 */
export function getElemOffsetTop(elem) {
  let offsetTop = elem.offsetTop;
  let currentElem = elem.offsetParent;
  while (currentElem) {
    offsetTop += currentElem.offsetTop;
    currentElem = currentElem.offsetParent;
  }
  return offsetTop;
}
/*
 * @name: getBase64
 * @msg: 将图片文件对象转换为base64格式数据
 * @param {file对象,callback}
 * @return {database数据}
 */
export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
