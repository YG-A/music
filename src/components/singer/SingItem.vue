<template>
  <ul class="singItem">
    <li class="title">
      <h2>{{title}}</h2>
    </li>
    <li class="item" v-for="(obj,index) in item" :key="index" @click.stop="switchSinger(obj.id)">
      <img v-lazy="obj.img1v1Url" alt="">
      <p>{{obj.name}}</p>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'SingItem',
  props: ['item', 'title'],
  methods: {
    switchSinger (id) {
      this.$router.push({
        path: '/singer/detail',
        query: {
          id,
          type: 'singer'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  @import '../../assets/css/variable.scss';
  .singItem{
    .title{
      @include bg_color();
      @include font_size($font_medium);
      color: #fff;
      padding: 0 20px;
      height: 60px;
      line-height: 60px;
      box-sizing: border-box;
    }
    .item{
      display: flex;
      align-items: center;
      padding: 10px 20px;
      box-sizing: border-box;
      img{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-right: 20px;
      }
      p{
        @include font_size($font_medium);
        @include font_color();
      }
    }
  }
</style>
