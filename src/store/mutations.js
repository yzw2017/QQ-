import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING](state, boolean) {
    state.playing = boolean
  },
  [types.SET_FULLSCREEN](state, boolean) {
    state.fullScreen = boolean
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCELIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAYMODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENTINDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_TOPLIST](state, topList) {
    state.topList = topList
  },
  [types.SET_SEARCHHISTORY](state, history) {
    state.searchHistory = history
  },
  [types.SET_PLAYHISTORY](state, history) {
    state.playHistory = history
  },
  [types.SET_FAVORITELIST](state, list) {
    state.favoriteList = list
  }
}

export default mutations