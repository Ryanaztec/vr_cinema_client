import store from '../store/index'

const dgrm = require('dgram')
const server = dgrm.createSocket('udp4')

server.on('message', function (message, rinfo) {
  console.log('已收到客户端发送的数据：' + message)
  console.log('客户端地址信息为&j', rinfo)
  if (!store.state.seat.isMain && store.state.public.ip_address !== rinfo.address) {
    server.send(message, 8412, '255.255.255.255', function (err, bytes) {
      if (err) {
        console.log('发送数据失败')
      } else {
        console.log(message)
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
  store.dispatch('downloadMovie', message)
})

downloadCommand.bind(8413)
