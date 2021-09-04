import axios from 'axios'
import Vue from 'vue'
// 一些全局配置
axios.defaults.baseURL = 'http://123.207.32.32:9001'
// axios.defaults.baseURL = 'http://127.0.0.1:3000'
axios.defaults.timeout = 3000

let count = 0
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  count++
  Vue.showLoading()
  return config
}, function (error) {
  Vue.hiddenLoading()
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  count--
  if (count === 0) { Vue.hiddenLoading() }
  return response
}, function (error) {
  Vue.hiddenLoading()
  return Promise.reject(error)
})

// 封装自己的get/post方法
export default {
  get (path = '', data = {}) {
    return new Promise((resolve, reject) => {
      axios.get(path, {
        params: data
      }).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  post (path = '', data = {}) {
    return new Promise((resolve, reject) => {
      axios.post(path, data)
        .then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  all (list) {
    return new Promise((resolve, reject) => {
      axios.all(list).then(axios.spread(function (...result) {
        resolve(result)
      })).catch((error) => {
        reject(error)
      })
    })
  }
}
