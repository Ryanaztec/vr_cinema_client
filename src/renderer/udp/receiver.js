const dgrm = require('dgram')
const server = dgrm.createSocket('udp4')

server.on('message', function (msg, rinfo) {
  console.log('已收到客户端发送的数据：' + msg)
  console.log('客户端地址信息为&j', rinfo)
  // let message = Buffer.from('I got message! from server')
  server.send('I got message! from server', rinfo.port, rinfo.address)
  // setTimeout(function () {
  //   server.unref()
  // }, 10000)
})
server.bind(8412, '127.0.0.1', function () {
  let address = server.address()
  console.log('服务器开始监听。地址:&j', address)
})
