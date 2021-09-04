import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import './assets/css/base.scss'
import Loading from './plugin/loading/index'

// 解决移动端点击事件延迟问题
fastclick.attach(document.body)

// 解决图片懒加载,使用时只需把img标签的src属性改为v-lazy="./xx/xx/xx.png"
// import VueLazyload from 'vue-lazyload'引入这个loader
Vue.use(VueLazyload, {
  loading: require('./assets/images/loading.png') // 图片loading...时，显示这个占位图片
  // ...还有许多配置项，详情请去npm搜vue-lazyload https://www.npmjs.com/package/vue-lazyload-cosmo-zp
})
Vue.use(Loading, {
  title: '数据马上就来啦...'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
