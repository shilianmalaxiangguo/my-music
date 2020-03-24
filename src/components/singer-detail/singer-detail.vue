<template>
  <transition :appear="true" name="slide">
    <music-list ref="musicList" :title="title" :bg-image="bgStyle" :songs="listDetail"></music-list>
  </transition>
</template>

<script>
import MusicList from "components/music-list/music-list";
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "common/js/config";
import { createSong } from "common/js/song";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    MusicList
  },
  data() {
    return {
      listDetail: [],
      node: null
    };
  },
  computed: {
    headerTitleTouchDown() {
      let name = "";
      if (this.singer && this.singer.aliaName) {
        name = this.singer.name + `(${this.singer.aliaName})`;
      } else {
        name = this.singer.name;
      }
      return name;
    },
    bgStyle() {
      return this.singer.avatar;
    },
    title() {
      return this.headerTitleTouchDown;
    },
    ...mapGetters(["singer"])
  },

  created() {
    this._getDetail();
  },
  mounted() {},
  watch: {
    node(val) {
      this.listDetail = this._normalizeSongs(val);
    }
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
      }
      getSingerDetail(this.singer.id).then(result => {
        if (result.status === ERR_OK) {
          this.node = result.data.hotSongs;
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        ret.push(createSong(item));
      });
      return ret;
    }
  }
};
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(30%, 0, 0);
  opacity: 0;
}
</style>