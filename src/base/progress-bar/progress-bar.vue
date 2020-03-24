<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "common/js/dom";

const $progressBtnWidth = 16;
const $transform = prefixStyle("transform");

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      newPercent: 0
    };
  },
  computed: {
    // $barWidth() {
    //   return this.$refs.progressBar.clientWidth - $progressBtnWidth;
    // },
    // $percent() {
    //   return this.$refs.progress.clientWidth / this.$barWidth;
    // }
  },
  watch: {
    percent(newPercent) {
      // [0,1]
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - $progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  },
  created() {
    // 只当个储存东西的工具人 ，所以放在created，不需要响应
    this.touch = {};
  },
  methods: {
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      // e.pageX 点击的坐标距离左边0的距离
      // rect.left bar距离左边的距离
      const offsetWidth = e.pageX - rect.left;
      this._offset(offsetWidth);
      // 进度条宽 = 进度条的视宽 - 小球宽
      const barWidth = this.$refs.progressBar.clientWidth - $progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChangeEnd", percent);
    },
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      this._triggerPercent();
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        Math.min(
          this.$refs.progressBar.clientWidth - $progressBtnWidth,
          Math.max(0, this.touch.left + deltaX)
        )
      );
      this._offset(offsetWidth);
    },
    progressTouchEnd(e) {
      this.touch.initiated = false;
      const barWidth = this.$refs.progressBar.clientWidth - $progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChangeEnd", percent);
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - $progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChange", percent);
    },
    _offset(offsetWidth) {
      // 已经走过的路程
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[
        $transform
      ] = `translate3d(${offsetWidth}px, 0 ,0)`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
@import "~common/scss/mixin";
.progress-bar {
  height: px2rem(30);
  .bar-inner {
    position: relative;
    top: px2rem(13);
    height: px2rem(4);
    background: rgba($color: #000000, $alpha: 0.3);
  }
  .progress {
    position: absolute;
    height: 100%;
    background: $color-theme;
  }
  .progress-btn-wrapper {
    position: absolute;
    left: px2rem(-8);
    top: px2rem(-13);
    width: px2rem(30);
    height: px2rem(30);
    .progress-btn {
      position: relative;
      top: px2rem(7);
      left: px2rem(7);
      box-sizing: border-box;
      width: px2rem(16);
      height: px2rem(16);
      border: px2rem(5) solid $color-theme-l;
      border-radius: 50%;
      background: $color-theme;
    }
  }
}
</style>