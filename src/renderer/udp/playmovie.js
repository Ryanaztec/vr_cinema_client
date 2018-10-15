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
  client.send('stop', 8412, '255.255.255.255', function (err, bytes) {
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
  client.send(msg, 0, msg.length, 8412, '255.255.255.255')
}

export default {
  startMovie,
  stopMovie
}
