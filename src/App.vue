<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<script>
import MHeader from "components/m-header/m-header";
import Tab from "components/tab/tab";
import Player from "components/player/player";
export default {
  components: {
    MHeader,
    Tab,
    Player
  }
};
document.addEventListener("DOMContentLoaded", () => {
  let fontSize = window.innerWidth / 10;
  fontSize = fontSize > 50 ? 50 : fontSize;
  const html = document.querySelector("html");
  html.style.fontSize = fontSize + "px";
});
</script>
<style lang="scss">
@import "common/scss/index.scss";

#app {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  text-shadow: rgb(144, 144, 144) 0.01em 0.01em 1px;
}
</style>
