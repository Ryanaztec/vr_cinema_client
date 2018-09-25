import client from './index'

export const sendMessage = (message, ips, isMain) => {
  console.log(ips)
  if (isMain) {
    ips.forEach((item, index) => {
      client.send(message, 8412, item, function (err, bytes) {
        if (err) {
          console.log('发送数据失败')
        } else {
          console.log(message)
        }
      })
    })
  } else {
    client.send(message, 8412, '255.255.255.255', function (err, bytes) {
      if (err) {
        console.log('发送数据失败')
      } else {
        console.log(message)
      }
    })
  }
}

export const stopMovie = (ips, isMain) => {
  sendMessage('stop', ips, isMain)
}

export const closeAllSeat = message => {
  client.send(message, 8412, '192.168.0.255', function (err, bytes) {
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
