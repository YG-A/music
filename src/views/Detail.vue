<template>
  <div class="detail">
    <SubHeader :title="playlist.name"></SubHeader>
    <ScrollView ref="scrollView">
      <div class="scrollList" ref="scrollList">
        <DetailTop ref="detailTop" :imgSrc="playlist.coverImgUrl" @get-height="getDetailTopHeight"></DetailTop>
        <DetailBottom :playlist='playlist.tracks' @get-height="getDetailBottomHeight"></DetailBottom>
      </div>
    </ScrollView>
  </div>
</template>
<script>
import SubHeader from '../components/Detail/SubHead.vue'
import DetailTop from '../components/Detail/DetailTop.vue'
import DetailBottom from '../components/Detail/DetailBottom.vue'
import ScrollView from '../components/ScrollView.vue'
import { getPlayList, getAlbum, getArtistsSongs, getRankSongs, getSearchList } from '../api/index'

export default {
  name: 'Detail',
  props: ['id', 'type', 'keywords', 'songsType'],
  components: {
    SubHeader, DetailTop, DetailBottom, ScrollView
  },
  data () {
    return {
      playlist: [],
      playlistHeight: 0
    }
  },
  methods: {
    getDetailTopHeight (height) {
      this.playlistHeight += height
      this.$refs.scrollList.style.height = this.playlistHeight + 'px'
    },
    getDetailBottomHeight (height) {
      this.playlistHeight += height
      this.$refs.scrollList.style.height = this.playlistHeight + 'px'
    }

  },
  created () {
    if (this.type === 'personalized') {
      getPlayList({ id: this.id }).then((data) => {
        this.playlist = data.playlist
      }).catch((error) => {
        console.log(error)
      })
    } else if (this.type === 'albums') {
      getAlbum({ id: this.id }).then((data) => {
        // console.log(data)
        // 为了使用一个统一的对象，只能自己封装不能直接赋值
        this.playlist = {
          name: data.album.name,
          coverImgUrl: data.album.picUrl,
          tracks: data.songs
        }
      }).catch((error) => {
        console.log(error)
      })
    } else if (this.type === 'singer') {
      getArtistsSongs({ id: this.id }).then((data) => {
        // console.log(data)
        this.playlist = {
          name: data.artist.name,
          coverImgUrl: data.artist.picUrl,
          tracks: data.hotSongs
        }
      }).catch((error) => {
        console.log(error)
      })
    } else if (this.type === 'rank') {
      getRankSongs({ idx: this.id }).then((data) => {
        this.playlist = {
          name: data.playlist.name,
          coverImgUrl: data.playlist.creator.backgroundUrl,
          tracks: data.playlist.tracks
        }
      }).catch((error) => {
        console.log(error + '接口问题，没办法')
      })
    } else if (this.type === 'search') {
      getSearchList({ keywords: this.keywords, type: this.songsType }).then((data) => {
        this.playlist = {
          name: this.keywords,
          coverImgUrl: data.result.songs[0].album.artist.img1v1Url,
          tracks: data.result.songs.map((item) => {
            return {
              id: item.id,
              name: item.name,
              al: item.album,
              ar: item.artists
            }
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  mounted () {
    // 在ScrollView组件中提供了srcolling方法，可以获取到当前滚动的this.y
    const detailTop = this.$refs.detailTop.$el
    const defaultHeight = this.$refs.detailTop.$el.offsetHeight
    this.$refs.scrollView.scrolling((offsetY) => {
      if (offsetY < 0) {
        /* 高斯模糊效果非常消耗性能，不推荐在移动端使用 */
        // detailTop.style.filter = `blur(${Math.abs(offsetY / 20) + 'px'})`
        const opacity = Math.abs(offsetY) / defaultHeight
        this.$refs.detailTop.changeMask(opacity)
      } else {
        // console.log('向下拉')
        // this.$refs.detailTop.offsetHeight
        detailTop.style.transform = `scale(${1 + offsetY / defaultHeight})`
      }
    })
  }
}
</script>

<style scoped lang="scss">
  .detail{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background-color: #fff;
  }
</style>
