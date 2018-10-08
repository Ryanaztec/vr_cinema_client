import API from '../.././service/api'
import downloader from '../../download-movies/index'
import Sender from '../../udp/sender'
const _ = require('lodash')

const state = {
  cinemaMovies: [],
  allMovies: [],
  downloadingMovies: [],
  subSeatDownloadingStatus: []
}

const mutations = {
  SET_CINEMA_MOVIES: (state, movies) => {
    state.cinemaMovies = movies
  },
  SET_ALL_MOVIES: (state, movies) => {
    state.allMovies = movies
  },
  SET_DOWNLOADING_MOVIES: (state, movie) => {
    state.downloadingMovies.push(movie)
  },
  UPDATE_DOWNLOADING_MOVIES: (state, movie) => {
    state.downloadingMovies.forEach((value, key) => {
      if (value.movie_id === movie.movie_id) {
        state.downloadingMovies.splice(key, 1)
      }
    })
    state.downloadingMovies.push(movie)
  },
  REMOVE_DOWNLOADING_MOVIES: (state, movie) => {
    state.downloadingMovies.forEach((value, key) => {
      if (value.movie_id === movie.movie_id) {
        state.downloadingMovies.splice(key, 1)
      }
    })
  },
  SET_SUB_SEAT_DOWNLOADING_STATUS: (state, data) => {
    state.subSeatDownloadingStatus.forEach((value, key) => {
      if (value.movie_id === data.movie_id && value.seat_id === data.seat_id) {
        state.subSeatDownloadingStatus.splice(key, 1)
      }
    })
    state.subSeatDownloadingStatus.push(data)
  }
}

const actions = {
  GetMovies (store, info) {
    if (!store.getters.hasLogin) {
      return false
    }
    let moviePic = ''
    return API.getMovie(info).then(response => {
      let movies = []
      response.data.data.forEach((value, key) => {
        if (value.movie.pictures[0]) {
          moviePic = value.movie.pictures.length > 0 ? value.movie.pictures[0].path : ''
        }
        let buffer = []
        let handler = function (value) {
          return value.length === 1 ? ('0' + value) : value
        }
        if (parseInt(value.movie.running_time_hour) || parseInt(value.movie.running_time_hour) === 0) {
          buffer.push(handler(value.movie.running_time_hour))
        }
        if (parseInt(value.movie.running_time_minute) || parseInt(value.movie.running_time_hour) === 0) {
          buffer.push(handler(value.movie.running_time_minute))
        }
        if (parseInt(value.movie.running_time_second)) {
          buffer.push(handler(value.movie.running_time_second))
        }
        movies.push({
          movie_name: value.movie.name,
          movie_time: buffer.join(':'),
          movie_pic: moviePic,
          movie_id: value.movie_id
        })
      })
      store.commit('SET_CINEMA_MOVIES', response.data.data)
      return {data: movies, page: response.data.page}
    })
  },
  pear_downloadMovie (store, data) {
    const PearDownloader = require('PearDownloader')
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
    let token = ''
    var loginXhr = new XMLHttpRequest()
    loginXhr.timeout = 3000
    loginXhr.ontimeout = function (event) {
      alert('登录超时！')
    }
    var loginData = {
      // 使用时替换为正式的账号密码
      'username': 'gexy',
      'password': '1602342221'
    }
    loginXhr.open('POST', 'https://api.webrtc.win/v1/vdn/login')
    loginXhr.send(JSON.stringify(loginData))
    loginXhr.onreadystatechange = function () {
      if (loginXhr.readyState === 4 && loginXhr.status === 200) {
        token = JSON.parse(loginXhr.responseText).token
        if (PearDownloader.isWebRTCSupported()) {
          console.log('start downloading...')
          var downloader = new PearDownloader(data.movie_url, token, options)
          downloader.on('begin', onBegin)
          downloader.on('progress', onProgress)
          downloader.on('done', onDone)
        }
      }
    }
    function onBegin (fileLength, chunks) {
      console.log('start downloading buffer by first aid, file length is:' + fileLength + ' total chunks:' + chunks)
    }
    function onProgress (downloaded) {
      console.log('Progress: ' + (downloaded * 100).toFixed(1) + '%')
    }
    function onDone () {
      console.log('finished downloading buffer by first aid')
    }
  },
  downloadMovie (store, data) {
    const dl = downloader.initDownloader(data.movie_url, data.file_name)
    let intervalId = ''
    dl.start()
    dl.on('start', (dl) => {
      clearInterval(intervalId)
      console.log('start downloading...')
      intervalId = setInterval(() => {
        let stats = dl.getStats()
        let movie = data
        movie.stats = stats
        movie = _.cloneDeep(movie)
        // 当前下载电影的进度更新到store中
        store.commit('UPDATE_DOWNLOADING_MOVIES', movie)
        // 向中控发送当前下载进度
        Sender.sendMessage({movie_id: data.movie_id, stats: stats, seat_id: data.seat_id, status: 'downloading', type: 'downloading-progress'}, this.state.seat.mainSeat.ip_address, false)
        // console.log(stats.total)
      }, 1000)
    })
    dl.on('error', (dl) => {
      clearInterval(intervalId)
      store.commit('REMOVE_DOWNLOADING_MOVIES', data)
      Sender.sendMessage({movie_id: data.movie_id, seat_id: data.seat_id, status: 'error', type: 'downloading-progress'}, this.state.seat.mainSeat.ip_address, false)
      console.log('error', dl)
    })
    dl.on('end', (dl) => {
      clearInterval(intervalId)
      Sender.sendMessage({movie_id: data.movie_id, seat_id: data.seat_id, status: 'end', type: 'downloading-progress'}, this.state.seat.mainSeat.ip_address, false)
      API.storeCinemaMovie({
        cinema_id: data.cinema_id,
        movie_id: data.movie_id,
        seat_id: data.seat_id
      }).then(response => {
        if (response.success) {
          store.commit('REMOVE_DOWNLOADING_MOVIES', data)
        }
      })
      // 解压缩
      try {
        const AdmZip = require('adm-zip')
        var unzip = new AdmZip('./resources/' + data.file_name)
        unzip.extractAllTo('C:\\MOVIE', true)
      } catch (e) {
        console.log('解压异常')
      }
      console.log('end', dl)
    })
  }
}

export default {
  actions,
  mutations,
  state
}
