import client from './index'
import playMovie from './playmovie'

export const sendMessage = (message, ip, isMain) => {
  if (isMain) {
    // 8412端口中控给其他座椅发送的指令目前只有播放电影
    client.send(message, 8413, ip, function (err, bytes) {
      if (err) {
        console.log('发送数据失败')
      }
    })
  } else {
    // 8412端口非中控座椅发送的指令分情况
    message = JSON.parse(message)
    if (message.type === 'downloading-progress') {
      client.send(JSON.stringify(message), 8413, ip, function (err, bytes) {
        if (err) {
          console.log('发送数据失败')
        }
      })
    } else {
      // 调用设备UDP开始播放影片
      console.log(message.message)
      playMovie.startMovie(message.message)
    }
  }
}

export default {
  sendMessage
}
