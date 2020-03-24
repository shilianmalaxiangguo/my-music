<template>
  <div class="singer" ref="singer">
    <list-view :data="this.singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import Singer from "common/js/singer";
import ListView from "base/ListView/ListView";
import { getSingers } from "api/singer";
import pinyin from "pinyin";
import { Log } from "common/js/my-utils";

import { mapMutations } from "vuex";

const HOT_NAME = "热门";
const HOT_SINGERS = 10;

export default {
  components: {
    ListView
  },
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingers();
  },
  methods: {
    selectSinger(singer) {
      // console.log("click");
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    _getSingers() {
      getSingers().then(result => {
        let s = result.data.artists;
        s.map(item => {
          let py = pinyin(item.name[0], {
            style: pinyin.STYLE_FIRST_LETTER
          });
          // 接口里面类似Findex,因为py值有大有小，要给个说法
          // py[0] 是个数组,py[0][0]就是数组0的值
          item.initial = py[0][0].toUpperCase();
        });
        this.singers = this._normalizeSinger(s);
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        // 因为本来就是hot接口，所以最前面的就是最热门的
        if (index < HOT_SINGERS) {
          map.hot.items.push(
            new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url,
              aliaName: item.alias.join(" / ")
            })
          );
        }
        // 取首字母做聚合操作
        const key = item.initial;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias[0]
          })
        );
      });
      let hot = [];
      let ret = [];
      for (const key in map) {
        let val = map[key];
        if (val.title.match(/[A-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      // for 循环不会按序，所以要排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      // 把热门 + 排序后的A-Z组成一个新数组
      return hot.concat(ret);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/mixin";
.singer {
  position: fixed;
  top: px2rem(88);
  bottom: 0;
  width: 100%;
}
</style>
