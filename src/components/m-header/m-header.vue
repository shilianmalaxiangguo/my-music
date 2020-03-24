<template>
  <div class="m-header">
    <h1 class="text">PIKACHU</h1>
    <router-link to="/user" class="mine" tag="div">
      <i class="iconfont iconhtmal5icon35"></i>
    </router-link>
    <router-link to="/search" class="search" tag="div">
      <i class="iconfont iconsearch"></i>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scope>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.m-header {
  position: relative;
  height: px2rem(44);
  width: 100%;
  text-align: center;
  background: $color-theme;
  .text {
    line-height: px2rem(44);
    font-weight: bold;
    font-size: px2rem(14);
    color: $color-text-l;
    letter-spacing: 3px;
  }
  .mine {
    position: absolute;
    top: -1.5px;
    left: 0;
    .iconfont {
      display: block;
      padding: 11px;
      font-size: 22px;
      color: $color-theme-l;
    }
  }
  .search {
    position: absolute;
    top: 0;
    right: 2px;
    .iconfont {
      display: block;
      padding: 12px;
      font-size: 18px;
      color: $color-theme-l;
    }
  }
}
</style>