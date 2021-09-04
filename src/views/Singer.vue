<template>
  <div class="singer">
    <ScrollView ref="scrollView">
      <div class="list-wrapper">
        <SingItem ref="singItem" v-for="(item, index) in list" :item="item" :title="keys[index]" :key="index"></SingItem>
      </div>
    </ScrollView>
    <ul class="list-keys">
      <li :class="{'active':curIndex===index}" v-for="(key,index) in keys" :key="index" @touchstart.stop.prevent="touchstart($event,index)" @touchmove.stop.prevent="touchmove($event,index)">{{key}}</li>
    </ul>
    <div class="fix-title" v-show="isShowFixTitle" ref="fixTitle">{{keys[curIndex]}}</div>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { getAllArtists } from '../api/index'
import ScrollView from '../components/ScrollView.vue'
import SingItem from '../components/singer/SingItem.vue'

export default {
  name: 'Singer',
  components: {
    ScrollView, SingItem
  },
  data () {
    return {
      keys: [],
      list: [],
      itemOffsetTop: [],
      curIndex: 0,
      touchDownOffset: 0,
      touchDownIndex: 0,
      moveOffset: 0,
      scrollY: 0,
      fixTitleHeight: 0
    }
  },
  methods: {
    touchstart ($event, index) {
      this.curIndex = index
      this.touchDownIndex = index
      this.touchDownOffset = $event.targetTouches[0].pageY
      this.$refs.scrollView.iscroll.scrollTo(0, -this.itemOffsetTop[this.curIndex], 500)
    },
    touchmove ($event) {
      const offsetY = Math.floor(($event.targetTouches[0].pageY - this.touchDownOffset) / $event.target.offsetHeight)
      this.curIndex = this.touchDownIndex + offsetY
      if (this.curIndex > 26) {
        this.curIndex = 26
      } else if (this.curIndex < 0) {
        this.curIndex = 0
      }
      this.$refs.scrollView.iscroll.scrollTo(0, -this.itemOffsetTop[this.curIndex], 500)
    }
  },
  created () {
    getAllArtists().then((response) => {
      this.keys = response.keys
      this.list = response.list
    }).catch((error) => {
      console.log(error)
    })
  },
  mounted () {
    this.$refs.scrollView.scrolling((y) => {
      this.scrollY = y
      const offsetY = -y
      let index = this.itemOffsetTop.findIndex((item) => {
        if (offsetY < item) {
          return true
        }
      })
      index = index === 0 ? index : index - 1
      this.curIndex = index

      // title离顶部的距离
      const diffOffsetY = this.itemOffsetTop[this.curIndex + 1] + y
      // title移动的距离
      let fixTitleOffsetY = 0
      // 判断title离顶部的距离是否在固定头部的范围内
      if (diffOffsetY >= 0 && diffOffsetY <= this.fixTitleHeight) {
        fixTitleOffsetY = diffOffsetY - this.fixTitleHeight// 需要滚动，则计算给予滚动距离
      } else {
        fixTitleOffsetY = 0// 不需要滚动
      }
      if (fixTitleOffsetY === this.fixTitleOffsetY) { // 说明title已经滚动出去，不需要再滚动
        return
      }
      this.fixTitleOffsetY = fixTitleOffsetY
      this.$refs.fixTitle.style.transform = `translateY(${fixTitleOffsetY}px)`// 移动操作
    })
  },
  computed: {
    isShowFixTitle () {
      return this.scrollY < 0
    }
  },
  watch: {
    list () {
      this.$nextTick(() => {
        this.$refs.singItem.forEach((item) => {
          this.itemOffsetTop.push(item.$el.offsetTop)
        })
      })
    },
    isShowFixTitle () {
      this.$nextTick(() => {
        this.fixTitleHeight = this.$refs.fixTitle.offsetHeight
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/css/mixin.scss';
  @import '../assets/css/variable.scss';
  .singer{
    position: fixed;
    top: 184px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    @include bg_sub_color();
    .list-keys{
      position: fixed;
      right: 0;
      top: 244px;
      // transform: translateY(-50%);
      margin-right: 10px;
      li{
        @include font_color();
        @include font_size($font_medium_s);
        height: 40px;
        line-height: 40px;
        &.active{
          // text-shadow: 0 0 10px 5px black;
          text-shadow: 1px 1px 2px red, 0 0 1px blue, 0 0 0.2em blue;
        }
      }
    }
    .fix-title{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      @include bg_color();
      @include font_size($font_medium);
      color: #fff;
      padding: 10px 20px;
      box-sizing: border-box;
    }
  }
  .v-enter,.v-leave-to{
    transform: translateX(-100%);
  }
  .v-enter-to,.v-leave{
    transform: translateX(0%);
  }
  .v-enter-active,.v-leave-active{
    transition: transform 0.5s;
  }
</style>
