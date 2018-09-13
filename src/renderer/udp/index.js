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

export default client
