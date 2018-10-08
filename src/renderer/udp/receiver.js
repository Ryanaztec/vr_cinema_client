import store from '../store/index'
import Vue from 'vue'

const dgrm = require('dgram')
const server = dgrm.createSocket('udp4')

server.on('message', function (message, rinfo) {
  // console.log('已收到客户端发送的数据：' + message)
  // console.log('客户端地址信息为&j', rinfo)
  let sendingMessage = ''
  let type = ''
  // 判断指令类型
  try {
    sendingMessage = JSON.parse(message)
    type = sendingMessage.type
  } catch (e) {
    sendingMessage = message
  }
  if (type === 'login') {
    // 下级座椅登录
    localStorage.token = sendingMessage.token
    store.commit('SET_TOKEN', sendingMessage.token)
    store.commit('SET_MAIN_SEAT', false)
    store.dispatch('getMacAddress')
    store.dispatch('GetInfo')
    Vue.notify({
      group: 'foo',
      text: '登录成功'
    })
  } else if (type === 'logout') {
    // 下级座椅登出
    store.dispatch('FedLogOut')
    Vue.notify({
      group: 'foo',
      text: '已登出'
    })
  } else if (store.state.seat.isMain && type === 'downloading-progress') {
    // 其他座椅的下载进度
    store.commit('SET_SUB_SEAT_DOWNLOADING_STATUS', sendingMessage)
  } else if (!store.state.seat.isMain && type === 'playing-movie') {
    // 子座椅显示播放进度
    server.send(sendingMessage.message, 8412, '255.255.255.255', (err, bytes) => {
      if (err) {
        console.log('发送数据失败')
      } else {
        console.log(sendingMessage.message)
      }
    })
    store.commit('ADD_PLAYING_SEATS', sendingMessage.data)
    Vue.notify({
      group: 'foo',
      text: sendingMessage.message
    })
  } else if (!store.state.seat.isMain && store.state.public.ip_address !== rinfo.address) {
    server.send(sendingMessage, 8412, '255.255.255.255', function (err, bytes) {
      if (err) {
        console.log('发送数据失败')
      } else {
        console.log(sendingMessage)
      }
    })
  }
})

server.on('listening', function () {
  var address = server.address()
  console.log('server listening ' + address.address + ':' + address.port)
})

server.bind(8412)

// 接收下载影片的指令
const downloadCommand = dgrm.createSocket('udp4')

downloadCommand.on('message', function (message, rinfo) {
  message = JSON.parse(message)
  // 检查当前电影是否正在下载中
  let flag = true
  store.state.movie.downloadingMovies.forEach((item, index) => {
    if (item.movie_id === message.movie_id) {
      flag = false
    }
  })
  if (flag) {
    store.dispatch('downloadMovie', message)
  }
})

downloadCommand.bind(8413)

// 接收关闭所有主机的指令
const closeAllSeatCommand = dgrm.createSocket('udp4')
closeAllSeatCommand.on('message', function (message, rinfo) {
  if (!store.state.seat.isMain) {
    var process = require('child_process')
    process.exec('shutdown -s -t 10')
  }
})

closeAllSeatCommand.bind(8414)
