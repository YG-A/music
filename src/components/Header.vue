<template>
  <div class="header" @click="changeTheme">
    <div class="header-left"></div>
    <div class="header-title">YG音乐</div>
    <div class="header-right" @click.stop="profileClick"></div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      curIndex: 0,
      themes: ['theme', 'theme1', 'theme2']
    }
  },
  methods: {
    changeTheme () { // 每点击一次头部都换肤
      this.curIndex++
      if (this.curIndex >= this.themes.length) {
        this.curIndex = 0
      }
      document.documentElement.setAttribute('data-theme', this.themes[this.curIndex])
    },
    profileClick () {
      this.$router.push('/profile')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/css/mixin.scss';
  .header{
    // position: fixed;
    // left: 0;
    // top: 0;
    // z-index: 1;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100px;
    @include  bg_color();//scss混合
    .header-left,.header-right{
      width: 84px;
      height: 84px;
      margin-top: 8px;
    }
    .header-left{
      @include  bg_img('../assets/images/logo')
    }
    .header-right{
      @include  bg_img('../assets/images/account')
    }
    .header-title{
      text-align: center;
      line-height: 100px;
      font-weight: bold;
      color: #fff;
      @include font_size($font_medium);
    }
  }
</style>
