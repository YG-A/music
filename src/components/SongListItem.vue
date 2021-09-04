<template>
  <ul class="song-list">
      <li class="item" v-for="item in songs" :key="item.id" @click="selectMusic(item.id)">
        <!-- <img :src="item.song.album.picUrl" alt=""> -->
        <img v-lazy="item.picUrl" alt="">
        <div class="info">
          <h3>{{item.name}}</h3>
          <p>{{item.singers.join('/')}}</p>
        </div>
      </li>
    </ul>
</template>
<script>
export default {
  name: 'SongListItem',
  props: {
    songs: {
      type: Array,
      default: () => { return [] },
      required: true
    }
  },
  methods: {
    selectMusic (id) {
      this.$store.dispatch('setFullScreen', true)
      this.$store.dispatch('setMiniPlayer', false)
      this.$store.dispatch('setSongsDetail', [id])
      this.$store.dispatch('setCurrentSongIndex', 0)// 把当前歌曲索引置为0
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../assets/css/mixin.scss';
  @import '../assets/css/variable.scss';
  .song-list{
    width: 100%;
    overflow: hidden;
    .item{
      height: 200px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      margin-bottom: 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #ccc;
      img{
        width: 150px;
        height: 150px;
        border-radius: 20px;
        border-radius: 20px;
        margin-right: 20px;
      }
      .info{
        h3{
          @include font_size($font_large);
          @include font_color();
        }
        p{
          @include font_size($font_medium_s);
          @include font_color();
          opacity: 0.6;
          margin-top: 20px;
        }
      }
    }
  }
</style>
