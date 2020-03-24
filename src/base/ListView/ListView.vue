<template>
  <scroll
    class="list-view"
    ref="listView"
    :probeType="probeType"
    :listenScroll="listenScroll"
    @scroll="scroll"
  >
    <!-- 左侧歌手列表 -->
    <ul>
      <li v-for="group in data" class="list-group" :key="group.id" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <!-- 大标签下的小组items -->
        <ul>
          <li
            @click="selectItem(item)"
            v-for="item in group.items"
            class="list-group-item"
            :key="item.id"
          >
            <img v-lazy="item.avatar" class="avatar" alt />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧类T9索引 -->
    <!--vue:api 阻止冒泡+阻止原生滚动 -->
    <div
      class="list-shortcut"
      @touchstart="onShortcutStart"
      @touchmove.stop.prevent="onShortcutMove"
    >
      <ul>
        <li
          v-for="(item,index) in shortcutList"
          class="item"
          :data-index="index"
          :key="item.id"
          :class="{'current' : currentIndex === index}"
        >{{item}}</li>
      </ul>
    </div>
    <!-- 顶部title滚动 -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <!-- Loading组件 -->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from "base/Scroll/Scroll";
import Loading from "base/Loading/Loading";
import { getData } from "common/js/dom";
import { Log } from "common/js/my-utils";

const ANCHOR_HEIGHT = 20; // 每个item，字体高度+padding
const TITLE_HEIGHT = 20; // list-group-title 20

export default {
  components: {
    Scroll,
    Loading
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      // 如果在已经在上限之上，就不显示，
      // 不然有两个相同的title
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      // 对这个listHeight做一个引用，
      // 因为会在很多地方都会用到这个listHeight
      const listHeight = this.listHeight;
      // 向上移动到上边界，y值是大于0的
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 正常区间里面
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height_min = listHeight[i];
        let height_max = listHeight[i + 1];
        // 因为在区间里面 y值是负的
        if (-newY >= height_min && -newY < height_max) {
          this.currentIndex = i;
          // 因为newY是负的，diff是上限和newY的delta值
          this.diff = height_max + newY;
          return;
        }
      }
      // 如果是最后一个，因为边界length -1 才是个数，
      // 再-1是因为，一个边界的上边界，也是另一个边界的下边界，
      // 所以多算了一个思密达
      this.currentIndex = listHeight.length - 2;
    },
    diff(newDiff) {
      let fixedTop =
        newDiff > 0 && newDiff < TITLE_HEIGHT ? newDiff - TITLE_HEIGHT : 0;
      // 如果相等 刚好等于下一个title时的判断
      // 判断向上移动过程中还没达到标题高度时，
      // 避免一直出发下面改变下面样式的修改
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  },
  created() {
    // Q：为咩在create里面定义变量，而不是data
    // 因为touch要在两个函数之间共享
    // 但不监听它的变化，
    // 不在data里面定义，这样会减少资源消耗
    // 只让touch做一个桥接两个函数公用的没有感情的工具人而已
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    refresh() {
      this.$refs.listView.refresh();
    },
    /**
     * 实时获取scrollY的位置，
     * 所以用scroll的监听滚动事件
     */
    scroll(pos) {
      this.scrollY = pos.y;
    },
    /**
     * 左侧栏的点击跳转事件
     */
    onShortcutStart(e) {
      // 找到侧边的是第几个
      let anchorIndex = getData(e.target, "index");
      let firtsTouch = e.touches[0]; // 因为是单点触控
      this.touch.y1 = firtsTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    /**
     * 左侧栏滑动，数据也跟着动的事件
     * 通过开始点击 记录一个y值
     * 移动之后 记录一个y值
     * 然后通过判断 delta / 间距 判断移动几个
     */
    onShortcutMove(e) {
      let firtsTouch = e.touches[0];
      this.touch.y2 = firtsTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0; // as math.floor
      // 跳转位置
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    _scrollTo(index) {
      // 如果index不存在
      // 判断点击左侧栏item跳转
      if (!index && index == 0) {
        return;
      }
      //
      // Log(this.listHeight);
      // 处理index的边界情况
      // 因为touchmove事件一直在执行，可能会超过
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight - 2;
      }
      // 得到每个listHeight上限的位置
      this.scrollY = -this.listHeight[index];
      // 必须要传一个数字参数 better-scroll定义
      // 这个数字参数 是延迟移动时间，因为我们是像指哪打哪，所以不需要动画，所以0
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      this.listHeight = [];
      const LIST = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < LIST.length; i++) {
        let item = LIST[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
@import "~common/scss/mixin";
$title-bg: rgba(
  $color: #000000,
  $alpha: 0.1
);
.list-view {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .list-group {
    .list-group-title {
      height: px2rem(20);
      line-height: px2rem(20);
      padding-left: px2rem(12);
      margin-bottom: px2rem(10);
      font-size: $font-size-small;
      color: #fff;
      background: $title-bg;
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: px2rem(5) 0;
      margin: 0 px2rem(5);
      .avatar {
        width: px2rem(50);
        height: px2rem(50);
        border-radius: px2rem(3);
      }
      .name {
        margin-left: px2rem(20);
        color: $color-text;
        font-size: $font-size-medium;
      }
    }
    .list-group-item + .list-group-item {
      border-bottom: 1px solid rgb(222, 222, 222);
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: px2rem(3);
    top: 50%;
    transform: translateY(-50%);
    width: px2rem(20);
    padding: px2rem(200) 0;
    border-radius: px2rem(3);
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    .item {
      padding: px2rem(5);
      line-height: 1;
      color: $color-text-g;
      font-size: $font-size-small;
      font-weight: bold;
      &.current {
        color: $color-theme;
      }
    }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: px2rem(20);
      line-height: px2rem(20);
      padding-left: px2rem(12);
      font-size: $font-size-small;
      color: $color-text-l;
      background: rgba($color: #cc6a6a, $alpha: 0.5);
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>