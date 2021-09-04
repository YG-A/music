<template>
  <div class="profile-bottom">
    <div class="bottom-play" @click="selectAllMusic">
      <span></span>
      <span>播放全部</span>
    </div>
    <div class="bottom-wrapper">
      <ScrollView>
        <SongListItem :songs="playlist"></SongListItem>
      </ScrollView>
    </div>
  </div>
</template>
<script>
import SongListItem from '../../components/SongListItem.vue'
import ScrollView from '../../components/ScrollView.vue'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ProfileBottom',
  data () {
    return {
      num: 0,
      playlist: []
    }
  },
  components: {
    SongListItem, ScrollView
  },
  methods: {
    ...mapMutations(['changeSongsDetail']),
    selectAllMusic () {
      this.$store.dispatch('setFullScreen', true)// 打开一般播放界面
      this.$store.dispatch('setMiniPlayer', false)// 关闭mini播放界面
      const ids = this.playlist.map((item) => {
        return item.id// 取出id
      })
      this.$store.dispatch('setSongsDetail', ids)
      this.$store.dispatch('setCurrentSongIndex', 0)// 把当前歌曲索引置为0

      // this.$store.dispatch('setFullScreen', true)// 打开一般播放界面
      // this.$store.dispatch('setMiniPlayer', false)// 关闭mini播放界面
      // this.$store.dispatch('setCurrentSongIndex', 0)// 把当前歌曲索引置为0
      // this.changeSongsDetail(this.playlist)// 直接把列表的信息赋值给vuex不用再请求
    }
  },
  computed: {
    ...mapState(['favoriteList', 'historyList'])
  },
  mounted () {
    this.playlist = this.favoriteList // 展示的列表默认为favoriteList
    this.$root.$on('ProfileSwitchNum', (num) => { // 通过这个事件修改
      this.num = num
      this.playlist = this.num === 0 ? this.favoriteList : this.historyList
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  @import '../../assets/css/variable.scss';
  .profile-bottom{
    position: fixed;
    top: 100px;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .bottom-play{
    display: flex;
    width: 260px;
    height: 80px;
    margin: 20px auto;
    justify-content: center;
    align-items: center;
    border: 1px solid #000;
    @include border_color();
    border-radius: 40px;
    span{
      display: inline-block;
      @include font_size($font_medium_s);
      &:nth-of-type(1){
        width: 46px;
        height: 46px;
        @include bg_img('../../assets/images/small_play');
        margin-right: 20px;
      }
    }
  }
  .bottom-wrapper{
    position: fixed;
    top: 220px;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
