<template>
  <div class="header" @click="changeTheme">
    <div class="header-left" @click.stop="back"></div>
    <div class="header-center">
      <div class="favorite" :class="{'active':switchNum===0}" @click.stop="favoriteClick">我喜欢的</div>
      <div class="history" :class="{'active':switchNum===1}"  @click.stop="historyClick">最近听的</div>
    </div>
    <div class="header-right"></div>
  </div>
</template>

<script>
export default {
  name: 'ProfileHeader',
  data () {
    return {
      curIndex: 0,
      themes: ['theme', 'theme1', 'theme2'],
      switchNum: 0
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
    },
    favoriteClick () {
      this.switchNum = 0
      this.$root.$emit('ProfileSwitchNum', this.switchNum)
    },
    historyClick () {
      this.switchNum = 1
      this.$root.$emit('ProfileSwitchNum', this.switchNum)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    .header-center{
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-weight: bold;
      color: #fff;
      @include font_size($font_medium);
      @include no-wrap();
      border: 2px solid rgb(197, 188, 188);
      border-radius: 10px;
      height: 60px;
      div{
        padding: 30px;
        &:nth-of-type(1){
          border-right: 2px solid rgb(197, 188, 188);
        }
        &.active{
          background-color: rgba(255, 255, 255,0.3);
        }
      }
    }
    .header-right{
      @include  bg_img('../../assets/images/more')
    }

  }
</style>
