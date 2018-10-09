const OSS = require('ali-oss')
const fs = require('fs')

export const getStream = async (configuration) => {
  let client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAIrCfFEDT1sXQt',
    accessKeySecret: 'hCNTF9ArQiTaGsOXhA0LUYpYxEXx0Z',
    bucket: 'vr-test002'
  })
  // let result = await client.getStream('/test-001/inNovated_services.war')
  // let writeStream = fs.createWriteStream('./resources/inNovated_services.war')
  let result = await client.getStream(configuration.remoteFile)
  console.log(result)
  let writeStream = fs.createWriteStream(configuration.localFile)
  result.stream.pipe(writeStream)
}

export const downloader = (configuration) => {
  return new Promise(function (resolve, reject) {
    var receivedBytes = 0
    var totalBytes = 485.4 * 1024 * 1024
    getStream(configuration)
    console.log(totalBytes)

    // Get progress if callback exists
    if (configuration.hasOwnProperty('onProgress')) {
      let timer = setInterval(() => {
        // receivedBytes
        fs.stat(configuration.localFile, (err, stat) => {
          if (stat && stat.isFile()) {
            receivedBytes = stat.size
            console.log(receivedBytes)
            configuration.onProgress(receivedBytes, totalBytes)
            if (receivedBytes >= totalBytes) {
              clearInterval(timer)
              resolve()
            }
          } else {
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
