<template>
  <transition name="slide">
    <music-list :title="title" :songs="songs" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'
  export default {
    created() {
      this._getDetail()
    },
    data() {
      return {
        songs: []
      }
    },
    methods: {
      async _getDetail() {
        if(!this.singer.id) {
          this.$router.push({path: '/singer'})
          return
        }
        let res = await getSingerDetail(this.singer.id)
        this.songs = this._normalizeSongs(res.data.list)
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if(musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" scoped>

  &.slide-enter-active, &.slide-leave-active
    transition all 0.5s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)

</style>