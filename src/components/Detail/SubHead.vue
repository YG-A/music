<template>
  <div class="header" @click="changeTheme">
    <div class="header-left" @click.stop="back"></div>
    <div class="header-title">{{title}}</div>
    <div class="header-right"></div>
  </div>
</template>

<script>
export default {
  name: 'SubHeader',
  props: ['title'],
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
    back () { // 回到上一页
      this.$router.back()
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
    @include  bg_color();//scss混合
    .header-left,.header-right{
      width: 84px;
      height: 84px;
      margin-top: 8px;
    }
    .header-left{
      @include  bg_img('../../assets/images/back')
    }
    .header-right{
      @include  bg_img('../../assets/images/more')
    }
    .header-title{
      text-align: center;
      line-height: 100px;
      font-weight: bold;
      color: #fff;
      @include font_size($font_medium);
      @include no-wrap();
    }
  }
</style>
