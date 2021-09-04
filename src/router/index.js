import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// import Recommend from '../views/Recommend.vue'
// import Search from '../views/Search.vue'
// import Rank from '../views/Rank.vue'
// import Singer from '../views/Singer.vue'

// 实现Vue组件按需加载
const Recommend = (resolve) => {
  import('../views/Recommend.vue').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('../views/Search.vue').then((module) => {
    resolve(module)
  })
}
const Rank = (resolve) => {
  import('../views/Rank.vue').then((module) => {
    resolve(module)
  })
}
const Singer = (resolve) => {
  import('../views/Singer.vue').then((module) => {
    resolve(module)
  })
}
const Detail = (resolve) => {
  import('../views/Detail.vue').then((module) => {
    resolve(module)
  })
}
const Profile = (resolve) => {
  import('../views/Profile.vue').then((module) => {
    resolve(module)
  })
}
const routes = [
  {
    path: '/', redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: 'detail',
        name: 'detailByName',
        component: Detail,
        props (route) {
          return {
            id: route.query.id,
            type: route.query.type
          }
        }
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: 'detail',
        component: Detail,
        props (route) {
          return {
            id: route.query.id,
            type: route.query.type
          }
        }
      }
    ]
  },
  {
    path: '/rank',
    component: Rank,
    children: [
      {
        path: 'detail',
        component: Detail,
        props (route) {
          return {
            id: route.query.id,
            type: route.query.type
          }
        }
      }
    ]
  },

  {
    path: '/search',
    component: Search,
    children: [
      {
        path: 'detail',
        component: Detail,
        props (route) {
          return {
            id: route.query.id,
            type: route.query.type,
            songsType: route.query.songsType,
            keywords: route.query.keywords
          }
        }
      }
    ]
  },

  { path: '/profile', component: Profile }
]

const router = new VueRouter({
  // mode: 'hash',
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
