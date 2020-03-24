<template>
  <div class="player" v-show="playlist.length > 0">
    <!-- 正常播放页面 -->
    <transition name="normal">
      <div class="normal-player" ref="normalPlayer" v-show="fullScreen" @touchstar.once="firstPlay">
        <!-- 背景层 -->
        <div class="background">
          <div class="filter" ref="filter"></div>
          <img v-lazy="currentSong.image" alt />
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back" @click="back">
            <i class="iconfont iconguanbi"></i>
          </div>
          <h1 class="title">正在播放</h1>
        </div>
        <!-- 中间 -->
        <div class="middle">
          <transition name="middle-l">
            <div class="cd">
              <img :src="currentSong.image" alt />
              <div class="middle-container">
                <div class="middle-text">
                  <h1 class="middle-text-title" v-html="currentSong.name"></h1>
                  <h2 class="middle-text-subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="like">
                  <i class="iconfont"></i>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :percent="percent"
                @percentChangeEnd="percentChangeEnd"
                @percentChange="percentChange"
              ></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(duration)}}</span>
          </div>
          <!-- 控制bar -->
          <div class="operators">
            <div class="icon i-left">
              <i class="iconfont mode" :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i class="iconfont iconprevious" @click="prev"></i>
            </div>
            <div class="icon i-center" ref="playBtn">
              <i class="iconfont" :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont iconnext" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont iconic_playlist_play"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click.stop="open">
        <!-- 左边专辑图 -->
        <div class="icon">
          <img :class="cdCls" :src="currentSong.image" alt />
        </div>
        <!-- 左侧歌手信息 -->
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <div class="desc" v-html="currentSong.singer"></div>
        </div>
        <!-- 右侧控制bar -->
        <div class="iconfont control" @click.stop="togglePlaying">
          <progress-circle :radius="radius" :percent="percent">
            <i class="iconfont" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="iconfont iconic_playlist_play"></i>
        </div>
      </div>
    </transition>
    <audio
      id="music-audio"
      ref="audio"
      @ended="end"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      autoplay
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { getSong, getLyric } from "api/song";
import { playMode } from "common/js/config";
import { dominantColor } from "common/js/image-color";
import { shuffle } from "common/js/utils";
import ProgressBar from "base/progress-bar/progress-bar";
import ProgressCircle from "base/progress-circle/progress-circle";
export default {
  components: {
    ProgressBar,
    ProgressCircle
  },
  data() {
    return {
      songReady: false,
      currentTime: 0,
      duration: 0,
      percent: 0,
      radius: 32,
      url: ""
    };
  },
  computed: {
    iconMode() {
      if (this.mode === playMode.sequence) {
        return "iconloop";
      } else if (this.mode === playMode.loop) {
        return "iconloop-once";
      } else {
        return "iconsuijibofang";
      }
    },
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    miniIcon() {
      return this.playing ? "iconicon--" : "iconbofang1";
    },
    playIcon() {
      return this.playing ? "iconpause" : "iconplay";
    },
    ...mapGetters([
      "playlist",
      "fullScreen",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList"
    ])
  },
  watch: {
    async currentSong(newVal, oldVal) {
      if (!newVal.id) {
        return;
      }
      if (newVal.id === oldVal.id) {
        return;
      }
      this.$refs.audio.pause();
      this.$refs.audio.currentTime = 0;
      this._getSong(newVal.id);
      const img = newVal.image;
      let dominant = await dominantColor(img);
      this.filterColor = dominant[0].color;
      this.$refs.filter.style.background = `${this.filterColor}`;
      this.$refs.filter.style.transition = `ease-out .3s`;
      this.$refs.normalPlayer.style.background = `${this.filterColor}`;
      this.$refs.normalPlayer.style.transition = `ease-out .3s`;

      // console.log("v-dominant", dominant[0].color);
    },
    url(newUrl) {
      this._getLyric(this.currentSong.id);
      this.$refs.audio.src = newUrl;
      let stop = setInterval(() => {
        this.duration = this.$refs.audio.duration;
        if (this.duration) {
          clearInterval(stop);
        }
      }, 150);
      this.setPlayingState(true);
    },
    currentTime() {
      this.percent = this.currentTime / this.duration;
    }
  },
  created() {
    this.move = false;
    this.filterColor = "";
  },
  mounted() {},
  methods: {
    firstPlay() {
      this.$refs.audio.play();
    },

    percentChange(percent) {
      this.move = true;
      const currentTime = this.duration * percent;
      this.currentTime = currentTime;
    },
    percentChangeEnd(percent) {
      this.move = false;
      const currentTime = this.duration * percent;
      this.$refs.audio.currentTime = currentTime;
      if (!this.playing) {
        this.$refs.audio.play();
        this.setPlayingState(true);
      }
    },
    updateTime(e) {
      if (this.move) {
        return;
      }
      this.currentTime = e.target.currentTime;
    },
    formatTime(interval) {
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      // es7
      const second = (interval % 60).toString().padStart(2, "0");

      return `${minute}:${second}`;
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },
    error() {
      this.songReady = true;
    },
    ready() {
      this.songReady = true;
    },
    next() {
      if (!this.songReady) return;
      if (this.playlist.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    prev() {
      if (!this.songReady) return;
      this.songReady = false;
      let index = this.currentIndex - 1;
      //  如果是第一首，就变成歌单的最后一首，就是length -1
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    back() {
      this.setFullScreen(false);
      this.currentShow = "cd";
    },
    open() {
      this.setFullScreen(true);
    },
    togglePlaying() {
      const audio = this.$refs.audio;
      this.setPlayingState(!this.playing);
      this.playing ? audio.play() : audio.pause();
      this.$refs.filter.style.background = `${this.filterColor}`;

      const filter = this.$refs.filter;
      this.playing
        ? (filter.style.background = `${this.filterColor}`)
        : (filter.style.background = `none`);
    },
    changeMode() {
      const mode = (this.mode + 1) % 3; // 循环这三个状态 始终是1，2，3
      this.setPlayMode(mode);
      let list = null;
      if (mode == playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this._resetCurrentIndex(list);
      this.setPlayList(list);
    },
    _resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    _getSong(id) {
      getSong(id).then(res => {
        this.url = res.data.data[0].url;
      });
    },
    _getLyric(id) {
      if (this.currentLyric) {
        this.currentLyric = null;
      }
      getLyric(id).then(result => {
        // console.log(result.data.lrc.lyric);
      });
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST"
    }),
    ...mapActions([])
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
@import "~common/scss/mixin";

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: -50%;
      width: 100vh;
      height: 100vh;
      z-index: -1;
      opacity: 0.95;
      filter: blur(30px) brightness(1.2);

      img [lazy="loading"] {
        width: 100% !important;
        height: 100% !important;
      }

      img [lazy="loaded"] {
        width: 100% !important;
        height: 100% !important;
      }

      .filter {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.6;
        filter: brightness(1.1) !important;
      }
    }

    .top {
      position: relative;
      margin-bottom: px2rem(25);

      .back {
        position: absolute;
        top: px2rem(3);
        left: px2rem(6);
        z-index: 50;

        .iconguanbi {
          display: block;
          padding: px2rem(5) px2rem(9);
          font-size: px2rem(23);
          color: $color-theme-l;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        padding-top: px2rem(10);
        line-height: px2rem(20);
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        font-weight: bold;
        color: $color-text-l;
      }

      .subtitle {
        width: 70%;
        margin: 0 auto;
        line-height: 20px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-small-x;
        color: $color-text-l;
      }
    }

    .middle {
      .cd {
        height: auto;
        text-align: center;

        img {
          border-radius: 5%;
          width: 80% !important;
          height: 100% !important;
        }

        .middle-container {
          display: flex;
          height: px2rem(70);
          padding: px2rem(10) px2rem(35);
          color: $color-text-l;

          .middle-text {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-around;
            flex: 0 0 80%;
            text-align: left;

            &-title {
              font-size: $font-size-large-x;
              font-weight: bold;
            }

            &-subtitle {
              font-size: $font-size-medium-x;
            }
          }

          .like {
            display: flex;
            flex: 0 0 20%;
            align-items: center;
            justify-content: flex-end;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: px2rem(50);
      width: 100%;

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        // flex: 0 0 80%;
        margin: 0 auto;
        padding: px2rem(10) 0;

        .time {
          color: $color-text-l;
          font-size: $font-size-small;
          flex: 0 0 px2rem(30);
          line-height: px2rem(30);
          width: px2rem(30);

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
            // color: $color-text-gg;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        // align-items: center;
        .icon {
          flex: 1;
          align-items: center;
          color: $color-theme-l;

          &.disable {
            color: $color-theme;
          }

          i {
            font-size: px2rem(30);
          }

          .mode {
            font-size: px2rem(25);
          }

          &.i-left {
            text-align: right;
          }

          &.i-center {
            padding: 0 px2rem(20);
            text-align: center;

            i {
              font-size: px2rem(40);
            }
          }

          &.i-right {
            text-align: left;
          }

          .icon-like {
            color: $color-sub-theme;
          }
        }
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: px2rem(60);
    background: rgba($color: #ffffff, $alpha: 0.85);

    .icon {
      flex: 0 0 px2rem(40);
      width: px2rem(40);
      padding: 0 px2rem(10) 0 px2rem(20);

      img {
        width: px2rem(40);
        height: px2rem(40);
        border-radius: 50%;

        &.play {
          animation: rotate 20s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      overflow: hidden;

      .name {
        margin-bottom: px2rem(2);
        line-height: px2rem(14);
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        @include no-wrap();
        font-size: $font-size-small;
        color: $color-text;
      }
    }

    .control {
      flex: 0 0 px2rem(30);
      width: px2rem(30);
      padding: 0 px2rem(10);

      .iconicon--,
      .iconbofang1,
      .icon-playlist,
      .iconfont {
        font-size: px2rem(30);
        color: $color-theme-d;
      }

      .iconfont {
        position: relative;
        left: px2rem(-5);
        top: px2rem(-3);
      }

      .iconbofang1 {
        color: $color-theme-d;
        font-size: px2rem(12);
        position: absolute;
        left: px2rem(11.5);
        top: px2rem(10);
      }

      .iconicon-- {
        color: $color-theme-d;
        font-size: px2rem(14);
        position: absolute;
        left: px2rem(9);
        top: px2rem(9);
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .normal-enter-active {
    // transform: translateY(0.5%);
    // transition: all 0.3s ease;
  }

  .normal-leave-active {
    transition: ease-out 0.5s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }

  .normal-enter, .normal-leave-to
      /* .slide-fade-leave-active for below version 2.1.8 */
 {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>
