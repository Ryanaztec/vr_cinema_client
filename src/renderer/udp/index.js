const dgram = require('dgram')
const client = dgram.createSocket('udp4')

client.on('close', () => {
  console.log('socket已关闭')
})

client.on('error', (err) => {
  console.log(err)
})

client.on('message', (msg, rinfo) => {
  let response = msg.toString()
  console.log('已接收服务器发送的数据：%s', response)
  console.log('服务器地址:%s', rinfo.address)
  console.log('服务器端口:%s', rinfo.port)
  if (response === 'exit') {
    console.log('关闭客户端')
    client.close()
  }
})

export default client
