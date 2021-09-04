<template>
  <transition :css="false" @enter="enter" @leave="leave">
    <div class="list-player" v-show="$store.state.isShowListPlayer">
      <div class="player-wrapper">
        <div class="player-top">
          <div class="top-left" @click="changeMode">
            <div class="mode" :class="{'loop':isLoop,'one': isOne,'random': isRandom}"></div>
            <p v-show="isLoop">列表循环</p>
            <p v-show="isOne">单曲循环</p>
            <p v-show="isRandom">随机播放</p>
          </div>
          <div class="top-right">
            <div class="del" @click="delAll"></div>
          </div>
        </div>
        <div class="player-middle">
          <ScrollView ref="scrollView">
            <ul>
              <li class="item" v-for="(song,index) in songsDetail" :key="song.id" @click="selectMusic(index)">
                <div class="item-left">
                  <div class="item-play" :class="{'active': $store.state.isPlaying}" @click.stop="play" v-show="currentSongIndex===index"></div>
                  <p>{{song.name}}</p>
                </div>
                <div class="item-right">
                  <div class="item-favorite" :class="{'active': isFavorite(song)}" @click.stop="favorite(song)"></div>
                  <div class="item-del" @click.stop="del(index)"></div>
                </div>
              </li>
            </ul>
          </ScrollView>
        </div>
        <div class="player-bottom" @click="closeListPlayer">
          <p>关闭</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import ScrollView from '../ScrollView.vue'
import Velocity from 'velocity-animate'
import 'velocity-animate/velocity.ui'
export default {
  name: 'ListPlayer',
  components: {
    ScrollView
  },
  methods: {
    closeListPlayer () {
      this.$store.dispatch('setListPlayer', false)
    },
    enter (el, done) {
      // el是被transition标签框住的那个元素，done是个函数，需要在动画执行后调用(不调用会出现bug)
      Velocity(el, 'transition.slideUpIn', { duration: 500, complete: done })
      this.$refs.scrollView.iscroll.refresh()
    },
    leave (el, done) {
      Velocity(el, 'transition.slideUpOut', { duration: 500, complete: done })
    },
    play () {
      this.$store.dispatch('setIsPlaying', !this.$store.state.isPlaying)
    },
    changeMode () {
      // 只能0，1，2
      const temp = (this.$store.state.playMode + 1) % 3
      this.$store.dispatch('setPlayMode', temp)
    },
    ...mapMutations(['delSongDetail', 'delAllSongDetail']),
    ...mapActions(['setCurrentSongIndex', 'setFavoriteList']),
    del (index) {
      // console.log(this.delSongDetail)
      // this.$store.commit('delSongDetail', index)
      this.delSongDetail(index)
    },
    delAll () {
      this.delAllSongDetail()
    },
    selectMusic (index) {
      this.setCurrentSongIndex(index)
    },
    favorite (song) {
      this.setFavoriteList(song)
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
      return (song) => {
        const flag = this.favoriteList.find((item) => {
          return item.id === song.id
        })
        return flag !== undefined
      }
    },
    ...mapGetters(['currentSongDetail']),
    ...mapState(['songsDetail', 'currentSongIndex', 'favoriteList'])
  }
}

</script>

<style lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  @import '../../assets/css/variable.scss';
  .list-player{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 999;
    @include bg_sub_color();
    .player-wrapper{
      .player-top{
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .top-left{
          display: flex;
          align-items: center;
          padding-left: 20px;
          .mode{
            width: 56px;
            height: 56px;
            margin-right: 20px;
            &.loop{
              @include bg_img('../../assets/images/small_loop');
            }
            &.one{
              @include bg_img('../../assets/images/small_one');
            }
            &.random{
              @include bg_img('../../assets/images/small_shuffle');
            }
          }
          p{
            @include font_size($font_medium_s);
            @include font_color();
          }
        }
        .top-right{
          .del{
            width: 84px;
            height: 84px;
            @include bg_img('../../assets/images/small_del')
          }
        }
      }
      .player-middle{
        width: 100%;
        height: 700px;
        overflow: hidden;
        .item{
          height: 100px;
          border-top: 1px solid #ccc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          box-sizing: border-box;
          .item-left{
            display: flex;
            align-items: center;
            .item-play{
              width: 56px;
              height: 56px;
              margin-right: 20px;
              @include bg_img('../../assets/images/small_play');
              &.active{
                @include bg_img('../../assets/images/small_pause');
              }
            }
            p{
              @include font_size($font_medium_s);
              @include font_color();
            }
          }
          .item-right{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .item-favorite{
              width: 56px;
              height: 56px;
              @include bg_img('../../assets/images/small_un_favorite');
              &.active{
                @include bg_img('../../assets/images/small_favorite');
              }
            }
            .item-del{
              width: 52px;
              height: 52px;
              margin-left: 20px;
              @include bg_img('../../assets/images/small_close')
            }
          }
        }
      }
      .player-bottom{
        width: 100%;
        height: 100px;
        line-height: 100px;
        @include bg_color();
        p{
          text-align: center;
          @include font_size($font_medium);
          color: #fff;
        }
      }
    }
  }
</style>
