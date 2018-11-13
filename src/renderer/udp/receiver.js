import store from '../store/index'
import Vue from 'vue'
import playMovie from './playmovie'
import Sender from './sender'
import API from '../service/api'

const dgrm = require('dgram')
const server = dgrm.createSocket('udp4')

server.on('message', function (message, rinfo) {
  let sendingMessage = ''
  let type = ''
  try {
    sendingMessage = JSON.parse(message)
    type = sendingMessage.type
    console.log(sendingMessage)
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
        let mainSeatIp = store.state.seat.mainSeat.ip_address
        // 调用设备UDP开始播放影片
        playMovie._startMovie(sendingMessage.message).then(() => {
          // 插入播放记录
          API.storePlayRecord({
            seats: sendingMessage.data.id,
            cinema_id: sendingMessage.data.cinema_id,
            movie_id: sendingMessage.data.movie.movie_id
          }).then(response => {
            // 插入播放电影的store
            sendingMessage.data.playingStarted = true
            sendingMessage.data.play_start_time = response.data.data.play_start_time
            store.commit('ADD_PLAYING_SEATS', sendingMessage.data)
            // 像中控发送指令，已经开始播放
            sendingMessage.type = 'playing-started'
            Sender.sendMessage(JSON.stringify(sendingMessage), mainSeatIp, false)
          })
        })
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
    case 'playing-started':
      const data = sendingMessage.data
      store.commit('UPDATE_PLAYING_SEATS', data)
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
