const Downloader = require('mt-files-downloader')

export const initDownloader = (movieUrl, fileName) => {
  // 初始化下载器
  var downloader = new Downloader()
  var dl = downloader.download(movieUrl, './downloaded-movies/' + fileName)
  dl.setOptions({ range: '0-200' })
  dl.setRetryOptions({ maxRetries: 10 })
  return dl
}

export default {
  initDownloader
}
