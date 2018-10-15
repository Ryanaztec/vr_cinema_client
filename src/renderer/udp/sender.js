import client from './index'
import playMovie from './playmovie'

export const sendMessage = (message, ip, isMain) => {
  if (isMain) {
    // 8412端口中控给其他座椅发送的指令目前只有播放电影
    client.send(message, 8413, ip, function (err, bytes) {
      if (err) {
        console.log('发送数据失败')
      } else {
        console.log(message)
      }
    })
  } else {
    // 8412端口非中控座椅发送的指令分情况
    if (message.type === 'downloading-progress') {
      message = JSON.stringify(message)
      client.send(message, 8413, ip, function (err, bytes) {
        if (err) {
          console.log('发送数据失败')
        }
      })
    } else {
      // 调用设备UDP开始播放影片
      playMovie.startMovie(message.message)
    }
  }
}

export const stopMovie = (ip, isMain) => {
  sendMessage('stop', ip, isMain)
}

export const closeAllSeat = message => {
  client.send(message, 8413, '192.168.0.255', function (err, bytes) {
    if (err) {
      console.log('发送数据失败')
    } else {
      console.log(message)
    }
  })
}

export const downloadMovie = (data, ip) => {
  data = JSON.stringify(data)
  client.send(data, 8413, ip, function (err, bytes) {
    if (err) {
      console.log('发送数据失败')
    }
  })
}

export default {
  sendMessage,
  stopMovie,
  closeAllSeat,
  downloadMovie
}
