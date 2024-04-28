<template>
    <div>
        <div class="mainbody_top">
            <div class="mainbody_top_title">当前阅读：{{ bookTitle }}</div>
            <div class="mainbody_top_page">
                <span>输入页码</span>
                <input id="pageInput" :value="pdfPage" @input="handleInputPage" />
                <button @click="handleToPage">前往</button>
            </div>
        </div>
        <div class="mainbody_bottom">
            <div class="mainbody_actions_icon_wrapper" @click="showPrevPage">
                <Back class="mainbody_actions_icon" />
            </div>
            <div class="mainbody_bottom_canvas">
                <canvas id="pdf-render"></canvas>
            </div>
            <div class="mainbody_actions_icon_wrapper" @click="showNextPage">
                <Right class="mainbody_actions_icon" />
            </div>
            <div class="mainbody_actions_icon_wrapper2">
                <div>
                    <FullScreen class="mainbody_actions_icon" />
                </div>
                <span>全屏展示</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { Back, Right, FullScreen } from '@element-plus/icons-vue';
import * as pdfjsLib from 'pdfjs-dist/webpack.mjs';
let pdfDoc = null; //  pdf文件
let totalPage = 0; // pdf文件总页数
let pageIsRendering = false; // pdf文件是否加载中
let pageNumIsPending = null; //
let pdfUrl = '/static/a.pdf'; // pdf文件链接
let pdfScale = 1; // pdf文件缩放比
const bookTitle = ref('未选择教材'); // pdf文件名展示
const pdfPage = ref(1); // pdf文件当前展示页码

onMounted(() => {
    loadFile(pdfUrl);
});

// 加载文件
const loadFile = async (url) => {
    // Get Document
    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdfDoc = pdf;
        totalPage = pdf.numPages;
        nextTick(() => {
            renderPage(pdfPage.value);
        });
    });
};

// 渲染页面
function renderPage(pageNum) {
    pageIsRendering = true;
    // Get page
    pdfDoc.getPage(pageNum).then(page => {
        // 获取画布
        const canvas = document.getElementById('pdf-render');
        const ctx = canvas.getContext('2d');
        // 设置缩放比
        const viewport = page.getViewport({ scale: pdfScale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        };

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });
    });
}

// 输入页码
function handleInputPage(event) {
    pdfPage.value = event.target.value;
}

// 前往页码
function handleToPage() {
    const val = Number(pdfPage.value);
    let toPage = val;
    if (val > totalPage) {
        pdfPage.value = toPage = totalPage;
    }
    queueRenderPage(toPage);
}

// Check for pages rendering
function queueRenderPage(num) {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
}

// Show Prev Page
function showPrevPage () {
    if (pdfPage.value <= 1) {
        return;
    }
    pdfPage.value--;
    queueRenderPage(pdfPage.value);
}

// Show Next Page
function showNextPage () {
    if (pdfPage.value >= pdfDoc.numPages) {
        return;
    }
    pdfPage.value++;
    queueRenderPage(pdfPage.value);
}

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
}

.mainbody_bottom {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background-color: #fff;
}

.mainbody_bottom_canvas {
    flex: 1 0 auto;
    display: flex;
    justify-content: center;
    height: 621px;
}

.mainbody_bottom_canvas canvas {
    width: 436px;
    height: 621px;
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