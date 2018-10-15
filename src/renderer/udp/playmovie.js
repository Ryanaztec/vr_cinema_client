import client from './index'
import store from '../store/index'
import Vue from 'vue'

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
  client.send(message, 8412, '255.255.255.255', (err, bytes) => {
    if (err) {
      console.log(err)
    } else {
      console.log(message)
    }
  })
}

export default {
  startMovie,
  stopMovie
}
