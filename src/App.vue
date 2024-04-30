<template>
  <div id="content">
    <SideBar id="bar" ref="barRef" :bookList="bookList" :chooseBook="handleChooseBook" :clearBook="handleClearBook" />
    <MainBody id="main" ref="mainRef" :subject="subject" :version="version" :book="book" />
  </div>
  <img id="background" src="./assets/bg.jpg">
  <WidgetContainerModal />
</template>

<script setup>
import { nextTick, onUnmounted, onMounted, reactive, ref } from 'vue';
import SideBar from './components/SideBar/SideBar.vue';
import MainBody from './components/MainBody/MainBody.vue';
import { container as WidgetContainerModal } from "jenesius-vue-modal";
import qs from 'query-string';
import { setLocalStorage, getLocalStorage } from './utils';

const searchObj = qs.parse(location.search); // 从链接获取参数对象
const subject = ref(searchObj.type || '小学数学'); // 从链接中获取学科
const bookList = reactive([]);  // 从json文件获取的全部书籍数组
const version = ref(''); // 被选中的教材版本
const book = reactive({}); // 被选中的教材
const barRef = ref(null); // 侧边栏引用
const mainRef = ref(null); // 阅读器组件引用

onMounted(() => {
  fetch('/json/dir_tree.json').then(resp => resp.json())
    .then(res => {
      for (let obj of res) {
        if (obj.type === "directory" && obj.name === subject.value) {
          bookList.value = obj.children;
          break;
        }
      }
      getBookCache();
    });

  // 绑定数据存储事件
  window.addEventListener('beforeunload', setBookCache);
});

onUnmounted(() => {
  // 解绑数据存储事件
  window.removeEventListener('beforeunload', setBookCache);
});

// 获取缓存数据
function getBookCache() {
  const bookData = getLocalStorage('bookCache');
  // 无缓存，或缓存数据与跳转链接上的type参数不匹配，则展示弹窗，选择教材版本
  if (!bookData || bookData.subject !== subject.value) {
    nextTick(() => {
      barRef.value.handleChooseBook();
    });
    return;
  }
  // 有缓存数据且与跳转链接上的type参数匹配，则展示缓存教材内容
  handleChooseBook(bookData.version, bookData.book);
  barRef.value.setVersion(bookData.version);
}

// 设置缓存
function setBookCache() {
  // 页面被关闭前，存储当前浏览信息
  // 卸载页面前，存储当前浏览的教材信息
  const bookData = {
    subject: subject.value,
    version: version.value,
    book: book.value,
  };
  setLocalStorage('bookCache', bookData);
}


// 展示被选中的书籍
function handleChooseBook(bookVersion, choosedBook) {
  book.value = choosedBook;
  version.value = bookVersion;
  // 等待数据更新后，下一个时间片调用渲染
  nextTick(() => {
    mainRef.value.renderBook(); // 渲染教材内容
  });
}

function handleClearBook() {
  // 选中新的教材前，清除上一个教材内容
  book.value = {};
  nextTick(() => {
    mainRef.value.clearBook(); // 渲染教材内容
  });
}
</script>

<style>
body {
  padding: auto;
  margin: auto;
}

#app {
  max-width: 1400px;
  margin: 0 auto;
}

#content {
  display: flex;
  margin: 30px;
  border-radius: 10px;
  background-color: #ffffff;
  overflow: scroll;
}

#background {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#bar {
  flex: 0 1 auto;
  width: 210px;
  overflow: hidden;
}

#main {
  flex: 1 0 auto;
  padding: 15px;
  background-color: #efefef;
}
</style>
