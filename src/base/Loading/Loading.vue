<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24" alt />
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "正在搜索亚～"
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
.loading {
  width: 100%;
  height: 40px;
  text-align: center;
  img {
    margin-top: 10px;
  }
  .desc {
    line-height: 20px;
    font-size: $font-size-small;
    color: $color-text-g;
  }
}
</style>