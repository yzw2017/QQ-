<template>
  <scroll :pullup="pullup" 
          :data="result" 
          @scrollToEnd="searchMore"
          ref="suggest"
          :before-scroll="beforeScroll"
          @beforeScroll="listScroll"
          class="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" :title="''"></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="Sorry, no-result"></no-result>
    </div>
  </scroll>
</template>

<script>
  import {search} from 'api/search'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import NoResult from 'base/no-result/no-result'

  const perpage = 20

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasMore: true,
        beforeScroll: true
      }
    },
    methods: {
      async search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        let res = await search(this.query, this.page, this.showSinger, perpage)
        this.result = this._genResult(res.data)
        this._checkMore(res.data)
      },
      _genResult(data) {
        let ret = []
        if(data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida,...{type:'singer'}})
        }
        if(data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if(musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      getIconCls(item) {
        if(item.type === 'singer') {
          return 'icon-mine'
        }else{
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if(item.type === 'singer'){
          return item.singername
        }else{
          return `${item.name}-${item.singer}`
        }
      },
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      searchMore() {
        if(!this.hasMore) {
          return
        }
        this.page++
        setTimeout(async () => {
          let res = await search(this.query,this.page,this.showSinger, perpage)
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data)
        }, 1000)
      },
      selectItem(item) {
        if(item.type === 'singer') {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({path: `/search/${singer.id}`})
          this.SET_SINGER(singer)
        }else{
          this.insertSong(item)
        }
        this.$emit('select')
      },
      listScroll() {
        this.$emit('listScroll')
      },
      refresh() {
        this.$refs.suggest.refresh()
      },
      ...mapMutations([
        'SET_SINGER'
      ]),
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      Scroll,
      Loading,
      NoResult
    },
    watch: {
      query() {
        this.search()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  
  .suggest
    height 100%
    overflow hidden
    .suggest-list
      padding 0 30px
      .suggest-item
        display flex
        align-items center
        padding-bottom 20px
      .icon
        flex 0 0 30px
        width 30px
        [class^="icon-"]
          font-size 14px
          color #31C27C
      .name
        flex 1
        font-size $font-size-medium
        color $color-text-d
        overflow hidden
        .text
          no-wrap()
    .no-result-wrapper
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>