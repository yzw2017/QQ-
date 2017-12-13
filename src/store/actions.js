import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

const actions = {
  selectPlay: ({commit}, {list, index}) => {
    commit(types.SET_PLAYING, true)
    commit(types.SET_FULLSCREEN, true)
    commit(types.SET_PLAYLIST, list)
    commit(types.SET_SEQUENCELIST, list)
    commit(types.SET_CURRENTINDEX, index)
  },
  randomPlay({commit},{list}) {
    commit(types.SET_PLAYING, true)
    commit(types.SET_FULLSCREEN, true)
    commit(types.SET_PLAYMODE, playMode.random)
    commit(types.SET_SEQUENCELIST, list)
    commit(types.SET_PLAYLIST, [...list].sort(() => 0.5 - Math.random()))
    commit(types.SET_CURRENTINDEX, 0)
  },
  insertSong({commit, state}, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    /* 记录当前歌曲 */
    let currentSong = playlist[currentIndex]
    /* 查找当前歌曲是否已经存在 */
    let fpIndex = findIndex(playlist, song)
    /* 插入歌曲索引+1 */
    currentIndex++
    /* 插入歌曲 */
    playlist.splice(currentIndex, 0, song)
    /* 如果已经存在这首歌 */
    if(fpIndex > -1) {
      /* 如果当前插入的序号大于列表中的序号 */
      if(currentIndex > fpIndex) {
        playlist.splice(fpIndex, 1)
        currentIndex--
      }else{
        playlist.splice(fpIndex + 1, 1)
      }
    }

    /* sequenceList同样的套路 */

    let currentSIndex = findIndex(sequenceList, currentSong) + 1

    let fsIndex = findIndex(sequenceList, song)

    sequenceList.splice(currentSIndex, 0, song)

    if(fsIndex > -1) {
      if(currentSIndex > fsIndex) {
        sequenceList.splice(fsIndex, 1)
      }else{
        sequenceList.splice(fsIndex + 1, 1)
      }
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCELIST, sequenceList)
    commit(types.SET_CURRENTINDEX, currentIndex)
    commit(types.SET_PLAYING, true)
    commit(types.SET_FULLSCREEN, true)
  },
  deleteSong({commit, state,}, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)

    if(currentIndex > pIndex || currentIndex === playlist.length) {
      currentIndex--
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCELIST, sequenceList)
    commit(types.SET_CURRENTINDEX, currentIndex)

    const playingState = playlist.length > 0
    commit(types.SET_PLAYING, playingState)
  },
  saveSearchHistory({commit}, query) {
    commit(types.SET_SEARCHHISTORY, saveSearch(query))
  },
  deleteSearchHistory({commit}, query) {
    commit(types.SET_SEARCHHISTORY, deleteSearch(query))
  },
  deleteSongList({commit}) {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCELIST, [])
    commit(types.SET_CURRENTINDEX, -1)
    commit(types.SET_PLAYING, false)
  },
  clearSearchHistory({commit}) {
    commit(types.SET_SEARCHHISTORY, clearSearch())
  },
  savePlayHistory({commit}, song) {
    commit(types.SET_PLAYHISTORY, savePlay(song))
  },
  saveFavoriteList({commit}, song) {
    commit(types.SET_FAVORITELIST, saveFavorite(song))
  },
  deleteFavoriteList({commit}, song) {
    commit(types.SET_FAVORITELIST, deleteFavorite(song))
  }
}

export default actions