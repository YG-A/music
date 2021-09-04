<template>
  <!--
    解决swiper轮播到最后一页后，可能不继续播的问题，只需要在swiper组件上使用v-if判断长度就行
  -->
  <swiper v-if="banners.length > 0" class="banner" ref="mySwiper" :options="swiperOptions">
    <!-- 页面 -->
    <swiper-slide class="item" v-for="(item) in banners" :key="item.bannerId">
      <a :href="item.url">
        <img :src="item.pic" alt="">
      </a>
    </swiper-slide>
    <!-- 分页器 -->
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'Banner',
  props: {
    banners: {
      type: Array,
      default: () => { return [] },
      required: true
    }
  },
  computed: {
    swiper () { // 这封装的就是swiper对象
      return this.$refs.mySwiper.swiper
    }
  },
  data () {
    return {
      swiperOptions: {
        loop: true,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        },
        observer: true,
        observeParents: true,
        observeSlideChildren: true
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  .banner{
    .item{
      a{
        display: block;
        width: 100%;
        height: 100%;
        img{
          width: 100%;
          height: 300px;
        }
      }
    }
  }
</style>
<style lang="scss">
// 在vue中设置swiper样式时不能 设置style标签的scoped属性
// 只能重新开一个style标签来专门写swiper的样式
  @import '../../assets/css/mixin.scss';
  .swiper-pagination{
    .swiper-pagination-bullet{
      // 分页器小点点的样式
      width: 16px;
      height: 8px;
      background-color: #fff;
      border-radius: 0;
      opacity: 0.5;
      &.swiper-pagination-bullet-active{
        @include bg_color();
        opacity: 1;
      }
    }
  }
</style>
