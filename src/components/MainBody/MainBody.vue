<template>
    <div>
        <div class="mainbody_top">
            <div class="mainbody_top_title">当前阅读：{{ bookTitle }}</div>
            <div class="mainbody_top_page">
                <span>输入页码</span>
                <input id="pageInput" :value="nowPage" @input="handleInputPage" />
                <button @click="handleToPage">前往</button>
            </div>
        </div>
        <div ref="fullContainer" id="fullContainer" class="mainbody_bottom">
            <div class="mainbody_actions_icon_wrapper" @click="showPrevPage">
                <Back class="mainbody_actions_icon" />
            </div>
            <div id="renderWrapper" class="mainbody_bottom_canvas">
                <canvas id="render"></canvas>
            </div>
            <div class="mainbody_actions_icon_wrapper" @click="showNextPage">
                <Right class="mainbody_actions_icon" />
            </div>
            <div class="mainbody_actions_icon_wrapper2" @click="toggleFullScreen">
                <div>
                    <FullScreen class="mainbody_actions_icon" />
                </div>
                <span>{{ isFullScreen ? '取消全屏' : '全屏展示' }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineExpose, computed, onMounted, onUnmounted } from 'vue';
import { Back, Right, FullScreen } from '@element-plus/icons-vue';
import screenfull from 'screenfull';
import { loadImage, setLocalStorage, getLocalStorage } from '../../utils';

const props = defineProps(['subject', 'version', 'book']);
const nowPage = ref(1); // 当前展示页码
const fullContainer = ref(null); // 需要全屏展示的元素
const isFullScreen = ref(false); // 全屏展示文案
const basicUrl = 'https://www.coding61.com/qimeng/小学教材'; // 图片基础链接
let pageIsRendering = false; // 图片是否加载中
let nowImg = null; // 当前图片
// 非全局模式下，以renderWrapper为容器，全局模式下，以fullContainer为容器
let normalContainer = null;
let fullScreenContainer = null;
let nowContainer = null; // 当前模式下的容器
let isFirstFull = true; // 是否第一次打开全屏
// 总页码
const totalPage = computed(() => {
    const book = props.book;
    const allPage = book.value?.children.max_page_number || 1;
    return allPage;
});
// 教材名
const bookTitle = computed(() => {
    const book = props.book;
    const bookName = book.value?.name || '未选择教材';
    return bookName;
});


onMounted(() => {
    getNowPageCache(); // 获取缓存
    // 绑定数据存储事件
    window.addEventListener('beforeunload', setNowPageCache);
    // 全屏事件切换绑定
    if (screenfull.isEnabled) {
        screenfull.on('change', handleFullScreenChange);
        nowContainer = normalContainer = getCanvasContainerInfo('renderWrapper');
        console.log('onMounted:', nowContainer)
    }
});

onUnmounted(() => {
    // 解绑数据存储事件
    window.removeEventListener('beforeunload', setNowPageCache);
    // 全屏事件切换解绑
    if (screenfull.isEnabled) {
        screenfull.off('change', handleFullScreenChange);
    }
});

// 获取年级选中缓存数据
function getNowPageCache() {
    const page = getLocalStorage('nowPage') || 1;
    nowPage.value = page;
}

// 设置年级选中缓存数据
function setNowPageCache() {
    setLocalStorage('nowPage', nowPage.value);
}

// 渲染教材内容
function renderBook() {
    // 请求新的教材内容
    if (pageIsRendering) return;
    pageIsRendering = true;
    const { subject, version, book } = props;
    const picUrl = basicUrl + `/${subject}/${version}/${book.value.name}/page_${nowPage.value}.jpg`;
    console.log('picUrl:', picUrl)
    loadImage(picUrl)
        .then((image) => {
            nowImg = image;
            console.log('loadImage:', nowContainer);
            setCanvas(image, nowContainer.width, nowContainer.height);
            pageIsRendering = false;
        });
}

// 清除画布
function clearBook() {
    const canvas = document.getElementById('render');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bookTitle.value = '未选择教材';
    nowPage.value = 1;
}

