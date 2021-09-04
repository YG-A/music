<template>
  <div id="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import IScroll from 'iscroll/build/iscroll-probe'
export default {
  name: 'ScrollView',
  mounted () {
    this.iscroll = new IScroll(this.$refs.wrapper, {
      // mouseWheel: true,
      scrollbars: false,
      scrollX: true,
      scrollY: true,
      probeType: 2
    })
    /*
      需求，当页面加载过程中，内容高度不断变化，iscroll会出现bug
           要不断监视iscroll内容的高度的变化，然后刷新iscroll才能解决
    */
    // 1.创建一个观察者对象(推荐)，需要一个回调函数
    const observer = new MutationObserver((mutationList, observe) => {
      this.iscroll.refresh()// 每次监视到目标元素及其变化，都刷新iscroll
    })
    // 2.配置需要观察的内容
    const config = {
      childList: true, // 设为true以监视目标节点【添加】或【删除】新的子节点。（如果 subtree 为 true，则包含子孙节点）
      subtree: true, // 设为true以将监视范围扩展至目标节点整个节点树中的所有节点
      attributeFilter: ['height', 'offsetHeight']// 要监视的特定属性名称的数组
    }
    // 3.指定需要监视的目标元素,和配置对象
    observer.observe(this.$refs.wrapper, config)
  },
  methods: {
    scrolling (fn) {
      this.iscroll.on('scroll', function () {
        fn(this.y, this.x)
      })
    },
    scrollEnd (fn) {
      this.iscroll.on('scrollEnd', function () {
        fn(this.x, this.y)
      })
    },
    scrollTo (x, y, time) {
      this.iscroll.scrollTo(x, y, time)
    }
  }

}
</script>

<style lang="scss" scoped>
  #wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
