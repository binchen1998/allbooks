<template>
    <div class="modal_wrapper">
        <div class="modal_header">
            <Close class="modal_header_close" @click="handleClose" />
        </div>
        <div class="modal_fullscreen_wrapper">
            <img id="zoomedImage" :src="props.imgUrl" alt="Zoomable Image" />
        </div>
    </div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import { Close } from '@element-plus/icons-vue';

const props = defineProps(['imgUrl']); // 从父组件传值

onMounted(() => {
    zoomImage();
});

// 关闭弹窗
function handleClose() {
    closeModal();
}

// 缩放功能
function zoomImage() {
    const zoomedImage = document.getElementById('zoomedImage');
    let initialScale = 1;
    let currentScale = 1;
    let initialX = 0;
    let initialY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let initialDistance = 0;
    let currentDistance = 0;

    zoomedImage.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            initialX = e.touches[0].clientX - currentX;
            initialY = e.touches[0].clientY - currentY;
            isDragging = true;
        } else if (e.touches.length === 2) {
            initialDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    });

    zoomedImage.addEventListener('touchmove', function(e) {
        if (e.touches.length === 1 && isDragging) {
            e.preventDefault();
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
            zoomedImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
        } else if (e.touches.length === 2) {
            currentDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );

            if (initialDistance > currentDistance) {
                currentScale = initialScale - (initialDistance - currentDistance) * 0.01;
            } else {
                currentScale = initialScale + (currentDistance - initialDistance) * 0.01;
            }

            zoomedImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
        }
    });

    zoomedImage.addEventListener('touchend', function() {
        initialX = currentX;
        initialY = currentY;
        initialScale = currentScale;
        isDragging = false;
    });
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

.modal_fullscreen_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
}

#zoomedImage {
    max-width: 100%;
    max-height: 100%;
    transition: transform 0.3s;
    cursor: pointer;
}
</style>