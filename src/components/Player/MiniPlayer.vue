<template>
  <transition :css="false" @enter="enter" @leave="leave">
    <div class="mini-player" v-show="$store.state.isShowMiniPlayer">
      <div class="player-wrapper">
        <div class="player-left" @click="showNormalPlayer">
          <img :class="{'active': this.$store.state.isPlaying}" :src="currentSongDetail.picUrl" alt="">
          <div class="player-title">
            <h3>{{currentSongDetail.name}}</h3>
            <p>{{currentSongDetail.singers | formateSingers}}</p>
          </div>
        </div>
        <div class="player-right">
          <div class="play" :class="{'active': this.$store.state.isPlaying}" @click="play"></div>
          <div class="list" @click="showListPlayer"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Velocity from 'velocity-animate'
import 'velocity-animate/velocity.ui'
export default {
  name: 'MiniPlayer',
  computed: {
    ...mapGetters(['currentSongDetail']),
    ...mapState(['songsDetail'])
  },
  methods: {
    showNormalPlayer () {
      this.$store.dispatch('setFullScreen', true)
      this.$store.dispatch('setMiniPlayer', false)
    },
    showListPlayer () {
      this.$store.dispatch('setListPlayer', true)
    },
    enter (el, done) {
      // el是被transition标签框住的那个元素，done是个函数，需要在动画执行后调用(不调用会出现bug)
      Velocity(el, 'transition.bounceUpIn', { duration: 500, complete: done })
    },
    leave (el, done) {
      Velocity(el, 'transition.fadeOut', { duration: 500, complete: done })
    },
    play () {
      this.$store.dispatch('setIsPlaying', !this.$store.state.isPlaying)
    }
  },
  filters: {
    formateSingers (singers) {
      return singers.join('/')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  @import '../../assets/css/variable.scss';
  .mini-player{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 150px;
    .player-wrapper{
      width: 100%;
      height: 100%;
      @include bg_color();
      display: flex;
      justify-content: space-between;
      align-items: center;
      .player-left{
        display: flex;
        padding-left: 20px;
        img{
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-right: 20px;
          animation: sport 10s linear infinite paused;
          &.active{
            animation-play-state: running;
          }
        }
        .player-title{
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          h3{
            @include font_size($font_medium);
            @include font_color();
          }
          p{
            @include font_size($font_medium_s);
            @include font_color();
          }
        }
      }
      .player-right{
        display: flex;
        justify-content: center;
        align-content: center;
        div{
          width: 100px;
          height: 100px;
        }
        .play{
          @include bg_img('../../assets/images/play');
          &.active{
            @include bg_img('../../assets/images/pause');
          }
        }
        .list{
          @include bg_img('../../assets/images/list')
        }
      }
    }
  }

  @keyframes sport{
    from{
      transform: rotate(0);
    }
    to{
      transform: rotate(360deg);
    }
  }
</style>
