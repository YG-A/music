<template>
  <div id="app">
    <Header></Header>
    <TabBar></TabBar>
    <keep-alive :include="['Singer','Search']">
      <router-view></router-view>
    </keep-alive>
    <Player></Player>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import TabBar from './components/TabBar.vue'
import Player from './views/Player'

export default {
  name: 'App',
  components: {
    Header, TabBar, Player
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  @import './assets/css/variable.scss';
</style>
