import Vue from 'vue'
import Vuex from 'vuex'
import { getSongDetail, getLyric, getSongURL } from '../api/index'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isFullScreen: false, // normal播放界面显示状态
    isShowMiniPlayer: false, // mini播放界面显示状态
    isShowListPlayer: false, // list播放界面显示状态
    isPlaying: false, // 音乐播放状态
    playMode: 0, // 音乐播放模式，0=>列表循环  1=>单曲循环 2=>随机播放
    songsDetail: [], // 保存所有需要播放的歌曲的【详情信息】
    currentSongIndex: 0, // 保存当前正在播放的歌曲在列表中索引
    currentLyric: {}, // 保存当前正在播放的歌曲的歌词
    curTime: 0, // 保存点击进度条或滑动滑块时，歌曲的当前时间
    isScrollProgress: false, // 音乐进度条是否在滑动
    favoriteList: JSON.parse(localStorage.getItem('favoriteList')) || [], // 保存收藏的音乐
    historyList: JSON.parse(localStorage.getItem('historyList')) || [], // 保存历史播放音乐
    historySearch: JSON.parse(localStorage.getItem('historySearch')) || []
  },
  actions: {
    setFullScreen (context, value) {
      context.commit('changeFullScreen', value)
    },
    setMiniPlayer (context, value) {
      context.commit('changeMiniPlayer', value)
    },
    setListPlayer (context, value) {
      context.commit('changeListPlayer', value)
    },
    setIsPlaying (context, value) {
      context.commit('changeIsPlaying', value)
    },
    setPlayMode (context, value) {
      context.commit('changePlayMode', value)
    },
    setCurrentSongIndex (context, index) {
      context.commit('changeCurrentSongIndex', index)
    },
    async setSongsDetail (context, ids) {
      /*
        使用async和await是为了能让ajax请求完成后再调用commit存储数据
        否则，commit函数不会等待请求结束，就秒执行了，就出问题了
      */
      const data = await getSongDetail({ ids: ids.join(',') })
      const urls = await getSongURL({ id: ids.join(',') })
      // console.log(data)
      // console.log(urls)
      const list = []
      data.songs.forEach((item, index) => {
        const song = {}// 创建一个新对象用于封装数据
        song.id = item.id // 保存id
        song.name = item.name // 保存歌曲名
        // 一首歌可能有多个作者
        song.singers = item.ar.map((val) => {
          return val.name
        })
        song.picUrl = item.al.picUrl // 保存对应的图片名

        /*
          由于后端返回资源顺序有问题，返回的歌曲url地址，
          不是按照请求时id顺序，排列的，是随机的，所以需要先判断id是否一致
        */
        for (let i = 0; i < urls.data.length; i++) {
          const temp = urls.data[i]
          if (temp.id === song.id) {
            song.url = temp.url // 保存歌曲资源地址
            break
          }
        }
        // song.url = urls.data[index].url // 保存歌曲资源地址
        list.push(song) // 存入列表
      })
      context.commit('changeSongsDetail', list)
    },
    async setCurrentLyric (context, id) {
      const data = await getLyric({ id })
      // 伴奏音乐没有歌词，data.lrc为undefined
      if (data.lrc) {
        // console.log('嘻嘻' + data.lrc)
        context.dispatch('parseLyric', data.lrc.lyric).then((res) => {
          context.commit('changeCurrentLyric', res)
        }).catch((error) => {
          console.log(error, '解析歌词出错！！')
        })
      } else {
        context.commit('changeCurrentLyric', {
          lyrics: ['没有歌词哦!'],
          times: [0]
        })
      }
    },
    parseLyric (context, lrc) { // 解析歌词与时间
      const lyrics = lrc.split('\n')// 每行时间和歌词 [02:14.800]All I can feel
      const timeReg = /\[(\d*:\d*\.\d*)\]/g // 匹配时间的正则
      const lyricObj = { times: [], lyrics: [] }// 定义对象保存处理好的歌词
      lyrics.forEach((item, index, arr) => {
        if (!item) { return }// 【如果某行为空，直接跳过本次循环】

        // 1.处理歌词
        const lrc = item.split(']')[1].trim() // ']'右边就是歌词
        if (lrc.length === 0) return// 【如果歌词为空，直接跳过本次循环】

        // 2.处理时间
        let timeStr = item.match(timeReg)// 返回一个数组
        if (!timeStr) { return }// 【如果没匹配到时间，直接跳出本次循环】
        timeStr = timeStr[0]// '[02:14.800]'
        const res = timeStr.split(':')// 切割字符串为：res = [ '[02', '14.800]' ]
        const minStr = res[0].slice(1) // 分钟字符串'02'
        const secondStr = res[1].slice(0, res[1].length - 1) // 秒数字符串'14.800'
        const time = parseInt(minStr) * 60 + parseFloat(secondStr) // 合并时间

        lyricObj.lyrics.push(lrc)
        lyricObj.times.push(time)
      })
      // console.log(lyricObj)
      return lyricObj
    },
    setCurTime (context, value) {
      context.commit('changeCurTime', value)
    },
    setIsScrollProgress (context, value) {
      context.commit('changeIsScrollProgress', value)
    },
    setFavoriteList (context, value) {
      context.commit('changeFavoriteList', value)
    },
    setHistoryList (context, value) {
      context.commit('changeHistoryList', value)
    },
    setHistorySearch (context, value) {
      context.commit('changeHistorySearch', value)
    }
  },
  mutations: {
    changeFullScreen (state, value) {
      state.isFullScreen = value
    },
    changeMiniPlayer (state, value) {
      state.isShowMiniPlayer = value
    },
    changeListPlayer (state, value) {
      state.isShowListPlayer = value
    },
    changeIsPlaying (state, value) {
      state.isPlaying = value
    },
    changePlayMode (state, value) {
      state.playMode = value
    },
    changeSongsDetail (state, list) {
      state.songsDetail = list
    },
    changeCurrentSongIndex (state, index) {
      if (index < 0) { // 传入的索引小于0
        index = state.songsDetail.length - 1
      } else if (index > state.songsDetail.length - 1) { // 传入的索引大于列表长度-1
        index = 0
      }
      state.currentSongIndex = index
    },
    delSongDetail (state, index) {
      state.songsDetail.splice(index, 1)// 删除指定歌曲列表的信息
      if (index < state.currentSongIndex) {
        state.currentSongIndex--
      }
      if (state.songsDetail.length === 0) {
        state.isFullScreen = false
        state.isShowListPlayer = false
        state.isShowMiniPlayer = false
        state.currentSongIndex = 0// 把当前索引置为0
      }
    },
    delAllSongDetail (state) {
      state.songsDetail = [] // 删除歌曲列表的全部歌曲信息
      state.isFullScreen = false
      state.isShowListPlayer = false
      state.isShowMiniPlayer = false
      state.currentSongIndex = 0// 把当前索引置为0
    },
    changeCurrentLyric (state, lyric) {
      state.currentLyric = lyric
    },
    changeCurTime (state, value) {
      state.curTime = value
    },
    changeIsScrollProgress (state, value) {
      state.isScrollProgress = value
    },
    changeFavoriteList (state, value) {
      const index = state.favoriteList.findIndex((item) => {
        return item.id === value.id
      })
      if (index === -1) {
        // 没收藏，则添加收藏
        state.favoriteList.unshift(value)
      } else {
        //  已收藏，则取消收藏
        state.favoriteList.splice(index, 1)
      }
    },
    changeHistoryList (state, song) {
      // state.historyList = value
      const index = state.historyList.findIndex((item) => {
        return item.id === song.id
      })
      if (index === -1) {
        // 不存在则直接添加历史记录
        state.historyList.unshift(song)
      } else {
        // 存在，则先删除再添加
        state.historyList.splice(index, 1)
        state.historyList.unshift(song)
      }
      if (state.historyList.length > 30) {
        const delCount = state.historyList.length - 30
        state.historyList.splice(30, delCount)
      }
    },
    changeHistorySearch (state, item) {
      const index = state.historySearch.findIndex((el) => {
        if (el === item) {
          return true
        }
      })
      if (index === -1) {
        state.historySearch.unshift(item)
      } else {
        state.historySearch.splice(index, 1)
        state.historySearch.unshift(item)
      }
      if (state.historySearch.length > 10) {
        const delCount = state.historySearch.length - 10
        state.historySearch.splice(10, delCount)
      }
    },
    clearHistorySearch (state) {
      state.historySearch = []
    }
  },
  getters: {
    currentSongDetail (state) { // 保存当前正在播放的歌曲的信息
      const obj = {
        name: '',
        picUrl: '',
        singers: [],
        url: ''
      }
      if (state.songsDetail.length === 0) {
        return obj
      } else {
        return state.songsDetail[state.currentSongIndex]
      }
    }
  },
  modules: {
  }
})
