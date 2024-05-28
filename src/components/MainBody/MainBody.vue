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
            <div v-if="isEnglish" class="mainbody_actions_icon_wrapper2" @click="handleClickLearn">
                <div>
                    <Microphone class="mainbody_actions_icon" />
                </div>
                <span>文本点读</span>
            </div>
            <div v-if="isMath" class="mainbody_actions_icon_wrapper2" @click="handleClickLearn">
                <div>
                    <div class="mainbody_actions_icon">
                        <img src="../../assets/AI.svg" />
                    </div>
                </div>
                <span>A I 讲题</span>
            </div>
            <div class="mainbody_actions_icon_wrapper3" @click="handleClickFullScreen">
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
import { Back, Right, Microphone, FullScreen } from '@element-plus/icons-vue';
import { openModal } from 'jenesius-vue-modal';
import Fullscreen from './FullScreen.vue';
import OCRiframe from './OCRiframe.vue';
import AIiframe from './AIiframe.vue';
import { loadImage, setLocalStorage, getLocalStorage } from '../../utils';

const props = defineProps(['subject', 'version', 'book']);
const nowPage = ref(1); // 当前展示页码
const fullContainer = ref(null); // 需要全屏展示的元素
const isFullScreen = ref(false); // 全屏展示文案
const basicUrl = 'https://www.coding61.com/qimeng/小学教材'; // 图片基础链接
const imgUrl = ref('');
let pageIsRendering = false; // 图片是否加载中
let nowContainer = null; // 当前模式下的容器
// 总页码
const totalPage = computed(() => {
    const book = props.book;
    const allPage = book.value?.children?.max_page_number || 1;
    return allPage;
});
// 教材名
const bookTitle = computed(() => {
    const book = props.book;
    const bookName = book.value?.name || '未选择教材';
    return bookName;
});
// 当前学科是否为英语
const isEnglish = computed(() => {
    return props.subject.indexOf('英语') > -1;
});
// 当前学科是否为数学
const isMath = computed(() => {
    return props.subject.indexOf('数学') > -1;
});

onMounted(() => {
    getNowPageCache(); // 获取缓存
    // 绑定数据存储事件
    window.addEventListener('unload', setNowPageCache);
    nowContainer = getCanvasContainerInfo('renderWrapper');
});

onUnmounted(() => {
    // 解绑数据存储事件
    window.removeEventListener('unload', setNowPageCache);
});

// 获取年级选中缓存数据
function getNowPageCache() {
    const page = getLocalStorage('now_page') || 1;
    nowPage.value = page;
}

// 设置年级选中缓存数据
function setNowPageCache() {
    setLocalStorage('now_page', nowPage.value);
}

// 渲染教材内容
function renderBook() {
    // 请求新的教材内容
    if (pageIsRendering) return;
    pageIsRendering = true;
    const { subject, version, book } = props;
    const picUrl = basicUrl + `/${subject}/${version}/${book.value.name}/page_${nowPage.value}.jpg`;
    imgUrl.value = picUrl;
    console.log('picUrl:', picUrl)
    loadImage(picUrl)
        .then((image) => {
            console.log('in loadImage:', nowContainer);
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
    const cRatio = containerWidth / containerHeight; // 容器宽高比
    const pRatio = imgWidth / imgHeight; // 图片宽高比
    let cWidth, cHeight; // canvas的宽高

    // 按照画布的宽高比例调整图片尺寸
    if (pRatio > cRatio) {
        cWidth = containerWidth; // 以容器高度为准
        cHeight = cWidth / pRatio;
    } else {
        cHeight = containerHeight; // 以容器宽度为准
        cWidth = cHeight * pRatio;
    }

    // 设置canvas绘制2倍图，画面更清晰
    canvas.width = cWidth * 2;
    canvas.height = cHeight * 2;
    canvas.style.width = cWidth + 'px';
    canvas.style.height = cHeight + 'px';

    // 将图片绘制到画布上
    ctx.drawImage(image, 0, 0, imgWidth, imgHeight, 0, 0, canvas.width, canvas.height);
}

// 获取画布容器的宽高
function getCanvasContainerInfo(containerEle) {
    const canvasWrapper = document.getElementById(containerEle);
    const width = canvasWrapper.clientWidth; //容器的宽度
    const height = canvasWrapper.clientHeight; //容器的高度
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

// 打开点读功能弹窗
function handleClickLearn() {
    if (isEnglish.value) {
        openModal(OCRiframe, {
            imgUrl,
        });
    } else if (isMath.value) {
        openModal(AIiframe, {
            imgUrl,
        });
    }
}

// 打开全屏功能弹窗
function handleClickFullScreen() {
    openModal(Fullscreen, {
        imgUrl,
    });
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
    font-size: 16px;
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
    font-size: 16px;
    text-align: center;
    color: #7f7f7f;
}

.mainbody_top_page button {
    width: 75px;
    height: 30px;
    border: none;
    background-color: #f9be17;
    border-radius: 15px;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
}

.mainbody_bottom {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: calc(100% - 50px);
    border-radius: 10px;
    background-color: #fff;
}

.mainbody_bottom_canvas {
    flex: 1 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
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

.mainbody_actions_icon_wrapper2 {
    position: absolute;
    bottom: 76px;
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

.mainbody_actions_icon_wrapper3 {
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

.mainbody_actions_icon_wrapper2 div,
.mainbody_actions_icon_wrapper3 div {
    height: 30px;
    margin-right: 8px;
    line-height: 30px;
}

.mainbody_actions_icon_wrapper2 span,
.mainbody_actions_icon_wrapper3 span {
    font-size: 16px;
}

.mainbody_actions_icon {
    flex: 1 0 auto;
    width: 30px;
    height: 30px;
}

.mainbody_actions_icon img {
    width: 100%;
    height: 100%;
}
</style>