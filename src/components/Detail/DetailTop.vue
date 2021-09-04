<template>
  <div class="detail-top" ref="detailTop">
    <div class="img-container">
      <img :src="imgSrc" alt="">
      <div class="mask" ref="mask"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailTop',
  props: ['imgSrc'],
  mounted () {
    this.$emit('get-height', this.$refs.detailTop.offsetHeight)
  },
  methods: {
    changeMask (opacity) {
      console.log(opacity)
      this.$refs.mask.style.opacity = opacity
    }
  }
}
</script>

<style lang='scss' scoped>
  .detail-top{
    .img-container{
      width: 100%;
      height: 500px;
      overflow: hidden;
      position: relative;
      img{
        width: 100%;
      }
      .mask{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0;
      }
    }
  }
</style>
