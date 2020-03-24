<template>
  <div class="recommend" ref="recommend">
    <Scroll class="recommend-content" ref="scroll" :data="playList">
      <div>
        <div class="decorate" v-show="banner.length" v-if="banner.length"></div>
        <div class="slider-wrapper" v-if="banner.length">
          <slider>
            <div v-for="item in banner" :key="item.id" @click.stop="selectBanner(item)">
              <!-- <div class="type-title">{{item.typeTitle}}</div> -->
              <img class="banner-img" @load="loadImage" :src="item.imageUrl" />
            </div>
          </slider>
        </div>
        <div class="recommend-list" ref="recommendList">
          <h1 class="title">推荐歌单呀～</h1>
          <ul>
            <li class="item" v-for="item in playList" :key="item.id">
              <div class="icon" @click="selectList(item)">
                <div class="gradients"></div>
                <img v-lazy="item.picUrl" class="gradients-img" />
              </div>
              <p class="play-count">
                <i class="iconfont iconicmusicnotepx"></i>
                {{Math.floor(item.playCount / 10000)}}w
              </p>
              <div class="text">
                <p class="name">{{item.name}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!playList.length">
        <loading></loading>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from "base/Scroll/Scroll";
import { getBanner, getRecommendList, getRecommendMusic } from "api/recommend";
import Slider from "base/slider/slider";
import Loading from "base/Loading/Loading";
import { ERR_OK } from "common/js/config";
import { createRecommendSong } from "common/js/song";

import { Log, logErr, trim } from "common/js/my-utils";

export default {
  data() {
    return {
      banner: [],
      playList: [], // 推荐歌单
      recommendMusic: [] //推荐歌曲
    };
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getBanner();

    setTimeout(() => {
      this._getRecommendList();
      this._getRecommendMusic();
    }, 1e3);
  },
  filters: {},
  methods: {
    selectBanner(item) {
      log("click");
    },
    _getBanner() {
      getBanner().then(result => {
        if (result.status === ERR_OK) {
          let list = result.data.banners;
          // this.banner = list.splice(4);
          this.banner = list;
        } else {
          logErr(result);
        }
      });
    },
    _getRecommendList() {
      getRecommendList().then(result => {
        if (result.status == ERR_OK) {
          this.playList = result.data.result;
        } else {
          logErr("_getRecommendList err");
        }
      });
    },
    _getRecommendMusic() {
      getRecommendMusic().then(result => {
        if (result.status == ERR_OK) {
          let list = result.data.result.map(item => {
            return createRecommendSong(item);
          });
          list.splice(9);
          this.recommendMusic = list;
        } else {
          logErr(result);
        }
      });
    },
    loadImage() {
      //  按照标志位只执行一次
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
@import "~common/scss/mixin";
.recommend {
  position: fixed;
  width: 100%;
  top: px2rem(88);
  /*fixed属性要加bottom:0*/
  bottom: 0;
  z-index: -100;
  .recommend-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .decorate {
      position: absolute;
      top: px2rem(-180);
      z-index: -10;
      width: 100%;
      height: px2rem(300);
      vertical-align: inherit;
      background: $color-theme;
    }
    .slider-wrapper {
      position: relative;
      width: 96%;
      margin: 0 auto;
      border-radius: px2rem(5);
      overflow: hidden;
      .banner-img[lazy="loading"] {
        height: px2rem(133);
      }
      .banner-img[lazy="loaded"] {
      }
      .type-title {
        // position: absolute;
        // bottom: 0;
        // padding: px2rem(5);
        // background: $color-theme;
        // font-size: $font-size-small-s;
        // border-radius: px2rem(5) 0 0 0;
        // color: #fff;
      }
    }
    .recommend-list {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      .title {
        height: px2rem(65);
        line-height: px2rem(65);
        padding-left: 1.5%;
        text-align: left;
        font-size: $font-size-medium;
        font-weight: bold;
        color: $color-text;
      }
      .item {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 33%;
        padding: 0 1%;
        .icon {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: px2rem(5);
          .gradients {
            position: absolute;
            top: 0;
            width: 100%;
            height: px2rem(35);
            border-radius: px2rem(3);
            background: linear-gradient(
              rgba(109, 109, 109, 0.4),
              rgba(255, 255, 255, 0)
            );
          }
          .gradients-img[lazy="loading"] {
            display: block;
            width: px2rem(116);
            height: px2rem(116);
            border-radius: px2rem(3);
          }
          .gradients-img[lazy="loaded"] {
            display: block;
            width: px2rem(116);
            height: px2rem(116);
            border-radius: px2rem(3);
          }
        }
        .play-count {
          position: absolute;
          top: px2rem(5);
          right: px2rem(8);
          font-size: $font-size-small-s;
          color: $color-text-l;
          i {
            margin-right: px2rem(-5);
          }
        }
        .text {
          height: px2rem(40);
          line-height: px2rem(16);
          text-align: left;
          overflow: hidden;
          margin-bottom: px2rem(10);
          font-size: $font-size-small;
          .name {
            @include ellipsis2(2, false);
          }
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>