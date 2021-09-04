<template>
  <div class="header">
    <div class="header-left" @click="closeNormalPlayer"></div>
    <div class="header-title">
      <h3>{{currentSongDetail.name}}</h3>
      <p>{{currentSongDetail.singers | formateSingers}}</p>
    </div>
    <div class="header-right"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PlayerHeader',
  methods: {
    closeNormalPlayer () {
      this.$store.dispatch('setFullScreen', false)
      this.$store.dispatch('setMiniPlayer', true)
    }
  },
  computed: {
    ...mapGetters(['currentSongDetail'])
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
  .header{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100px;
    .header-left,.header-right{
      width: 84px;
      height: 84px;
      margin-top: 8px;
    }
    .header-left{
      @include  bg_img('../../assets/images/down')
    }
    // .header-right{
    //   // @include  bg_img('../../assets/images/more')
    // }
    .header-title{
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      color: #fff;
      @include font_size($font_medium);
    }
  }
</style>
