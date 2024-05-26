<template>
    <div class="modal_wrapper">
        <div class="modal_header">
            <Close class="modal_header_close" @click="handleClose" />
        </div>
        <div class="modal_iframe_wrapper">
            <iframe class="modal_iframe" :src="ocrHtmlUrl"></iframe>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import { Close } from '@element-plus/icons-vue';
import { splitString } from '../../utils';

const props = defineProps(['imgUrl']); // 从父组件传值
// 通过图片的值获取OCRhtml的值
const ocrHtmlUrl = computed(() => {
    const baseUrl = 'https://www.coding61.com/qimeng/ocr/ocr4.html';
    const imgUrl = props.imgUrl;
    const jsonUrl = splitString(imgUrl, '.')[0] + '_paddle.json';
    const htmlUrl = `${baseUrl}?image=${imgUrl}&data=${jsonUrl}`;
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