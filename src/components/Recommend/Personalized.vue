<template>
  <div class="personalized">
    <div class="personalized-top">
      <h3>{{title}}</h3>
    </div>
    <div class="personalized-list">
      <div class="item" @click="clickItem(item.id)" v-for="(item) in personalized" :key="item.id">
        <!-- <img :src="item.picUrl" alt=""> -->
        <img v-lazy="item.picUrl" alt="">
        <p>{{item.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Personalized',
  props: {
    personalized: {
      type: Array,
      default: () => { return [] },
      required: true
    },
    title: {
      type: String,
      default: 'xxx',
      required: true
    },
    type: {
      type: String,
      default: 'xxx',
      required: true
    }
  },
  methods: {
    clickItem (id) {
      // console.log(id)
      this.$emit('select-item', id, this.type)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  .personalized{
    width: 100%;
    @include bg_sub_color();
    .personalized-top{
      box-sizing: border-box;
      width: 100%;
      height: 84px;
      line-height: 84px;
      @include bg_sub_color();
      border-bottom: 1px solid #ccc;
      padding: 0 20px;
      h3{
        @include font_size($font_large);
        font-weight: bold;
        @include font_color();
      }
    }
    .personalized-list{
      width: 100%;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      padding: 20px 0;
      .item{
        width: 200px;
        padding-bottom: 20px;
        img{
          width: 200px;
          height: 200px;
          border-radius: 20px;
        }
        p{
          @include clamp(2);
          @include font_color();
          @include font_size($font_medium_s);
        }
      }
    }
  }
</style>
