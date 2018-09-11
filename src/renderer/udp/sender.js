import client from './index'

export const sendMessage = message => {
  console.log(client)
  client.send(message, 8412, '255.255.255.255', function (err, bytes) {
    if (err) {
      console.log('发送数据失败')
    } else {
      console.log(message)
    }
  })
}

export const stopMovie = () => {
  sendMessage('stop')
}

export default {
  sendMessage,
  stopMovie
}
