<template>
  <!--
    解决swiper轮播到最后一页后，可能不继续播的问题，只需要在swiper组件上使用v-if判断长度就行
  -->
  <swiper class="banner" :options="swiperOptions">
    <!-- 页面 -->
    <swiper-slide class="cd">
      <div class="cd-wrapper" :class="{'active': this.$store.state.isPlaying}">
        <img :src="currentSongDetail.picUrl" alt="">
      </div>
      <p>{{curLyric}}</p>
    </swiper-slide>
    <swiper-slide class="lyric">
      <ScrollView ref="scrollOfNormalPlayer">
        <ul>
          <li ref="eachLine" :class="{'active':index===curLyricIndex}" v-for="(item, index) in currentLyric.lyrics" :key="index">{{item}}</li>
        </ul>
        <div class="line"></div>
      </ScrollView>
    </swiper-slide>
    <!-- 分页器 -->
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ScrollView from '../ScrollView.vue'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'PlayerMiddle',
  props: {
    currentTime: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data () {
    return {
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
          bulletClass: 'my-bullet',
          bulletActiveClass: 'my-bullet-active'
        },
        observer: true,
        observeParents: true,
        observeSlideChildren: true
      },
      curLyricIndex: 0, // 当前高亮的歌词的索引
      isScrollLyric: false, // 是否在【手动】滚动歌词
      timeID: null// 定时器id
    }
  },
  methods: {
    test () {
      console.log('test')
    }
  },
  components: {
    swiper,
    swiperSlide,
    ScrollView
  },
  computed: {
    ...mapGetters(['currentSongDetail']), // 当前歌曲的基本信息
    ...mapState(['currentLyric', 'isScrollProgress']), // 当前歌曲的歌词信息和每行歌词的时间信息
    curLyric () {
      if (this.currentLyric.lyrics) {
        return this.currentLyric.lyrics[this.curLyricIndex]
      } else {
        return '等等，歌词加载呢'
      }
    }
  },
  watch: {
    currentTime (newVal) {
      /*
        获取当前歌曲歌词索引的思想：
        ⭐监视currentTime的变化，并把其newVal与times时间数组中每行歌词的时间循环比较大小
        当前newVal < item时，说明item对应的那行歌词的时间要大一点，所以可以肯定的是，现在
        显示item对应的那行歌词的【上一行】，一定没问题，所以将item对应的那个index-1,
        就是当前歌词的索引
        ⭐假设此时用户在滑动进度条，根据参考网易云音乐的逻辑，
          此时【歌词高亮】和【歌词滚动】不要继续进行了，等滑动松开后再继续
      */
      if (this.isScrollProgress) { return }// 滑动进度条时直接return
      const index = this.currentLyric.times.findIndex((item) => {
        if (newVal < item) {
          return true
        }
      })
      this.curLyricIndex = index - 1 // 保存当前应该高亮的那行歌词的索引
    },
    curLyricIndex (newVal) {
      // 监视【当前高亮歌词】的索引的变化，如果改变，说明歌词应该随着滚动
      if (this.isScrollProgress) { return }// 滑动进度条时，直接return
      if (this.isScrollLyric) { return } // 手动滚动歌词时，直接return
      const scrollHeight = -this.$refs.eachLine[0].offsetHeight * this.curLyricIndex
      this.$refs.scrollOfNormalPlayer.scrollTo(0, scrollHeight, 500)
    }
  },
  mounted () {
    this.$refs.scrollOfNormalPlayer.scrolling((y, x) => {
      this.isScrollLyric = true// 手动滚动为true
      this.timeID && clearTimeout(this.timeID)
    })

    this.$refs.scrollOfNormalPlayer.scrollEnd(() => {
      if (!this.isScrollLyric) { return }
      // console.log('歌词手动滚动结束')
      // this.isScrollLyric = false
      this.timeID = setTimeout(() => {
        const scrollHeight = -this.$refs.eachLine[0].offsetHeight * this.curLyricIndex
        this.$refs.scrollOfNormalPlayer.scrollTo(0, scrollHeight, 500)
        // console.log('是tm的老子改的')
        this.isScrollLyric = false
      }, 4000)
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  // @import '@/assets/css/mixin.scss';
  @import '../../assets/css/variable.scss';
  .banner{
    position: fixed;
    top: 150px;
    bottom: 250px;
    left: 0;
    right: 0;
    .cd{
      .cd-wrapper{
        margin: 0 auto;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        border: 30px solid #fff;
        overflow: hidden;
        text-align: center;
        animation: sport 10s linear infinite paused;//默认动画暂停
        &.active{
          animation-play-state: running;//active时播放
        }
        img{
          width: 100%;
          height: 100%;
        }
      }
      p{
        text-align: center;
        margin-top: 50px;
        @include font_size($font_medium);
        @include font_color();
      }
    }
    .lyric{
      box-sizing: border-box;
      padding: 30px 0 100px 0;
      #wrapper{
        position: relative;
        mask-image:linear-gradient(to bottom,
        rgba(255,255,255,0) 0,
        rgba(255,255,255,.6) 15%,
        rgba(255,255,255,1) 25%,
        rgba(255,255,255,1) 75%,
        rgba(255,255,255,.6) 85%,
        rgba(255,255,255,0) 100%);
        ul{
          padding-top: (402px - 37.5);
          padding-bottom: (402px - 37.5);
          li{
            text-align: center;
            @include font_color();
            @include font_size($font_medium_s);
            line-height: 75px;
            // 在后续计算高度时还要加上margin，很麻烦，不如直接设置行高，效果一样
            // margin: 20px 0;
            &.active{
              color: #fff
            }
          }
        }
        .line{
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          height: 3px;
          background: #fff;
        }
      }
    }
  }

  @keyframes sport {
    from{
      transform: rotate(0)
    }
    to{
      transform: rotate(360deg)
    }
  }
</style>
<style lang="scss">
  @import '../../assets/css/mixin.scss';
  .my-bullet{
    // 分页器小点点的样式
    display: inline-block;
    width: 20px;
    height: 20px;
    margin: 0 10px;
    background-color: #fff;
    border-radius: 10px;
  }
  .my-bullet-active{
    @include bg_color();
    opacity: 1;
    width: 50px;
  }
</style>
