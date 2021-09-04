<template>
  <div class="tabBar">
    <router-link class="item" to="/recommend" active-class="active">
      <span>推荐</span>
    </router-link>
    <router-link class="item" to="/singer" active-class="active">
      <span>歌手</span>
    </router-link>
    <router-link class="item" to="/rank" active-class="active">
      <span>排行</span>
    </router-link>
    <router-link class="item" to="/search" active-class="active">
      <span>搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'TabBar'
}
</script>

<style lang="scss" scoped>
  @import '../assets/css/mixin.scss';
  .tabBar{
    width: 100%;
    height: 84px;
    @include bg_sub_color();
    display: flex;
    justify-content: space-around;
    .item{
      color: initial;
      line-height: 84px;
      @include font_size($font_medium);
      @include font_color();
      &.active{
        span{
          @include font_active_color();
        }
        border-bottom: 5px solid #000;
        @include border_color()
      }
    }

  }
</style>
