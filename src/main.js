import { createApp } from 'vue';
import Icons from './plugins/Icons';
import App from './App.vue';
import 'amfe-flexible'; // 移动端适配

// 创建运用
const app = createApp(App);
// 挂载服务
app.use(Icons);
// 挂载运用
app.mount('#app');
