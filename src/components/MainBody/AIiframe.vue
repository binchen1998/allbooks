<template>
    <div class="modal_wrapper">
        <div class="modal_header">
            <Close class="modal_header_close" @click="handleClose" />
        </div>
        <div class="modal_iframe_wrapper">
            <iframe class="modal_iframe" :src="AIHtmlUrl"></iframe>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import qs from 'query-string';
import { Close } from '@element-plus/icons-vue';

const props = defineProps(['imgUrl']); // 从父组件传值
// 通过图片的值获取AIhtml的值
const AIHtmlUrl = computed(() => {
    const baseUrl = 'https://www.coding61.com/html/ai/index.html';
    const imgUrl = props.imgUrl;
    const searchObj = qs.parse(location.search); // 从链接获取参数对象
    const token  = searchObj.token; // 获取链接上的token参数
    const htmlUrl = `${baseUrl}?image=${imgUrl}&token=${token}`;
    console.log('htmlUrl:', htmlUrl);
    return htmlUrl;
});

// 关闭弹窗
function handleClose() {
    closeModal();
}
</script>

<style scoped>
.modal_wrapper {
    position: relative;
    width: 90%;
    height: 90%;
    padding: 20px;
    border-radius: 15px;
    background-color: #fff;
    overflow: hidden;
}

.modal_header {
    position: relative;
}

.modal_header_close {
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    color: #aaa;
    cursor: pointer;
}

.modal_iframe_wrapper {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
}

.modal_iframe {
    width: 100%;
    height: 100%;
    border: none;
    overflow-x: hidden;
    overflow-y: hidden;
}
</style>