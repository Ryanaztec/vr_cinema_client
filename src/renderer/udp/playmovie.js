import store from '../store/index'
import Vue from 'vue'

const dgram = require('dgram')
const client = dgram.createSocket('udp4')

client.bind(function () {
  client.setBroadcast(true)
})

client.on('close', () => {
  console.log('socket已关闭')
})

client.on('error', (err) => {
  console.log(err)
})

export const stopMovie = () => {
  client.send('stop', 52427, store.state.public.ip_address, function (err, bytes) {
    if (err) {
      console.log(err)
    }
  })
  store.commit('SET_PLAYING_SEATS', [])
  Vue.notify({
    group: 'foo',
    text: '播放停止'
  })
}

export const startMovie = message => {
  let msg = Buffer.from(message)
  client.send(msg, 0, msg.length, 52427, store.state.public.ip_address)
}

// 本机发送播放电影指令的异步方法
export const _startMovie = message => {
  let p = new Promise((resolve, reject) => {
    let msg = Buffer.from(message)
    // 座椅播放电影
    client.send(msg, 0, msg.length, 52427, store.state.public.ip_address)
    resolve()
  })
  return p
}

export default {
  startMovie,
  stopMovie,
  _startMovie
}
