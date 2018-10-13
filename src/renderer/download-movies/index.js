import store from '../store/index'
import Sender from '../udp/sender'
// import global from '../global'
const OSS = require('ali-oss')
const fs = require('fs')

export const getStream = async (configuration) => {
  let client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAIE2322NWU2CzL',
    accessKeySecret: 'bGFKGFWnMa67QKWoFIKKKOwhVTv9m4',
    bucket: 'test-vr'
  })
  let result = await client.getStream(configuration.remoteFile)
  let writeStream = fs.createWriteStream(configuration.localFile)
  result.stream.pipe(writeStream)
}

export const downloader = (configuration) => {
  return new Promise(function (resolve, reject) {
    var receivedBytes = 0
    // var totalBytes = 30.9 * 1024 * 1024
    var totalBytes = configuration.movie.size
    getStream(configuration)
    let data = configuration.movie
    // Get progress if callback exists
    if (configuration.hasOwnProperty('onProgress')) {
      // 下载中
      let timer = setInterval(() => {
        // receivedBytes
        fs.stat(configuration.localFile, (err, stat) => {
          if (stat && stat.isFile()) {
            receivedBytes = stat.size
            configuration.onProgress(receivedBytes, totalBytes)
            if (receivedBytes >= totalBytes) {
              // 下载结束
              clearInterval(timer)
              resolve()
            }
          } else {
            // 读取出错
            clearInterval(timer)
            store.commit('REMOVE_DOWNLOADING_MOVIES', data)
            Sender.sendMessage({movie_id: data.movie_id, seat_id: data.seat_id, status: 'error', type: 'downloading-progress'}, store.state.seat.mainSeat.ip_address, false)
            console.log(err)
          }
        })
      }, 1000)
    }
  })
}

export default {
  getStream,
  downloader
}
