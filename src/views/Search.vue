<template>
  <div class="search">
    <div class="search-box">
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNiAyNiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljOWNhIiBkPSJNMjUuMTgxIDIzLjUzNWwtMS40MTQgMS40MTQtNy4zMTUtNy4zMTRBOS45NjYgOS45NjYgMCAwIDEgMTAgMjBDNC40NzcgMjAgMCAxNS41MjMgMCAxMFM0LjQ3NyAwIDEwIDBzMTAgNC40NzcgMTAgMTBjMCAyLjM0Mi0uODExIDQuNDktMi4xNiA2LjE5NWw3LjM0MSA3LjM0ek0xMCAyYTggOCAwIDEgMCAwIDE2IDggOCAwIDAgMCAwLTE2eiIvPjwvc3ZnPg==" alt="">
      <input v-debounce="search" type="text" placeholder="搜索歌曲、歌手、专辑" v-model="keywords">
      <div class="del" @click="cancel" v-show="keywords!==''">X</div>
    </div>
    <SearchSuggest v-show="keywords!==''" :allMatch="allMatch"></SearchSuggest>
    <div class="hot-search">
      <h3>热门搜索</h3>
      <ul>
        <li @click="selectSuggest(item)" v-for="(item,index) in hotSearch" :key="index">{{index+1}} - {{item.first}}</li>
      </ul>
    </div>
    <div class="history-search" v-show="historySearch.length > 0">
      <h3>历史</h3>
      <ScrollView ref="scrollView">
        <ul ref="historyList">
          <li @click="selectHistory(item)" ref="historyItem" v-for="item in historySearch" :key="item">{{item}}</li>
        </ul>
      </ScrollView>
      <div class="del" @click.stop="clearHistory">清空</div>
    </div>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import SearchSuggest from '../components/Search/SearchSuggest.vue'
import ScrollView from '../components/ScrollView.vue'
import { getSearchSuggest, getHotSearch } from '../api/index'
import { mapState } from 'vuex'
export default {
  name: 'Search',
  components: {
    SearchSuggest, ScrollView
  },
  data () {
    return {
      keywords: '',
      isShowList: true,
      timerId: null,
      allMatch: [],
      hotSearch: []
    }
  },
  computed: {
    ...mapState(['historySearch'])
  },
  methods: {
    search () {
      if (this.keywords.trim() !== '') {
        getSearchSuggest({ keywords: this.keywords }).then((data) => {
          this.allMatch = data.result.allMatch
        }).catch((error) => {
          console.log(error + '搜索的东西不存在')
        })
      }
    },
    selectSuggest (item) {
      this.$store.commit('changeHistorySearch', item.first)
      this.$router.push({
        path: '/search/detail',
        query: {
          type: 'search',
          songsType: item.iconType,
          keywords: item.first
        }
      })
    },
    selectHistory (item) {
      this.$router.push({
        path: '/search/detail',
        query: {
          type: 'search',
          songsType: 1,
          keywords: item
        }
      })
    },
    cancel () {
      this.keywords = ''
    },
    calculatedWidth () {
      // console.log(Math.round(parseFloat(getComputedStyle(this.$refs.historyItem[0]).margin)))
      const mg = Math.round(parseFloat(getComputedStyle(this.$refs.historyItem[0]).margin)) * 2
      let total = 0
      this.$refs.historyItem.forEach((item) => {
        total += (item.offsetWidth + mg)
      })
      this.$refs.historyList.style.width = total + 'px'
      this.$refs.scrollView.iscroll.refresh()
    },
    clearHistory () {
      this.$store.commit('clearHistorySearch')
    }
  },
  directives: {
    debounce (element, binding) {
      element.addEventListener('input', function () {
        this.timerId && clearTimeout(this.timerId)
        this.timerId = setTimeout(() => {
          binding.value()
        }, 500)
      })
    }
  },
  watch: {
    historySearch (newVal) {
      localStorage.setItem('historySearch', JSON.stringify(newVal))
      this.$nextTick(() => {
        this.calculatedWidth()
      })
    }
  },
  created () {
    getHotSearch().then((data) => {
      this.hotSearch = data.result.hots
    }).catch((error) => {
      console.log(error)
    })
  },
  mounted () {
    this.calculatedWidth()
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/css/mixin.scss';
  @import '../assets/css/variable.scss';
  .search{
    position: fixed;
    left: 0;
    right: 0;
    top: 184px;
    bottom: 0;
    @include bg_sub_color();
    .search-box{
      display: flex;
      align-items: center;
      margin: 40px 20px;
      background:#ebecec;
      border-radius: 30px;
      height: 60px;
      img{
        width: 40px;
        height: 40px;
        margin: 0 20px;
      }
      input{
        border: none;
        outline: none;
        flex-grow: 1;
        background-color: transparent;
        @include font_size($font_medium);
      }
      .del{
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        @include font_size($font_medium);
        background-color: pink;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
    .hot-search{
      h3{
        @include font_color();
        @include font_size($font_medium);
        padding: 10px 20px;
      }
      border-bottom: 1px solid #ccc;
      ul{
        display: flex;
        flex-wrap: wrap;
        li{
          height: 60px;
          line-height: 60px;
          border: 1px solid #000;
          border-radius: 30px;
          padding: 0 20px;
          margin: 10px 20px;
          @include font_color();
          @include font_size($font_medium_s);
          @include border_color()
        }
      }
    }
  }
  .history-search{
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    h3{
      @include font_color();
      @include font_size($font_medium);
      padding: 10px 20px;
      flex-shrink: 0;
    }
    .del{
      @include font_color();
      @include font_size($font_medium);
      padding: 10px 20px;
      flex-shrink: 0;
    }
    ul{
      display: flex;
      // overflow-x: scroll;
      li{
        flex-shrink: 0;
        height: 60px;
        line-height: 60px;
        border: 1px solid #000;
        border-radius: 30px;
        padding: 0 20px;
        margin: 10px;
        @include font_color();
        @include font_size($font_medium_s);
        @include border_color()
      }
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
