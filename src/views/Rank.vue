<template>
  <div class="rank">
    <ScrollView>
      <ul>
        <li v-for="(value, key) in category.titles" :key="key">
          <h3 class="group-title">{{value}}</h3>
          <ul class="normal-group" v-if="value === '官方榜'">
            <li @click="selectItem(item.id)" v-for="(item) in category[key]" :key="item.rank.id">
              <div class="rank-left">
                <img v-lazy="item.rank.coverImgUrl" alt="">
                <p>{{item.rank.updateFrequency}}</p>
              </div>
              <div class="rank-right">
                <p v-for="(song,index) in item.rank.tracks" :key="song.first">
                  {{index+1}}. {{song.first}}-{{song.second}}
                </p>
              </div>
            </li>
          </ul>
          <ul class="other-group" v-else>
            <li @click="selectItem(item.id)" v-for="(item) in category[key]" :key="item.rank.id">
              <div class="rank-top">
                <img v-lazy="item.rank.coverImgUrl" alt="">
                <p>{{item.rank.updateFrequency}}</p>
              </div>
              <div class="rank-bottom">
                <p>{{item.rank.name}}</p>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </ScrollView>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { getTopListDetail } from '../api/index'
import ScrollView from '../components/ScrollView.vue'
export default {
  name: 'Rank',
  components: {
    ScrollView
  },
  data () {
    return {
      category: {}
    }
  },
  methods: {
    selectItem (id) {
      // console.log(id)
      this.$router.push({
        path: '/rank/detail',
        query: {
          id,
          type: 'rank'
        }
      })
    }
  },
  created () {
    getTopListDetail().then((data) => {
      this.category = data
    }).catch((error) => {
      console.log(error)
    })
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/variable.scss";
  @import "../assets/css/mixin.scss";
  .rank{
    position: fixed;
    top: 184px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: pink;
    @include bg_sub_color();
    .group-title{
      padding: 10px 20px;
      @include font_color();
      @include font_size($font_large);
      font-weight: bold;
    }
    .normal-group{
      li{
        display: flex;
        align-items: center;
        padding: 10px 20px;
        box-sizing: border-box;
        .rank-left{
          position: relative;
          img{
            width: 200px;
            height: 200px;
            border-radius: 10px;
          }
          p{
            position:absolute;
            left: 10px;
            bottom: 10px;
            color: #fff;
            @include font_size($font_medium_s);
          }
        }
        .rank-right{
          margin-left: 20px;
          width: 490px;
          p{
            width: 100%;
            @include font_size($font_medium_s);
            @include font_color();
            @include no-wrap();

            padding: 10px 0;
          }
        }
      }
    }
    .other-group{
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      justify-content: center;
      li{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 20px;
        box-sizing: border-box;
        .rank-top{
          position: relative;
          img{
            width: 200px;
            height: 200px;
            border-radius: 10px;
          }
          p{
            position:absolute;
            left: 10px;
            bottom: 10px;
            color: #fff;
            @include font_size($font_medium_s);
          }
        }
        .rank-bottom{
          width: 200px;
          p{
            @include no-wrap();
            @include font_size($font_medium_s);
            @include font_color();
            padding: 10px 0;
          }
        }
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
