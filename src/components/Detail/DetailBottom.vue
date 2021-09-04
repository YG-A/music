<template>
  <ul class="detail-bottom" ref="detailBottom">
    <li class="bottom-top" @click="selectAllMusic">
      <div class="bottom-icon"></div>
      <div class="bottom-title">播放全部</div>
    </li>
    <li v-for="item in playlist" :key="item.id" class="item" @click="selectMusic(item.id)">
      <h3>{{item.name}}</h3>
      <p>{{item.al.name}} - {{item.ar[0].name}}</p>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'DetailBottom',
  props: ['playlist'],
  methods: {
    selectMusic (id) {
      this.$store.dispatch('setFullScreen', true)
      this.$store.dispatch('setMiniPlayer', false)
      this.$store.dispatch('setSongsDetail', [id])
      // this.$store.dispatch('setCurrentLyric', id)
      this.$store.dispatch('setCurrentSongIndex', 0)// 把当前歌曲索引置为0
    },
    selectAllMusic () {
      // console.log(this.playlist)
      this.$store.dispatch('setFullScreen', true)
      this.$store.dispatch('setMiniPlayer', false)
      const ids = this.playlist.map((item) => {
        return item.id// 取出id
      })
      // console.log(ids)
      this.$store.dispatch('setSongsDetail', ids)
      this.$store.dispatch('setCurrentSongIndex', 0)// 把当前歌曲索引置为0
    }
  },
  watch: {
    playlist (newValue) {
      // 这个playlist是DetailBottom的父组件网络请求，然后通过props传过来的，
      // 但是当子组件中代码异步的时候，可能会出现mounted中取不到传递过来的参数的情况。所以只能监听其变化
      // 如果改变说明值传递过来了，在下次DOM更新循环结束之后执行延迟回调，此时dom更新完毕高度就能获取了
      this.$nextTick(function () {
        this.$emit('get-height', this.$refs.detailBottom.offsetHeight)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  @import '../../assets/css/variable.scss';
  .detail-bottom{
    position: fixed;
    top: 400px;
    width: 100%;
    li{
      width: 100%;
      height: 100px;
      padding: 0 20px;
      box-sizing: border-box;
      @include bg_sub_color();
      border-bottom: 1px solid #ccc;
    }
    .bottom-top{
      display: flex;
      align-items: center;
      border-top-left-radius: 50px;
      border-top-right-radius: 50px;
      .bottom-icon{
        width: 60px;
        height: 60px;
        margin-right: 20px;
        @include bg_img('../../assets/images/small_play');
      }
      .bottom-title{
        @include font_color();
        @include font_size($font_large);

      }
    }
    .item{
      h3{
        @include font_color();
        @include font_size($font_medium);
        @include no-wrap();
      }
      p{
        @include font_color();
        @include font_size($font_samll);
        margin-top: 10px;
        opacity: 0.8;
      }
    }
  }
</style>
