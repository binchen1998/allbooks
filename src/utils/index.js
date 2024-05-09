// 获取json文件链接
export function getJsonUrl() {
  // serve: /json/dir_tree.json
  // build: https://www.coding61.com/qimeng/小学教材/dir_tree.json
  let jsonUrl = "https://www.coding61.com/qimeng/小学教材/dir_tree.json";
  const env = process.env.NODE_ENV;
  if (env === "development") {
    jsonUrl = "/json/dir_tree.json";
  }
  return jsonUrl;
}

// 设置缓存
export function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    // 可能是localStorage空间不足，进行错误处理
    console.error("Error setting cache:", e);
    return false;
  }
}

// 获取缓存
export function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

// 异步获取图片资源
export function loadImage(url) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.onload = function () {
      resolve(image);
    };
    image.onerror = function () {
      reject(new Error("Could not load image at " + url));
    };
    image.src = url;
  });
}

// 截取字符串
export function splitString(str, sign) {
  const lastIndex = str.lastIndexOf(sign);
  if (lastIndex === -1) {
    return ["", str];
  } else {
    const firstPart = str.substring(0, lastIndex);
    const secondPart = str.substring(lastIndex + 1);
    return [firstPart, secondPart];
  }
}