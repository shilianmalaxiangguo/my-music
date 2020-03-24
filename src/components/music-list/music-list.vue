<template>
  <transition :appear="true" name="slide">
    <div class="music-list">
      <!-- 头部header -->
      <div class="header" ref="header">
        <div class="back" @click="back">
          <i class="iconfont iconguanbi"></i>
        </div>
        <div class="text">
          <h1 class="title">{{headerTitle}}</h1>
        </div>
      </div>
      <!-- 歌曲部分 -->
      <scroll
        class="list"
        @scroll="scroll"
        :probe-type="probeType"
        :listen-scroll="listenScroll"
        :data="songs"
        ref="list"
      >
        <!-- 显示部分 -->
        <div class="music-list-wrapper">
          <!-- 歌手图片部分 -->
          <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="filter" ref="filter"></div>
            <div class="text">
              <h2 class="list-title">{{title}}</h2>
            </div>
          </div>
          <div class="bg-layer" ref="layer"></div>

          <!-- 歌单部分 -->
          <div class="song-list-wrapper">
            <!-- 通用部分 -->
            <div class="sequence-play">
              <i class="iconfont iconplay-circle-line"></i>
              <span class="text">播放全部</span>
              <span class="count">(共{{songs.length}}首)</span>
            </div>
            <!-- 动态歌曲列表 -->
            <song-list @select="selectItem" :songs="songs"></song-list>
          </div>
        </div>
        <!-- loading部分 -->
        <div v-show="!songs.length" class="loading-content">
          <loading></loading>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import Scroll from "base/Scroll/Scroll";
import SongList from "base/song-list/song-list";
import Loading from "base/Loading/Loading";
import { getRecommendListDetail } from "api/recommend";
import { ERR_OK } from "common/js/config";
import { createRecommendListSong } from "common/js/song";
import { prefixStyle } from "common/js/dom";
import { mapGetters, mapActions } from "vuex";
import { logErr } from "common/js/my-utils.js";
const RESERVED_HEIGHT = 44;
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");

export default {
  mixins: [],
  components: {
    Scroll,
    Loading,
    SongList
  },
  props: {
    title: {
      type: String,
      default: () => ""
    },
    bgImage: {
      type: String,
      default: () => ""
    },
    songs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scrollY: 0,
      headerTitle: "歌手"
    };
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    },
    ...mapGetters(["singer"])
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY);
      let scale = 1;
      let zIndex = 0;
      let blur = 0;
      const percent = Math.abs(newY / this.imageHeight);

      if (newY > 0) {
        scale = 1 + 0.3 * percent;
        zIndex = 10;
      } else {
        blur = Math.min(20, percent * 20);
      }
      this.$refs.layer.style[transform] = `translate3d(-20%,${translateY}px,0)`;
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;

      if (newY < this.minTranslateY + RESERVED_HEIGHT - 20) {
        this.headerTitle = this.title;
      } else {
        this.headerTitle = "歌手";
      }
      // 小于0 就是下滑，因为是负的
      if (newY < 0) {
        this.$refs.header.style.background = `rgba(212, 68, 57, ${percent})`;
      } else {
        this.$refs.header.style.background = `rgba(212, 68, 57, 0)`;
      }
      if (newY < this.minTransalteY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
      } else {
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
      }
      // this.$refs.bgImage.style[transform] = `scale(${scale})`;
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  },
  created() {
    // this._getRecommendListDetail(this.musicList.id);
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    // 如果是组件的话，要先用$refs选取组件，再用$el选取其dom
    // this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  methods: {
    selectItem(item, index) {
      // console.log("click music-list");
      // console.log("item", item);
      // console.log("index", index);
      this.selectPlay({
        list: this.songs,
        index: index
      });
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.status === ERR_OK) {
          this.node = res.data.hotSongs;
        }
      });
    },
    // async _getRecommendListDetail(id) {
    //   if (!id) {
    //     this.$router.push("/recommend");
    //     return;
    //   }
    //   getRecommendListDetail(id).then(result => {
    //     if (result.status === ERR_OK) {
    //       this.listDetail = result.data.result.tracks.map(item => {
    //         return createRecommendListSong(item);
    //       });
    //     } else {
    //       logErr("getRecommendListDetail 获取失败！");
    //     }
    //   });
    // },
    ...mapActions(["selectPlay", "sequencePlay"])
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
@import "~common/scss/mixin";
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(30%, 0, 0);
  opacity: 0;
}
.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    height: px2rem(44);
    color: #fff;
    z-index: 100;
    .back {
      position: absolute;
      top: px2rem(-3);
      left: px2rem(4);
      .iconguanbi {
        padding: px2rem(5) px2rem(10);
        font-size: 20px;
      }
    }
    .text {
      position: absolute;
      left: px2rem(38);
      line-height: px2rem(44);
      font-size: $font-size-medium-x;
      @include no-wrap();
    }
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    .music-list-wrapper {
      .bg-image {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 75%;
        transform-origin: top;
        background-size: cover;
        background-position: 0 30%;
        .filter {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
          opacity: 0.2;
        }
        .text {
          position: absolute;
          width: 80%;
          height: px2rem(40);
          bottom: px2rem(50);
          left: px2rem(15);
          color: #fff;
          .play-count {
            position: absolute;
            bottom: px2rem(16);
            font-size: $font-size-small;
          }
          .list-title {
            position: absolute;
            bottom: 0;
            font-size: $font-size-medium-x;
            line-height: px2rem(18);
            font-weight: bold;
            letter-spacing: pxrem(1);
            text-shadow: 0 4px 8px 0 rgba(252, 88, 50, 0.5);
          }
        }
      }
      .bg-layer {
        position: relative;
        height: 100%;
        background: $color-background;
      }
      .song-list-wrapper {
        padding: px2rem(41) 0 px2rem(20) 0;
        border-radius: px2rem(10);
        position: relative;
        top: px2rem(-20);
        background: $color-background;
        z-index: 200;
        .sequence-play {
          position: absolute;
          top: 0;
          display: flex;
          align-items: center;
          width: 100%;
          height: px2rem(40);
          padding-left: px2rem(16);
          border-bottom: 1px solid rgb(228, 228, 228);
          .iconfont {
            font-size: 22px;
            color: $color-text;
            padding-right: px2rem(14);
          }
          .text {
            font-size: $font-size-medium-x;
          }
          .count {
            font-size: $font-size-medium;
            color: $color-text-g;
          }
        }
      }
    }
  }
}
</style>