import { playMode } from 'common/js/config';

const state = {
  musicList: {},

  singer: {}, // 歌手

  playing: false, //播放状态

  fullScreen: false, // 全屏播放 or mini

  playlist: [], // 播放顺序

  sequenceList: [], // 播放顺序 - 模式切换下的 playMode

  mode: playMode.sequence, // 播放模式

  currentIndex: -1, // 当前播放歌曲在对应列表中的索引


}

export default state