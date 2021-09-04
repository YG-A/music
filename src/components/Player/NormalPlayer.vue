<template>
  <transition :css="false" @enter="enter" @leave="leave">
    <div class="normal-player" v-show="$store.state.isFullScreen" ref="normalPlayer">
      <div class="player-wrapper">
        <PlayerHeader></PlayerHeader>
        <PlayerMiddle ref="middle" :currentTime="currentTime"></PlayerMiddle>
        <PlayerBottom :totalTime="totalTime" :currentTime="currentTime"></PlayerBottom>
      </div>
      <div class="player-bg">
        <img :src="$store.getters.currentSongDetail.picUrl" alt="">
        <div class="mask"></div>
      </div>
    </div>
  </transition>
</template>
<script>
import PlayerHeader from './PlayerHead.vue'
import PlayerMiddle from './PlayerMiddle.vue'
import PlayerBottom from './PlayerBottom.vue'
import { mapGetters } from 'vuex'
import Velocity from 'velocity-animate'
import 'velocity-animate/velocity.ui'
export default {
  name: 'NormalPlayer',
  props: {
    totalTime: { // 秒为单位
      type: Number,
      default: 0,
      required: true
    },
    currentTime: { // 秒为单位
      type: Number,
      default: 0,
      required: true
    }
  },
  components: {
    PlayerHeader, PlayerMiddle, PlayerBottom
  },
  methods: {
    enter (el, done) {
      // el是被transition标签框住的那个元素，done是个函数，需要在动画执行后调用(不调用会出现bug)
      Velocity(el, 'transition.fadeIn', { duration: 500, complete: done })
      // 显示后一定要刷新组件中的iscroll 否则iscroll无法滚动
      this.$refs.middle.$refs.scrollOfNormalPlayer.iscroll.refresh()
    },
    leave (el, done) {
      Velocity(el, 'transition.fadeOut', { duration: 500, complete: done })
    }
  },
  computed: {
    ...mapGetters(['currentSongDetail'])
  },
  watch: {
    currentSongDetail (newVal, oldVal) {
      if (newVal.id === undefined) { return }
      this.$store.dispatch('setCurrentLyric', newVal.id)// 设置当前歌曲的歌词
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  @import '../../assets/css/variable.scss';
  .normal-player{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    @include bg_sub_color();
    .player-wrapper{
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
    }
    .player-bg{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      img{
        height: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        filter: blur(30px);
      }
      .mask{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
      }
    }
  }
</style>
