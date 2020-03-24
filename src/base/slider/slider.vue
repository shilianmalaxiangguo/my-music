<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item,index) in dots"
        :key="index"
        :class="{'active' : currentPageIndex === index}"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { addClass } from "common/js/dom";
export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 5000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();
      this._onScrollEnd();
    }, 20);

    // 自适应视窗重新渲染轮播
    window.addEventListener("resize", () => {
      if (!this.slider) return;
      //默认是不传
      this._setSliderWidth(true);
    });
  },
  methods: {
    _setSliderWidth() {
      this.children = this.$refs.sliderGroup.children;
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i];
        addClass(child, "slider-item");
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }

      if (this.loop) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 500
        },
        snapSpeed: 500,
        bounce: false,
        stopPropagation: true,
        click: true
      });
      this.slider.on("scrollEnd", this._onScrollEnd);
    },
    _onScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX;
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) this._play();
    },
    _play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    },
    _initDots() {
      this.dots = new Array(this.children.length);
    }
  },
  destroyed() {
    clearTimeout(this.timer);
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
@import "~common/scss/mixin";
.slider {
  min-height: 1px;
  position: relative;
  &-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: px2rem(12);
    text-align: center;
    .dot {
      display: inline-block;
      margin: 0 px2rem(4);
      width: px2rem(8);
      height: px2rem(8);
      border-radius: 50%;
      background: $color-text-l;
      opacity: 0.9;
      &.active {
        // width: px2rem(10);
        border-radius: px2rem(5);
        background: $color-highlight-background;
      }
    }
  }
}
</style>