import axios from "axios";
import { HOST } from "common/js/config";

export const getBanner = () => {
  const url = HOST + "/banner";
  return axios.get(url);
};

export const getRecommendList = () => {
  const url = HOST + "/personalized";
  return axios.get(url);
};

export const getRecommendMusic = () => {
  const url = HOST + "/personalized/newsong";
  return axios.get(url);
}

export const getRecommendListDetail = id => {
  const url = HOST + `/playlist/detail?id=${id}`;
  return axios.get(url);
};
