<template>
  <div class="search-suggest">
    <ScrollView>
      <ul>
        <li v-for="(item,index) in allMatch" :key="index" @click.stop="selectSuggest(item)">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNiAyNiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljOWNhIiBkPSJNMjUuMTgxIDIzLjUzNWwtMS40MTQgMS40MTQtNy4zMTUtNy4zMTRBOS45NjYgOS45NjYgMCAwIDEgMTAgMjBDNC40NzcgMjAgMCAxNS41MjMgMCAxMFM0LjQ3NyAwIDEwIDBzMTAgNC40NzcgMTAgMTBjMCAyLjM0Mi0uODExIDQuNDktMi4xNiA2LjE5NWw3LjM0MSA3LjM0ek0xMCAyYTggOCAwIDEgMCAwIDE2IDggOCAwIDAgMCAwLTE2eiIvPjwvc3ZnPg==" alt="">
          <p>{{item.keyword}}</p>
        </li>
      </ul>
    </ScrollView>
  </div>
</template>
<script>
import ScrollView from '../../components/ScrollView.vue'
export default {
  name: 'SearchSuggest',
  components: {
    ScrollView
  },
  props: ['allMatch'],
  methods: {
    selectSuggest (item) {
      this.$store.commit('changeHistorySearch', item.keyword)
      this.$router.push({
        path: '/search/detail',
        query: {
          type: 'search',
          songsType: item.type,
          keywords: item.keyword
        }
      })
      console.log(item)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  @import '../../assets/css/variable.scss';

  .search-suggest{
    position: fixed;
    left: 0;
    right: 0;
    top: 324px;
    bottom: 0;
    overflow: hidden;
    z-index: 1;
    @include bg_sub_color();
    li{
      display: flex;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #ccc;
      img{
        width: 40px;
        height: 40px;
        margin: 0 20px;
      }
      p{
        @include font_color();
        @include font_size($font_medium);
      }
    }
  }
</style>
