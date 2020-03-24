import axios from 'axios'
import { HOST } from 'common/js/config'

export const getSong = (id) => {
  const url = HOST + `/song/url?id=${id}`

  return axios.get(url)
}

export const getLyric = (id) => {
  const url = HOST + `/lyric?id=${id}`

  return axios.get(url)
}