export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url, aliaName }) {
    this.id = id;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.aliaName = aliaName;
    this.image = image
  }
}
export const singerName = (arr) => {
  let name = [];

  name = arr.map((item) => {
    return item.name
  })
  return name.join('/')
}
export const createRecommendSong = (music) => {

  return new Song({
    id: music.id,
    singer: singerName(music.song.artists),
    name: music.name,
    album: music.song.album.name,
    image: music.song.album.priUrl
  })
}

export const createRecommendListSong = (music) => {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    album: music.album.name,
    image: music.album.picUrl
  })
}

export const createSong = (music) => {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl
  })
}