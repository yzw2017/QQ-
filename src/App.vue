<template>
  <div id="app">
    <m-header></m-header>
    <nav class="tab">
      <router-link class="tab-item" to="/home"><span class="tab-link">推荐</span></router-link>
      <router-link class="tab-item" to="/singer"><span class="tab-link">歌手</span></router-link>
      <router-link class="tab-item" to="/rank"><span class="tab-link">排行</span></router-link>
      <router-link class="tab-item" to="/search"><span class="tab-link">搜索</span></router-link>
    </nav>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header'
  import Player from 'components/player/player'
  export default {
    components: {
      MHeader,
      Player
    }
  }
</script>

<style lang="stylus" scoped>
  
  .tab
    display flex
    height 44px
    line-height 44px
    font-size $font-size-medium
    .tab-item
      flex 1
      text-align center
      .tab-link
        padding-bottom 5px
        color $color-text-l
      &.router-link-active
        .tab-link
          color $color-theme
          border-bottom 2px solid $color-theme
</style>
