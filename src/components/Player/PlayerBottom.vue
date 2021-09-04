<template>
  <div class="player-bottom">
    <div class="bottom-progress" :class="{'active': progressIsActive}">
      <span>{{formattedCurrentTime}}</span> <!-- 当前时间00:00 -->
      <div class="progress-bar" @click="progressClick($event)" ref="progressBar">
        <div class="progress-line" ref="progressLine">
          <div class="progress-dot" @touchstart.stop="touchstart" @touchmove="touchmove" @touchend.stop="touchend" ref="progressDot">
          </div>
        </div>
      </div>
      <span>{{formattedTotalTime}}</span> <!-- 总时间00:00 -->
    </div>
    <div class="bottom-control">
      <div class="mode" @click="changeMode" :class="{'loop':isLoop,'one': isOne,'random': isRandom}"></div>
      <div class="prev" @click="prev"></div>
      <div class="play" :class="{'active': this.$store.state.isPlaying}" @click="play"></div>
      <div class="next" @click="next"></div>
      <div class="favorite" :class="{'active':isFavorite}" @click="favorite" ></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  name: 'PlayerBottom',
  props: {
    totalTime: { // 秒为单位
      type: Number,
      default: 0,
      required: true
    },
    currentTime: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data () {
    return {
      formattedTotalTime: '00:00',
      formattedCurrentTime: '00:00',
      progressIsActive: false,
      touchstartOffsetX: 0
    }
  },
  methods: {
    ...mapActions(['setCurrentSongIndex', 'setCurTime', 'setIsScrollProgress', 'setFavoriteList']),
    formatTime (time) {
      const totalSecond = time
      const day = Math.floor(totalSecond / (60 * 60 * 24))
      const hour = Math.floor(totalSecond / (60 * 60) % 24)
      const minute = Math.floor((totalSecond / 60) % 60)
      const second = Math.floor(totalSecond % 60)
      return { day, hour, minute, second }
    },
    play () {
      this.$store.dispatch('setIsPlaying', !this.$store.state.isPlaying)
    },
    changeMode () {
      // 只能0，1，2
      const temp = (this.$store.state.playMode + 1) % 3
      this.$store.dispatch('setPlayMode', temp)
    },
    prev () {
      // console.log('上')
      this.setCurrentSongIndex(this.currentSongIndex - 1)
    },
    next () {
      // console.log('下')
      this.setCurrentSongIndex(this.currentSongIndex + 1)
    },
    touchstart (event) {
      this.progressIsActive = true// 添加active类名，添加样式
      this.setIsScrollProgress(true)// vuex标识正在滑动进度条
    },
    touchmove (event) {
      const touch = event.targetTouches[0]
      const progressBarWidth = this.$refs.progressBar.offsetWidth
      const offsetX = touch.pageX - this.$refs.progressBar.offsetLeft// 手指相对于进度条的水平距离

      // 1.改变【进度条进度】
      let percent = 0// 进度比例
      if (offsetX <= 0) {
        percent = 0
      } else if (offsetX >= progressBarWidth) {
        percent = 1
      } else {
        percent = offsetX / progressBarWidth
      }
      this.$refs.progressLine.style.width = `${percent * 100}%`// 把比例赋值给进度

      /*
        2.当前时间随滑动实时改变
        【滑动时只改时间，不改【歌曲播放的进度】，等松开时再改进度】
      */
      const curTime = percent * this.totalTime
      // this.currentTime = curTime //不能直接改props中的数据，只能事件总线传值了
      this.$root.$emit('curTimeByScrollProgress', curTime)// 事件总线
    },
    touchend () {
      this.progressIsActive = false// 松开滑块时，去掉样式
      if (this.totalTime - this.currentTime < 1) {
        // 如果松手时的时间只比总时间短1s或1s内，
        // 应该赋值一个总时间-1s,给用户一个缓冲
        this.setCurTime(this.totalTime - 1) // 把松开那一刻的时间传到vuex
      } else {
        this.setCurTime(this.currentTime) // 把松开那一刻的时间传到vuex
      }
      this.setIsScrollProgress(false)// 松开vuex修改滑动状态为false
    },
    progressClick (event) {
      if (event.target === this.$refs.progressDot) return
      const offsetX = event.pageX - this.$refs.progressBar.offsetLeft
      const progressBarWidth = this.$refs.progressBar.offsetWidth
      if (offsetX < 0 || offsetX > progressBarWidth) return

      // 1.改变进度
      const percent = offsetX / progressBarWidth
      this.$refs.progressLine.style.width = `${percent * 100}%`
      // console.log(offsetX, event.target, event.target.offsetWidth)

      // 2.改变当前时间
      const curTime = percent * this.totalTime
      // console.log(curTime, this.totalTime)
      this.setCurTime(curTime)
    },
    favorite () {
      // console.log('喜欢')
      this.setFavoriteList(this.currentSongDetail)
    }
  },
  computed: {
    isLoop () {
      return this.$store.state.playMode === 0
    },
    isOne () {
      return this.$store.state.playMode === 1
    },
    isRandom () {
      return this.$store.state.playMode === 2
    },
    isFavorite () {
      const flag = this.favoriteList.find((item) => {
        return item.id === this.currentSongDetail.id
      })
      return flag !== undefined
    },
    ...mapGetters(['currentSongDetail']), // 当前歌曲的基本信息
    ...mapState(['currentSongIndex', 'favoriteList']) // 当前歌曲在播放列表中的索引
  },
  watch: {
    totalTime (newVal) {
      const obj = this.formatTime(newVal)
      const minuteStr = (obj.minute / 10) < 1 ? '0' + obj.minute : '' + obj.minute
      const secondStr = (obj.second / 10) < 1 ? '0' + obj.second : '' + obj.second
      this.formattedTotalTime = minuteStr + ':' + secondStr
    },
    currentTime (newVal) {
      // 1.格式化正在播放歌曲的current的时间
      const obj = this.formatTime(newVal)
      const minuteStr = (obj.minute / 10) < 1 ? '0' + obj.minute : '' + obj.minute
      const secondStr = (obj.second / 10) < 1 ? '0' + obj.second : '' + obj.second
      this.formattedCurrentTime = minuteStr + ':' + secondStr

      // 2.根据 (当前时间/总时间) = 进度宽度百分比(xx%)
      const percent = newVal / this.totalTime // 乘100是为了直接与%拼接成percent%
      this.$refs.progressLine.style.width = `${percent * 100}%`
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  @import '../../assets/css/variable.scss';
  .player-bottom{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    .bottom-progress{
      width: 85%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .progress-bar{// 进度条的总长
        width: 100%;
        margin: 0 20px;
        height: 7px;
        background-color: #fff;
        .progress-line{// 进度
          position: relative;
          width: 0%;
          height: 100%;
          background-color: rgb(105, 104, 104);
          .progress-dot{// 滑块
            position: absolute;
            top: 50%;
            // margin-left: 100%;//margin-left可以
            /*
              left: 100%也行，100%就是相对于progress-line的width，
              这样只需操作进度【progress-line】的width，
              滑块的left随之width而改变，位置就改变了
            */
            left: 100%;
            width: 20px;
            height: 20px;
            background-color: #fff;
            border-radius: 50%;
            transform: translate(-50%,-50%);
            transition-property: width,height;
            transition-duration: 500ms;
          }
        }
      }
      span{
        // @include font_color();
        color: #9b9a9a;
        @include font_size($font_samll);
      }
      &.active{
        .progress-bar{
          height: 10px;
          .progress-line{
            .progress-dot{// 滑块
              width: 40px;
              height: 40px;
              border-radius: 50%;
              transform: translate(-50%,-50%);
            }
          }
        }
        span{
          &:nth-of-type(1){
            color: #fff;
          }
        }
      }
    }

    .bottom-control{
      width: 80%;
      padding: 50px 0;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      div{
        width: 84px;
        height: 84px;
      }
      .mode{
        &.loop{
          @include bg_img('../../assets/images/loop');
        }
        &.one{
          @include bg_img('../../assets/images/one');
        }
        &.random{
          @include bg_img('../../assets/images/shuffle');
        }
      }
      .prev{
        @include bg_img('../../assets/images/prev');
      }
      .play{
        @include bg_img('../../assets/images/play');
        &.active{
          @include bg_img('../../assets/images/pause');
        }
      }
      .next{
        @include bg_img('../../assets/images/next');
      }
      .favorite{
        @include bg_img('../../assets/images/un_favorite');
        &.active{
          @include bg_img('../../assets/images/favorite');
        }
      }
    }
  }
</style>
