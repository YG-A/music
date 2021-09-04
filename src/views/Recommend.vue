<template>
  <div class="recommend">
    <ScrollView ref="scrollView">
      <div class="scroll-list">
        <Banner ref="banner" :banners="banners"></Banner>
        <Personalized :personalized="personalized" title="推荐歌单" @select-item="fatherSelectItem" type="personalized"></Personalized>
        <Personalized :personalized="albums" title="最新专辑" @select-item="fatherSelectItem" type="albums"></Personalized>
        <SongList :songs="songs"></SongList>
      </div>
    </ScrollView>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { getBanner, getPersonalized, getNewAlbum, getNewSong } from '../api/index'
import Banner from '../components/Recommend/Banner.vue'
import Personalized from '../components/Recommend/Personalized.vue'
import SongList from '../components/Recommend/SongList.vue'
import ScrollView from '../components/ScrollView.vue'
export default {
  name: 'Recommend',
  components: {
    Banner, Personalized, SongList, ScrollView
  },
  data () {
    return {
      banners: [],
      personalized: [],
      albums: [],
      songs: [],
      swiperAutoPlay: true
    }
  },
  created () {
    // 请求Banner数据
    getBanner().then((data) => {
      // console.log(data)
      this.banners = data.banners
    }).catch((error) => {
      console.log(error)
    })
    // 请求推荐歌单
    getPersonalized().then((data) => {
      // console.log(data)
      this.personalized = data.result
    }).catch((error) => {
      console.log(error)
    })

    // 请求最新专辑
    getNewAlbum().then((data) => {
      // console.log(data.albums.slice(0, 6))
      this.albums = data.albums.slice(0, 6)
    }).catch((error) => {
      console.log(error)
    })

    // 推荐新音乐
    getNewSong().then((data) => {
      // console.log(data)
      const list = []
      data.result.forEach((item) => {
        const obj = {}
        obj.id = item.id
        obj.name = item.name
        obj.picUrl = item.picUrl
        obj.singers = item.song.artists.map((el) => {
          return el.name
        })
        list.push(obj)
      })
      this.songs = list
    }).catch((error) => {
      console.log(error)
    })
  },
  mounted () {
    this.$refs.scrollView.scrolling((offsetY) => {
      if (this.swiperAutoPlay === true && offsetY <= -300) {
        this.$refs.banner.swiper.autoplay.stop()
        this.swiperAutoPlay = false
      } else if (this.swiperAutoPlay === false && offsetY > -300) {
        this.$refs.banner.swiper.autoplay.start()
        this.swiperAutoPlay = true
      }
    })
  },
  methods: {
    fatherSelectItem (id, type) {
      this.$router.push({
        path: '/recommend/detail',
        query: {
          id,
          type
        }
      })
    }
  },
  watch: {
    $route (to, from) {
      if (from.path === '/recommend') { // 从推荐页出去
        // console.log(this.swiper)
        if (this.swiperAutoPlay) {
          this.$refs.banner.swiper.autoplay.stop()
          this.swiperAutoPlay = false
        }
      } else if (to.path === '/recommend') { // 从其他页进入推荐页
        if (!this.swiperAutoPlay) {
          this.$refs.banner.swiper.autoplay.start()
          this.swiperAutoPlay = true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .recommend{
    position: fixed;
    left: 0;
    top: 184px;
    right: 0;
    bottom: 0;
  }
  .v-enter,.v-leave-to{
    transform: translateX(-100%);
  }
  .v-enter-to,.v-leave{
    transform: translateX(0%);
  }
  .v-enter-active,.v-leave-active{
    transition: transform 0.5s;
  }
</style>
