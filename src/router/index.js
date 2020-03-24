import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const Recommend = resolve => {
  import("components/recommend/recommend").then((module) => {
    resolve(module);
  });
};
const Rank = resolve => {
  import("components/rank/rank").then((module) => {
    resolve(module);
  });
};
const Singer = resolve => {
  import("components/singer/singer").then((module) => {
    resolve(module);
  });
};
const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
};
const MusicList = (resolve) => {
  import('components/music-list/music-list').then((module) => {
    resolve(module)
  })
};


const routes = [
  {
    path: "/",
    redirect: "/recommend"
  },
  {
    path: "/recommend",
    component: Recommend
  },
  {
    path: "/rank",
    component: Rank
  },
  {
    path: "/singer",
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
