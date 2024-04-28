<template>
  <div>
    <div class="sidebar_top" @click="handleChooseBook">
      <div class="sidebar_top_icon_wrapper">
        <Notebook class="sidebar_top_icon" />
      </div>
      <div class="sidebar_top_title">选择教材</div>
    </div>
    <ul class="sidebar_bottom">
      <li>语文一年级（上）语文一年级（上）语文一年级（上）语文一年级（上）</li>
      <li>语文一年级（上）</li>
      <li>语文一年级（上）</li>
      <li>语文一年级（上）</li>
      <li>语文一年级（上）</li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Notebook } from '@element-plus/icons-vue';
import BookModal from './BookModal.vue';
import { openModal } from 'jenesius-vue-modal';

onMounted(() => {
  fetch('/json/dir_tree.json').then(resp => resp.json())
    .then(res => {
      console.log(res);
    });
});

// 点击选择教材，弹出弹框
function handleChooseBook() {
  openModal(BookModal, { title: "Hello World" });
}
</script>
<style>
.sidebar_top {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  border-bottom: solid 1px #aaaaaa;
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
  font-size: 18px;
  font-weight: bold;
  line-height: 14px;
  color: #878787;
}

.sidebar_bottom {
  padding: 0 24px;
  margin: 0;
  list-style: none;
  font-size: 18px;
  line-height: 45px;
  color: #7f7f7f;
}

.sidebar_bottom li {
  margin: 15px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
</style>