import API from '../.././service/api'
import { downloader, initDownloader } from '../../download-movies/index'
import unZip from '../../download-movies/unzip.js'
import Sender from '../../udp/sender'
import Vue from 'vue'
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
  oss_downloadMovie (store, data) {
    let mainSeatIp = this.state.seat.mainSeat.ip_address
    let unzip = function (fileName) {
      let arr = fileName.split('.')
      let folderName = arr[0]
      const fs = require('fs')
      fs.mkdir('C:\\MOVIE\\' + folderName + '\\', function () {
        unZip.extractSync('./resources/' + fileName, 'C:\\MOVIE\\', 'cp936')
      })
    }
    downloader({
      // remoteFile: '/test.rar',
      // localFile: './resources/test.rar',
      remoteFile: data.movie_id + '/' + data.file_name,
      localFile: './resources/' + data.file_name,
      movie: data,
      onProgress: function (received, total) {
        var percentage = (received * 100) / total
        // 进度
        data.percentage = percentage
        console.log(percentage)
        let movie = _.cloneDeep(data)
        // 更新本地下载中影片的store
        store.commit('UPDATE_DOWNLOADING_MOVIES', movie)
        // 向中控发送当前下载进度
        Sender.sendMessage({movie_id: data.movie_id, percentage: percentage, seat_id: data.seat_id, status: 'downloading', type: 'downloading-progress'}, mainSeatIp, false)
      }
    }).then(() => {
      // 存储数据
      API.storeCinemaMovie({
        cinema_id: data.cinema_id,
        movie_id: data.movie_id,
        seat_id: data.seat_id
      }).then(response => {
        if (response.success) {
          Sender.sendMessage({movie_id: data.movie_id, seat_id: data.seat_id, status: 'end', type: 'downloading-progress'}, mainSeatIp, false)
          store.commit('REMOVE_DOWNLOADING_MOVIES', data)
          unzip(data.file_name)
        }
      }).catch(() => {
        Sender.sendMessage({movie_id: data.movie_id, seat_id: data.seat_id, status: 'error', type: 'downloading-progress'}, mainSeatIp, false)
        store.commit('REMOVE_DOWNLOADING_MOVIES', data)
        // 处理请求偶尔失败的情况
        Vue.notify({
          group: 'foo',
          text: '网络连接断开，请重新下载'
        })
      })
      console.log('success')
    })
  },
  downloadMovie (store, data) {
    const dl = initDownloader(data.movie_url, data.file_name)
    let intervalId = ''
    dl.start()
    dl.on('start', (dl) => {
      clearInterval(intervalId)
      console.log('start downloading...')
      intervalId = setInterval(() => {
        let stats = dl.getStats()
        let percentage = stats.total.completed * 2 - 1 < 0 ? 0 : stats.total.completed * 2 - 1
        let movie = data
        movie.percentage = percentage
        movie = _.cloneDeep(movie)
        // 当前下载电影的进度更新到store中
        store.commit('UPDATE_DOWNLOADING_MOVIES', movie)
        // 向中控发送当前下载进度
        Sender.sendMessage({movie_id: data.movie_id, percentage: percentage, seat_id: data.seat_id, status: 'downloading', type: 'downloading-progress'}, this.state.seat.mainSeat.ip_address, false)
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
