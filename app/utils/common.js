/*
 * @Author: ,: nigel
 * @Date: ,: 2020-09-17 14:22:07
 * @LastEditTime: 2020-11-02 16:14:06
 */
/*
 * @name: 防抖函数
 * @msg:
 * @param {type}
 * @return {type}
 */
export function debounce(func, wait, immediate = true) {
  let timeout;
  return () => {
    const context = this;
    const args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(() => {
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
    const context = this;
    const args = arguments;
    if (type === 1) {
      const now = Date.now();
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
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

/**
 * @name: uuid
 * @msg: 生产唯一id
 * @param {}
 * @return:string
 */
export function uuid() {
  const date = new Date();
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? `0${m}` : m;
  let d = date.getDate();
  d = d < 10 ? `0${d}` : d;
  const h = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const str = y + m + d + h + minute + second;
  return str + Math.random().toString(36).substr(2);
}

export function convertImgElemByCanvas(imgElem, myCanvas, uploadImgType) {
  const { width, height } = imgElem;
  myCanvas.width = width;
  myCanvas.height = height;
  const myCtx = myCanvas.getContext('2d');
  myCtx.drawImage(imgElem, 0, 0, width, height);
  const imgbase64 = myCanvas.toDataURL(uploadImgType, 1.0);
  return imgbase64;
}

// 深度拷贝，终极版
export function deepClone(obj, weakMap = new WeakMap()) {
  function isObject(obj) {
    // return Object.prototype.toString.call(obj) === "[object Object]";
    return (
      (typeof obj === 'object' || typeof obj === 'function') && obj != null
    ); // 此处比较重要，如果直接使用上面的方式，就不会拷贝数组，函数，正则这些
  }
  function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
  }
  function isFunc(obj) {
    return typeof obj === 'function';
  }
  function isDate(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
  }
  function isArray(obj) {
    return Array.isArray(obj);
  }
  function isSet(obj) {
    return Object.prototype.toString.call(obj) === '[object Set]';
  }
  function isMap(obj) {
    return Object.prototype.toString.call(obj) === '[object Map]';
  }

  if (!isObject(obj)) {
    return obj;
  }
  // if (weakMap.get(obj)) {
  //     return weakMap.get(obj);
  // }
  if (isFunc(obj)) {
    let result = null;
    const parmasReg = /(?<=\().+(?=\)\s*)/; // (?<=\()是一个反向肯定预查，简单说就是以'('开头
    const bodyReg = /(?<={)(\n|.)+(?=})/m;
    const funcStr = obj.toString();
    if (obj.prototype) {
      const params = parmasReg.exec(funcStr);
      const body = bodyReg.exec(funcStr);
      if (body) {
        result = params
          ? new Function(...params[0].split(','), body[0])
          : new Function(body[0]);
      }
    } else {
      result = eval(funcStr);
    }
    weakMap.set(obj, result);
    return result;
  }

  if (isRegExp(obj)) {
    // 正则这里如果直接返回，其实不是拷贝了，而是返回的一份引用
    const regExpStr = obj.toString();
    const mode = regExpStr.substr(regExpStr.lastIndexOf('/') + 1);
    const result = obj.constructor(obj.source, mode);
    result.lastIndex = obj.lastIndex;
    // let result = obj;
    weakMap.set(obj, result);
    return result;
  }

  if (isDate(obj)) {
    let result = null;
    result = new obj.constructor(obj);
    weakMap.set(obj, result);
    return result;
  }

  if (isArray(obj)) {
    const result = [];
    for (const val of obj) {
      result.push(deepClone(val, weakMap));
    }
    weakMap.set(obj, result);
    return result;
  }
  if (isSet(obj)) {
    const result = new Set();
    obj.forEach((val) => {
      result.add(deepClone(val, weakMap));
    });
    weakMap.set(obj, result);
    return result;
  }
  if (isMap(obj)) {
    const result = new Map();
    obj.forEach((val, key) => {
      result.set(key, deepClone(val, weakMap));
    });
    weakMap.set(obj, result);
    return result;
  }

  // 最后默认普通对象
  const result = {};
  const symbols = Object.getOwnPropertySymbols(obj);
  if (symbols.length > 0) {
    for (const key of symbols) {
      const val = obj[key];
      result[key] = isObject(val) ? deepClone(val, weakMap) : val;
    }
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];
      result[key] = isObject(val) ? deepClone(val, weakMap) : val;
    }
  }

  weakMap.set(obj, result);
  return result;
}
