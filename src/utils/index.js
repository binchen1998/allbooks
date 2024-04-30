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
