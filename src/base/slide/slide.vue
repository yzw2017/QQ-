<template>
  <div class="slide" ref="slide">
    <ul class="slide-group" ref="slideGroup">
      <slot></slot>
    </ul>
    <div v-if="showDot" class="dots">
      <span v-for="(item,index) in dots" :class="{'active':currentPageIndex === index}" class="dot"></span>
    </div>
  </div>
</template>

<script>
  import {addClass} from 'common/js/dom'
  import BScroll from 'better-scroll'
  export default {
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      },
      showDot: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._setSlideWidth()
        if(this.showDot) {
          this._initDots()
        }
        this._initSlide()
        if(this.autoPlay) {
          this._play()
        }
      })

      window.addEventListener('resize', () => {
        if (!this.slide || !this.slide.enabled) {
          return
        }
        clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => {
          if (this.slide.isInTransition) {
            this._onScrollEnd()
          } else {
            if (this.autoPlay) {
              this._play()
            }
          }
          this.refresh()
        }, 60)
      })
    },
    methods: {
      _setSlideWidth(isResize) {
        this.children = this.$refs.slideGroup.children
        let slideWidth = this.$refs.slide.clientWidth
        let width = 0
        for(let i=0;i<this.children.length;i++) {
          width += slideWidth
          let child = this.children[i]
          addClass(child,'slide-item')
          child.style.width = slideWidth + 'px'
        }
        if(this.loop && !isResize) {
          width += 2 * slideWidth
        }
        this.$refs.slideGroup.style.width = width + 'px'
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _initSlide() {
        this.slide = new BScroll(this.$refs.slide, {
          scrollX: true,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        })

        this.slide.on('scrollEnd', this._onScrollEnd)

        this.slide.on('touchend', () => {
          if(this.autoPlay) {
            this._play()
          }
        })

        this.slide.on('beforeScrollStart', () => {
          if(this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _onScrollEnd() {
        let pageIndex = this.slide.getCurrentPage().pageX
        if(this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex
        if(this.autoPlay) {
          this._play()
        }
      },
      _play() {
        let pageIndex = this.slide.getCurrentPage().pageX + 1
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slide.goToPage(pageIndex, 0, 1000)
        }, this.interval)
      },
      refresh() {
        this._setSlideWidth(true)
        this.slide.refresh()
      }
    },
    activated() {
      if(!this.slide) {
        return
      }
      this.slide.enable()
      let pageIndex = this.slide.getCurrentPage().pageX
      if(pageIndex > this.dots.length) {
        pageIndex = pageIndex % this.dots.length
      }
      this.slide.goToPage(pageIndex, 0)
      if(this.loop) {
        pageIndex -= 1
      }
      this.currentPageIndex = pageIndex
      if(this.autoPlay) {
        this._play()
      }
    },
    deactivated() {
      this.slide.disable()
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      this.slide.disable()
      clearTimeout(this.timer)
    }
  }
</script>

<style lang="stylus" scoped>

  .slide
    min-height: 1px
    .slide-group
      position: relative
      overflow: hidden
      .slide-item
        float: left
        a
          display: block
          width: 100%
          height: 100%
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 10px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>