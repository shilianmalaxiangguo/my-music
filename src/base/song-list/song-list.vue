<template>
  <div class="song-list">
    <ul>
      <li v-for="(song,index) in songs" :key="song.id" @click="seletItem(song,index)" class="item">
        <p class="count">{{index + 1 }}</p>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {},
  methods: {
    seletItem(item, index) {
      this.$emit("select", item, index);
    },
    getDesc(song) {
      return song.aliaName
        ? `${song.singer} - ${song.aliaName}`
        : `${song.singer}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
@import "~common/scss/mixin";
.song-list {
  .item {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: px2rem(60);
    border-bottom: 1px solid rgb(228, 228, 228);
    .count {
      flex: 0 0 px2rem(50);
      width: px2rem(50);
      text-align: center;
      color: $color-text-g;
      font-size: $font-size-medium-x;
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-top: px2rem(4);
        width: 80%;
        @include no-wrap();
        color: $color-text;
        font-size: $font-size-medium-x;
      }
      .desc {
        @include no-wrap();
        width: 80%;
        font-size: 12px;
        color: $color-text-g;
      }
    }
  }
}
</style>