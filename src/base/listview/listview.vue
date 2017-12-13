<template>
  <scroll :probe-type="probeType" 
          :listen-scroll="listenScroll" 
          :data="data" 
          ref="listview" 
          @scroll="scroll"
          class="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div @touchstart.stop.prevent="touchstart" @touchmove.stop.prevent="touchmove" class="fastclick">
      <ul>
        <li v-for="(item,index) in fastclick" :class="{'current': currentIndex === index}" :data-index="index" class="item">{{item}}</li>
      </ul>
    </div>
    <div class="fixed" ref="fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'

  const LI_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    created() {
      this.touch = {}
      this.listenScroll = true
      this.probeType = 3
      this.listHeight = []
    },
    data() {
      return {
        currentIndex: 0,
        scrollY: -1,
        diff: -1
      }
    },
    computed: {
      fastclick() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if(this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      touchstart(e) {
        let clickIndex = e.target.getAttribute('data-index')
        this.touch.y1 = e.touches[0].pageY
        this.touch.clickIndex = clickIndex
        this._scrollTo(clickIndex)
      },
      touchmove(e) {
        this.touch.y2 = e.touches[0].pageY
        let change = this.touch.y2 - this.touch.y1
        let changeIndex = Math.floor(change / LI_HEIGHT)
        let newIndex = parseInt(this.touch.clickIndex) + changeIndex
        this._scrollTo(newIndex)
      },
      _scrollTo(index) {
        if(!index && index!==0) {
          return
        }
        if(index < 0) {
          index = 0
        }else if(index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _resetHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for(let i=0;i<list.length;i++) {
          height += list[i].clientHeight
          this.listHeight.push(height)
        }
      },
      selectItem(item) {
        this.$emit('select', item)
      },
      refresh() {
        this.$refs.listview.refresh()
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._resetHeight()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        /* 当滚动到顶部, newY > 0 */
        if(newY > 0) {
          this.currentIndex = 0
          return
        }
        /* 在中间部分滚动 */
        for(let i=0;i < listHeight.length - 1;i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if(-newY>=height1 && -newY<height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        /* 滚动到底部，且-newY大于最后一个元素上限 */
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if(this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="stylus" scoped>
  
  .listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background $color-background
    .list-group
      padding-bottom 20px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          width 50px
          height 50px
          border-radius 50%
        .name
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium
    .fastclick
      position absolute
      right 0
      top 50%
      transform translateY(-50%)
      z-index 30
      width 20px
      padding 20px 0
      border-radius 10px
      background #2D2F33
      .item
        padding 3px
        line-height 1
        color $color-text-l
        text-align center
        font-size $font-size-small
        &.current
          color yellow
    .fixed
      position absolute
      top 0
      left 0
      width 100%
      .fixed-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
</style>