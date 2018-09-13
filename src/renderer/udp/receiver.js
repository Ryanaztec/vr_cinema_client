const dgrm = require('dgram')
const server = dgrm.createSocket('udp4')

server.on('message', function (msg, rinfo) {
  console.log('已收到客户端发送的数据：' + msg)
  console.log('客户端地址信息为&j', rinfo)
  // let message = Buffer.from('I got message! from server')
  // server.send('I got message! from server', rinfo.port, rinfo.address)

  if (msg) {
    console.log(msg)
    // var process = require('child_process')
    // process.exec('shutdown -s -t 10')
  }
})
server.on('listening', function () {
  var address = server.address()
  console.log('server listening ' + address.address + ':' + address.port)
})
server.bind(8412)
