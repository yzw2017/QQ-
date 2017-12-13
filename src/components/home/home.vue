<template>
  <div class="home" ref="home">
    <scroll :data="HomeList" ref="scroll" class="home-content">
      <div>
        <div v-if="slider.length" class="slide-wrapper">
          <div class="slide-content">
            <slide>
              <li v-for="item in slider">
                <a :href="item.linkUrl">
                  <img class="needsclick" @load="loadImage" :src="item.picUrl">
                </a>
              </li>
            </slide>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单</h1>
          <ul>
            <li @click="selectItem(item)" v-for="item in HomeList" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-show="!HomeList.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
    <router-view/>
  </div>
</template>

<script>
  import {getSlide,getHomeList} from 'api/home'
  import Slide from 'base/slide/slide'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'
  export default {
    mixins: [playlistMixin],
    created() {
      setTimeout(() => {
        this._getHomeList()
      }, 500)
      this._getSlide()
    },
    data() {
      return {
        slider: [],
        HomeList: []
      }
    },
    methods: {
      async _getSlide() {
        let res = await getSlide()
        this.slider = res.data.slider
      },
      async _getHomeList() {
        let res = await getHomeList()
        this.HomeList = res.data.list
      },
      loadImage() {
        if(!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      },
      selectItem(item) {
        this.$router.push({path: `/home/${item.dissid}`})
        this.SET_DISC(item)
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.home.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      ...mapMutations([
        'SET_DISC'
      ])
    },
    components: {
      Slide,
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" scoped>

  .home
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .home-content
      height: 100%
      overflow: hidden
      .slide-wrapper
        position: relative
        width: 100%
        height: 0
        padding-top: 40%
        overflow: hidden
        .slide-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex: 1
            flex-direction: column
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>