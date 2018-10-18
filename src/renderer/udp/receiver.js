import store from '../store/index'
import Vue from 'vue'
import playMovie from './playmovie'

const dgrm = require('dgram')
const server = dgrm.createSocket('udp4')

server.on('message', function (message, rinfo) {
  let sendingMessage = ''
  let type = ''
  try {
    sendingMessage = JSON.parse(message)
    type = sendingMessage.type
    console.log(type)
  } catch (e) {
    sendingMessage = message
  }
  switch (type) {
    case 'login':
      localStorage.token = sendingMessage.token
      store.commit('SET_TOKEN', sendingMessage.token)
      store.commit('SET_MAIN_SEAT', false)
      store.dispatch('getMacAddress')
      store.dispatch('GetInfo')
      Vue.notify({
        group: 'foo',
        text: '登录成功'
      })
      break
    case 'logout':
      // 下级座椅登出
      store.dispatch('FedLogOut')
      Vue.notify({
        group: 'foo',
        text: '已登出'
      })
      break
    case 'downloading-progress':
      if (store.state.seat.isMain) {
        // 其他座椅的下载进度
        store.commit('SET_SUB_SEAT_DOWNLOADING_STATUS', sendingMessage)
      }
      break
    case 'playing-movie':
      if (!store.state.seat.isMain) {
        // 调用设备UDP开始播放影片
        playMovie.startMovie(sendingMessage.message)
        // 插入播放电影的store
        store.commit('ADD_PLAYING_SEATS', sendingMessage.data)
      }
      break
    case 'stop':
      if (!store.state.seat.isMain && store.state.public.ip_address !== rinfo.address) {
        // 停止播放电影
        playMovie.stopMovie()
      }
      break
    case 'download-movie':
      if (!store.state.seat.isMain) {
        // 检查当前电影是否正在下载中
        let flag = true
        store.state.movie.downloadingMovies.forEach((item, index) => {
          if (item.movie_id === sendingMessage.movie_id) {
            flag = false
          }
        })
        if (flag) {
          store.dispatch('oss_downloadMovie', sendingMessage)
        }
      }
      break
    case 'shutdown':
      if (!store.state.seat.isMain) {
        var process = require('child_process')
        process.exec('shutdown -s -t 10')
      }
      break
    default:
      break
  }
})
server.bind(8413)
