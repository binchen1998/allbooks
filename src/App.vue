<template>
  <div id="content">
    <SideBar id="bar" />
    <MainBody id="main" />
  </div>
  <img id="background" src="./assets/bg.jpg">
  <WidgetContainerModal />
</template>

<script>
import SideBar from './components/SideBar/SideBar.vue';
import MainBody from './components/MainBody/MainBody.vue';
import { container } from "jenesius-vue-modal";
export default {
  components: { 
    SideBar,
    MainBody,
    WidgetContainerModal: container 
  },
  name: "App"
}
</script>

<style>
body {
  padding: auto;
  margin: auto;
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
}

#main {
  flex: 1 0 auto;
  padding: 15px;
  background-color: #efefef;
}
</style>