// 处理画布，绘制图片
function setCanvas(image, containerWidth, containerHeight) {
    // 获取画布
    const canvas = document.getElementById('render');
    const ctx = canvas.getContext('2d');
    const imgWidth = image.width; // 图片宽度
    const imgHeight = image.height; // 图片高度
    const pHRatio = imgHeight / imgWidth; // 图片高宽比
    const pWRatio = imgWidth / imgHeight; // 图片宽高比
    let cWidth, cHeight; // canvas的宽高
    // 判断图片的宽高和容器宽高的大小
    // 如果pHRatio>=1，则以高度为准；如果pWRatio>1，则以宽度为准
    if (pHRatio >= 1) {
        // 图片高或宽高相等
        // 以图片高度为准
        const ratio = containerHeight / imgHeight;
        cWidth = imgWidth * ratio;
        cHeight = containerHeight;
    } else if (pWRatio > 1) {
        // 图片长
        // 以图片宽度为准
        const ratio = containerWidth / imgWidth;
        cWidth = containerWidth;
        cHeight = imgHeight * ratio;
    }

    // 设置canvas绘制2倍图，画面更清晰
    canvas.width = cWidth * 2;
    canvas.height = cHeight * 2;
    canvas.style.width = cWidth + 'px';
    canvas.style.height = cHeight + 'px';

    console.log('setCanvas:', cWidth)

    // 将图片绘制到画布上
    ctx.drawImage(image, 0, 0, imgWidth, imgHeight, 0, 0, canvas.width, canvas.height);
}

// 获取画布容器的宽高
function getCanvasContainerInfo(containerEle) {
    const canvasWrapper = document.getElementById(containerEle);
    const width = canvasWrapper.offsetWidth; //容器的宽度
    const height = canvasWrapper.offsetHeight; //容器的高度
    return {
        width,
        height,
    }
}

// 输入页码
function handleInputPage(event) {
    nowPage.value = event.target.value;
}

// 前往页码
function handleToPage() {
    const val = Number(nowPage.value);
    if (val > totalPage.value) {
        nowPage.value = totalPage.value;
    }
    renderBook();
}

// 上一页
function showPrevPage() {
    if (nowPage.value <= 1) {
        return;
    }
    nowPage.value--;
    renderBook();
}

// 下一页
function showNextPage() {
    if (nowPage.value >= totalPage.value) {
        return;
    }
    nowPage.value++;
    renderBook();
}

// 全屏展示
function toggleFullScreen() {
    if (!screenfull.isEnabled) {
        alert('出错了！无法打开全屏模式o(╥﹏╥)o');
        return;
    }
    screenfull.toggle(fullContainer.value);
}

// 全屏事件监听
function handleFullScreenChange() {
    // 只在第一次打开时，获取全屏时fullScreenContainer
    if (screenfull.isFullscreen && isFirstFull) {
        isFirstFull = false;
        fullScreenContainer = getCanvasContainerInfo('fullContainer');
    }
    if (screenfull.isFullscreen) {
        isFullScreen.value = true;
        nowContainer = fullScreenContainer;
    } else {
        isFullScreen.value = false;
        nowContainer = normalContainer;
    }
    setCanvas(nowImg, nowContainer.width, nowContainer.height);
}

defineExpose({
    renderBook,
    clearBook,
});
</script>

<style>
.mainbody_top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.mainbody_top_title,
.mainbody_top_page span {
    font-size: 18px;
    line-height: 45px;
    color: #7f7f7f;
}

.mainbody_top_page {
    display: flex;
    align-items: center;
    justify-content: center;
}

.mainbody_top_page input {
    width: 75px;
    height: 30px;
    margin: 0 12px;
    border: none;
    border-radius: 15px;
    background-color: #ffffff;
    font-size: 18px;
    text-align: center;
    color: #7f7f7f;
}

.mainbody_top_page button {
    width: 75px;
    height: 30px;
    border: none;
    background-color: #f9be17;
    border-radius: 15px;
    font-size: 18px;
    color: #fff;
    cursor: pointer;
}

.mainbody_bottom {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 10px;
    background-color: #fff;
}

.mainbody_bottom_canvas {
    flex: 1 0 auto;
    display: flex;
    justify-content: center;
    min-height: 630px;
}

.mainbody_bottom_canvas canvas {
    max-width: 100%;
    max-height: 100%;
}

.mainbody_actions_icon_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    margin: 0 15px;
    border-radius: 50%;
    background-color: #f9be17;
    color: #fff;
    cursor: pointer;
}

.mainbody_actions_icon {
    flex: 1 0 auto;
    width: 30px;
    height: 30px;
}

.mainbody_actions_icon_wrapper2 {
    position: absolute;
    bottom: 16px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 136px;
    height: 45px;
    background-color: #f9be17;
    border-radius: 23px;
    color: #fff;
    cursor: pointer;
}

.mainbody_actions_icon_wrapper2 div {
    height: 30px;
    margin-right: 8px;
    line-height: 30px;
}

.mainbody_actions_icon_wrapper2 span {
    font-size: 18px;
}
</style>