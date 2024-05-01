<template>
  <div>
    <div class="sidebar_top" @click="handleChooseBook">
      <div class="sidebar_top_icon_wrapper">
        <Notebook class="sidebar_top_icon" />
      </div>
      <div class="sidebar_top_title">选择教材</div>
    </div>
    <div class="sidebar_bottom">
      <ul>
        <li v-for="(book, idx) in books" :key="idx" :class="{ 'choosed': selectedIdx === idx }"
          @click="() => handleBook(book, idx)">
          {{ book.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed, defineExpose, onMounted, onUnmounted } from 'vue';
import { Notebook } from '@element-plus/icons-vue';
import { openModal } from 'jenesius-vue-modal';
import { setLocalStorage, getLocalStorage } from '../../utils';
import BookModal from './BookModal.vue';

const props = defineProps(['bookList', 'chooseBook', 'clearBook']);
const books = ref([]); // 展示在页面中的教材列表
const selectedIdx = ref(null); // 选中的教材
let bookVersion = null; // 选中的教材版本

// 传递给弹窗的教材版本数组
const versionList = computed(() => {
  // 更新versionList
  let versionList = [];
  props.bookList.value?.forEach((item) => {
    versionList.push(item.name);
  });

  return versionList;
});

onMounted(() => {
  getSelectIdxCache();
  // 绑定数据存储事件
  window.addEventListener('beforeunload', setSelectIdxCache);
});

onUnmounted(() => {
  // 解绑数据存储事件
  window.removeEventListener('beforeunload', setSelectIdxCache);
});

// 获取年级选中缓存数据
function getSelectIdxCache() {
  const selectIdx = getLocalStorage('selectIdx');
  selectedIdx.value = selectIdx;
}

// 设置年级选中缓存数据
function setSelectIdxCache() {
  setLocalStorage('selectIdx', selectedIdx.value);
}

// 点击选择教材，弹出弹框
function handleChooseBook() {
  openModal(BookModal, {
    versionList,
    chooseVersion,
  });
}

// 弹窗中筛选教材版本
function chooseVersion(version) {
  setVersion(version);
  selectedIdx.value = null;
  // 清理之前展示的教材内容
  props.clearBook();
}

// 设置教材版本
function setVersion(version) {
  bookVersion = version; // 选中教材版本
  let chooseGrades = [];
  // 筛选对应版本下的教材
  for (let book of props.bookList.value) {
    if (book.name === version) {
      chooseGrades = book.children;
      break;
    }
  }
  // 处理教材数据
  books.value = chooseGrades.filter((item) => {
    return item.type === 'directory';
  });
}

// 在左侧菜单栏中点击选择教材
function handleBook(book, idx) {
  selectedIdx.value = idx;
  // 清理之前展示的教材内容
  props.clearBook();
  // 重新选择教材
  props.chooseBook(bookVersion, book);
}

defineExpose({
  setVersion,
  chooseVersion,
  handleChooseBook,
});
</script>
<style>
.sidebar_top {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  border-bottom: solid 1px #aaaaaa;
  border-top-left-radius: 10px;
  background-color: #fff;
  cursor: pointer;
}

.sidebar_top_icon_wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #f9be17;
  color: #fff;
}

.sidebar_top_icon {
  flex: 1 0 auto;
  width: 30px;
  height: 30px;
}

.sidebar_top_title {
  margin-left: 15px;
  font-size: 16px;
  font-weight: bold;
  line-height: 14px;
  color: #878787;
}

.sidebar_bottom {
  max-height: 620px;
  overflow: auto;
}

.sidebar_bottom ul {
  padding: 0 10px;
  margin: 0;
  list-style: none;
  font-size: 16px;
  line-height: 45px;
  color: #7f7f7f;
}

.sidebar_bottom li {
  padding: 0 24px;
  margin: 15px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}

.sidebar_bottom li.choosed {
  color: #fff;
  background-color: #f9be17;
  border-radius: 5px;
}
</style>