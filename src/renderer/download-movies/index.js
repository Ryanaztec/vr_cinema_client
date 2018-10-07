const Downloader = require('mt-files-downloader')
const PearDownloader = require('PearDownloader')

export const initDownloader = (movieUrl, fileName) => {
  // 初始化下载器
  var downloader = new Downloader()
  var dl = downloader.download(movieUrl, './resources/' + fileName)
  dl.setOptions({ range: '0-200' })
  dl.setRetryOptions({ maxRetries: 10 })
  return dl
}

export const initPearDownloader = (url) => {
  const options = {
    scheduler: 'WebRTCFirst', // 节点调度算法，默认IdleFirst，其它内置调度算法有“WebRTCFirst“和”CloudFirst”
    auto: true, // 是否全部下载,默认true
    useDataChannel: false, // 是否开启data channel,默认true
    dataChannels: 20, // 创建data channel的最大数量,默认20
    useTorrent: false, // 是否开启Browser P2P(基于Webtorrent)，默认true
    // magnetURI: magnetURI, // 可手动传入magnetURI，需先将useTorrent设为true
    // trackers:["wss://tracker.openwebtorrent.com"],    // 可手动传入tracker服务器，需先将useTorrent设为true
    // sources: [], // 指定下载源，增加这个字段后pearplayer不会再向后台请求节点，建议下载源多于5个以保证流畅播放
    useMonitor: true, // 是否开启monitor,会稍微影响性能,默认true
    maxLoaders: 15, // push算法中同时下载的节点数量，默认15个
    // sequencial: true, // 是否有序下载，默认false
    debug: true, // 是否开启debug模式，开启后可以在console中查看log，默认false
    algorithm: 'push' // 下载算法，有‘push’和‘pull’两种，默认‘push’
  }
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZWFyIjoicGVhci1yZXN0ZnVsLWFwaS0zMzQ0IiwiZXhwIjo0Nzc4ODIwNzE5LCJqdGkiOiIyOTM3IiwiaWF0Ijo4LCJpc3MiOiJmb2ctbG9naW4tYXBpIiwic3ViIjoiZ2V4eSJ9.o8pOHZpU_sm8BjVzakIPClav57EMYphxogNzxm26MtY'
  const downloader = new PearDownloader(url, token, options)
  return downloader
}

export default {
  initDownloader,
  initPearDownloader
}
