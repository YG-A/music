<template>
  <div class="player">
    <NormalPlayer :totalTime="totalTime" :currentTime="currentTime"></NormalPlayer>
    <MiniPlayer></MiniPlayer>
    <ListPlayer></ListPlayer>
    <div class="playMask" v-show="$store.state.isShowListPlayer"></div>
    <audio :src="currentSongDetail.url" ref="audio" @timeupdate="timeupdate" @ended="playEnd"></audio>
  </div>
</template>
<script>
import NormalPlayer from '../components/Player/NormalPlayer.vue'
import MiniPlayer from '../components/Player/MiniPlayer.vue'
import ListPlayer from '../components/Player/ListPlayer.vue'
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  name: 'Player',
  components: {
    NormalPlayer, MiniPlayer, ListPlayer
  },
  data () {
    return { // 秒为单位
      totalTime: 0,
      currentTime: 0
    }
  },
  methods: {
    ...mapActions(['setIsPlaying', 'setCurrentSongIndex', 'setHistoryList']),
    timeupdate (event) {
      // console.log(event.target.currentTime)// 秒为单位
      if (this.isScrollProgress) {
        // console.log('在滑动，你别改当前时间，我自己改，求你了')
        return
      }
      this.currentTime = event.target.currentTime// 实时更新data中的currentTime
    },
    playEnd () { // 当前歌曲播放结束时触发
      // console.log('end')
      const listLength = this.songsDetail.length
      if (listLength <= 1) {
        // 说明播放列表中只有一首歌，跟单曲循环一样
        this.$refs.audio.play()
      } else {
        if (this.isPlaying) { // 当前播放状态为true,不能是人为拖动到了结束
          if (this.playMode === 0) {
            // 列表顺序循环
            // console.log('顺序')
            this.setCurrentSongIndex(this.currentSongIndex + 1)
          } else if (this.playMode === 1) {
            // console.log('单曲')
            this.$refs.audio.play()
          } else if (this.playMode === 2) {
            // console.log('随机')
            let randomIndex = this.currentSongIndex
            while (randomIndex === this.currentSongIndex) {
              randomIndex = Math.round(Math.random() * (listLength - 1))
              console.log(randomIndex)
            }
            this.setCurrentSongIndex(randomIndex)
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['currentSongDetail']),
    ...mapState(['isPlaying', 'currentSongIndex', 'curTime', 'isScrollProgress', 'songsDetail', 'playMode', 'favoriteList', 'historyList'])
  },
  watch: {
    isPlaying (newVal, oldVal) { // 监视播放状态变化
      if (newVal) {
        this.$refs.audio.play()
      } else {
        this.$refs.audio.pause()
      }
    },
    currentSongDetail (newVal) { // 当前歌曲信息变了，说明切歌了
      /*
        注意点：ios系统中不会自动加载歌曲，所以oncanplay事件，不会自动调用
        这会导致当切歌时，歌曲不会自动播放，必须通过play方法才能后，canplay事件才会执行
        解决方案：用ondurationchange事件替代oncanplay，当歌曲加载完毕后，歌曲总时长也获取到，这个事件就会触发
      */
      this.$refs.audio.ondurationchange = () => {
        this.totalTime = this.$refs.audio.duration// 切歌后也要再获取总时间
        if (this.isPlaying) {
          this.$refs.audio.play()
        } else {
          this.$refs.audio.pause()
        }
      }
      // 2.当前歌曲信息变了，说明该歌曲应该加入播放历史
      this.setHistoryList(newVal)
    },
    curTime (newVal) {
      // vuex中的curTime改变，说明进度条被点了，或滑块滑动松开后
      // 歌曲的播放需要直接跳到对应时间
      this.$refs.audio.currentTime = newVal
    },
    favoriteList (newVal) { // 监视收藏列表的变化,及时更新到localStorage
      localStorage.setItem('favoriteList', JSON.stringify(newVal))
    },
    historyList (newVal) { // 监视历史的变化,及时更新到localStorage
      localStorage.setItem('historyList', JSON.stringify(newVal))
    }
  },
  mounted () {
    // 用ondurationchange事件替代oncanplay
    this.$refs.audio.ondurationchange = () => {
      this.totalTime = this.$refs.audio.duration
    }
    // 绑定一个事件总线，专门接收滑动时的实时时间
    this.$root.$on('curTimeByScrollProgress', (curTime) => {
      this.currentTime = curTime
    })
  }
}
</script>

<style lang="scss" scoped>
  .player{
    position: fixed;
    z-index: 1;
    // left: 0;
    // top: 0;
    // right: 0;
    // bottom: 0;
  }
  .playMask{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 2;
    background-color: rgba(0,0,0,0.7);
  }
</style>
