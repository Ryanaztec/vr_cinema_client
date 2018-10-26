<template>
  <div>
    <header-info ref="header"></header-info>
      <div class="row container_body">
          <div class="col-md-12">
              <div class="row ">
                  <div class="col-md-9">
                      <div class="row video_list">
                          <div class="col-md-4 video_box" v-for="(item,$index) in movies" @click="activeVideo(item, $index)">
                              <div class="video" :class="{active:$index==active}">
                                  <div class="acttive_bg">
                                      <img class="video_picture" :src="baseUrl + item.movie_pic"/>
                                      <div class="video_info">
                                          <span class="video_name">{{item.movie_name}}</span>
                                          <span class="video_time">{{item.movie_time}}</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="pagination_body" v-show="showPagination">
                          <b-pagination-nav size="sm" base-url="#" v-model="currentPage" prev-text="上一页" next-text="下一页" :number-of-pages="pageNum" hide-goto-end-buttons hide-ellipsis @input="jumpToPage(currentPage)"/>
                          <span><span>共 {{pageNum}} 页</span> &nbsp;&nbsp;&nbsp;跳转到<input class="jump_to" v-model="directPage" />页 <a href="#" class="jump_btn" @click="jumpToPage(directPage)">跳转</a></span>
                      </div>
                  </div>
                  <div class="col-md-3 seat" v-if="hasLogin">
                      <div>
                          <div class="seat_body text-center">
                              <div v-if="show_seat">
                                  <div class="choose_seat_text">选择座椅</div>
                                  <div class="seat_list topnav_box">
                                      <div v-if="seats.length==0 && showSeats">暂没有配置座椅!</div>
                                      <div :class="(7 > seats.length && 2 < seats.length) ? 'middle_seat' : ((6 < seats.length && 17 > seats.length) ? 'small_seat' : ((16 < seats.length && 21 > seats.length) ? 'least_seat' : 'big_seat'))" v-else>
                                          <div class="row" v-if="!is_main_seat">
                                              <div class="seat_box" :class="(7 > seats.length && 2 < seats.length) ? 'col-md-4' : ((6 < seats.length && 17 > seats.length) ? 'col-md-3' : ((16 < seats.length && 21 > seats.length) ? 'col-md-1-5' : 'col-md-6'))" v-for="(item,$index) in seats">
                                                  <img class="seat_img" src="../assets/seat.png"
                                                       v-show="!item.is_playing && !item.is_active && !(item.mac_address===current_mac_address)"/>
                                                  <img class="seat_img selected_seat_img" src="../assets/selected_seat.png"
                                                       v-show="!item.is_playing && !item.is_active && item.mac_address===current_mac_address"/>
                                                  <img class="seat_img active_seat_img" src="../assets/active_seat.png"
                                                       v-show="item.is_playing"/>
                                                  <p class="seat_number"
                                                     :class="{'active_seat_number': item.is_playing, 'selected_seat_number': (!item.is_playing && !item.is_active && item.mac_address===current_mac_address)}">{{item.seat_number}}</p>
                                                     <div class="check_body"><icon v-if="item.mac_address===current_mac_address" name="check" class="text-white check_icon" :class="iconColor(item)"/></div>
                                              </div>
                                          </div>
                                          <div class="row" v-else>
                                              <div class="seat_box admin_view_seat" :class="(7 > seats.length && 2 < seats.length) ? 'col-md-4' : ((6 < seats.length && 17 > seats.length) ? 'col-md-3' : ((16 < seats.length && 21 > seats.length) ? 'col-md-1-5' : 'col-md-6'))" @click="activeSeat($index)"
                                                   v-for="(item,$index) in seats">
                                                  <img class="seat_img" src="../assets/seat.png" v-show="!item.is_playing && !item.is_active"/>
                                                  <img class="seat_img selected_seat_img" src="../assets/selected_seat.png"
                                                       v-show="!item.is_playing && item.is_active"/>
                                                  <img class="seat_img active_seat_img" src="../assets/active_seat.png"
                                                       v-show="item.is_playing"/>
                                                  <p class="seat_number"
                                                     :class="{'active_seat_number': item.is_playing, 'selected_seat_number': (!item.is_playing && item.is_active)}">{{item.seat_number}}</p>
                                                  <div class="check_body"><icon v-if="item.is_active" name="check" class="text-white check_icon" :class="iconColor(item)"/></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="broadcast_pace_bg" @click="broadcast_pace()"><a href="#">《 播放进度 》</a></div>
                              </div>
                              <div class="broadcast_list" v-else>
                                  <div class="choose_seat_text">播放进度</div>
                                  <div class="row seat_list topnav_box">
                                      <div v-for="item in playingProgress" class="col-md-12 ">
                                          <div class="row" v-if="is_main_seat">
                                              <div class="col-sm-2 seat_num">{{ item.seat_number }}</div>
                                              <div class="col-sm-10">
                                                  <b-progress :value="item.progress"
                                                              class="mb-4"
                                                              striped
                                                              height="12px"
                                                  ></b-progress>
                                              </div>
                                          </div>
                                          <div v-else>
                                              <div class="row" v-if="item.mac_address == current_mac_address">
                                                  <div class="col-sm-2 seat_num">{{ item.seat_number }}</div>
                                                  <div class="col-sm-10">
                                                      <b-progress :value= "item.progress"
                                                                  class="mb-4"
                                                                  striped
                                                                  height="12px"
                                                      ></b-progress>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="broadcast_pace_bg" @click="choose_seat()"><a href="#">《 选择座椅 》</a></div>
                              </div>

                          </div>

                          <div class="play_stop">
                              <div><b-button class="play" @click="start()" :disabled="is_play">播放</b-button></div>
                              <div><b-button class="stop" @click="stop()" :disabled="!is_play">停止</b-button></div>
                          </div>
                      </div>
                  </div>
                  <div class="col-md-3 seat no_login_seat" v-else>
                      <div class="seat_body text-center">
                          <img class="seat_img" src="../assets/no_login_seat.png"/>
                          <p class="open_vr">即刻开启 VR 影院</p>
                          <p class="open_vr">感受观影极致体验</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div :class="coverClass"></div>
  </div>
</template>

<script>
  import HeaderInfo from './header'
  import Sender from '../udp/sender'
  import API from '../service/api'
  const _ = require('lodash')
  export default {
    components: { HeaderInfo },
    data () {
      return {
        appendclass: '',
        active: 0,
        movies: [],
        show_seat: true,
        seats: [],
        is_main_seat: false,
        active_seat: false,
        is_play: false,
        currentPage: 1,
        tag: '',
        showPagination: false,
        pageNum: 1,
        directPage: 1,
        selectedMovie: '',
        coverClass: '',
        current_mac_address: '',
        intervalId: '',
        activeSeatsIds: [],
        playingProgress: [],
        showSeats: false
      }
    },

    methods: {
      activeVideo: function (item, index) {
        this.selectedMovie = item
        this.active = index
        console.log(this.$store.state.movie.downloadingMovies)
        console.log(this.$store.state.seat.playingSeats)
        console.log(this.currentActiveSeats())
      },
      iconColor: function (item) {
        return item.is_playing ? 'text-black' : 'text-green'
      },
      currentActiveSeats: function () {
        // 所有选中的座椅
        let activeSeats = []
        this.activeSeatsIds = []

        this.seats.forEach((item, key) => {
          if (this.$store.state.seat.isMain && item.is_active) {
            activeSeats.push(item)
            this.activeSeatsIds.push(item.id)
          } else if (item.mac_address === this.current_mac_address) {
            activeSeats.push(item)
            this.activeSeatsIds.push(item.id)
          }
        })
        return activeSeats
      },
      broadcast_pace: function () {
        this.show_seat = false
      },
      choose_seat: function () {
        this.show_seat = true
      },
      start: function () {
        let activeSeats = this.currentActiveSeats()
        let selectedMovie = this.selectedMovie
        let playingSeats = this.$store.state.seat.playingSeats
        let playSeatsIds = []
        const swalWithBootstrapButtons = this.swal.mixin({
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: false,
          allowOutsideClick: false
        })

        if (activeSeats.length === 0) {
          const swal = require('sweetalert2')
          swal({
            type: 'error',
            title: '请先选择座椅',
            allowOutsideClick: false
          })
          return false
        }
        // 过滤已在播放的座椅：
        playingSeats.map(item => {
          playSeatsIds.push(item.seat_id)
        })
        let seatsToPlay = this.activeSeatsIds.filter(item => {
          return playSeatsIds.indexOf(item) === -1
        })
        swalWithBootstrapButtons({
          title: '确定要播放电影 《' + selectedMovie.movie_name + '》',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: '确定 !',
          cancelButtonText: '取消 !',
          reverseButtons: true
        }).then((result) => {
          if (result.value) {
            API.storePlayRecord({
              cinema_id: this.$store.state.currentUser.cinemaId,
              movie_id: selectedMovie.movie_id,
              seats: seatsToPlay
            }).then(response => {
              if (response.success) {
                response.data.data.forEach((item, key) => {
                  this.$store.commit('ADD_PLAYING_SEATS', item)
                  let message = JSON.stringify({ type: 'playing-movie', message: 'start ' + selectedMovie.movie_name, data: item })
                  Sender.sendMessage(message, item.cinema_seat.ip_address, this.is_main_seat)
                })
                this.playingProgress = this.calculateProgress()
                // this.coverClass = 'cover' // 添加遮罩层
                this.$notify({
                  group: 'foo',
                  text: '开始播放 《' + selectedMovie.movie_name + '》'
                })
                this.is_play = true
              } else {
                let seatNumbers = []
                activeSeats.forEach((item, index) => {
                  if (response.message.indexOf(item.id.toString()) !== -1) {
                    seatNumbers.push(item.seat_number)
                  }
                })
                seatNumbers = seatNumbers.join(', ')
                const swalWithBootstrapButtons = this.swal.mixin({
                  confirmButtonClass: 'btn btn-success',
                  cancelButtonClass: 'btn btn-danger',
                  buttonsStyling: false,
                  allowOutsideClick: false
                })
                swalWithBootstrapButtons({ type: 'error', title: '座椅' + seatNumbers + '未下载该电影' })
              }
            }).catch(() => {
              this.$notify({
                group: 'foo',
                text: '网络繁忙，请重试'
              })
            })
          }
        })
      },
      stop: function () {
        let activeSeats = this.currentActiveSeats()
        let activeSeatNum = []
        let swalWithBootstrapButtons = this.swal.mixin({
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: false,
          allowOutsideClick: false
        })
        activeSeats.map(item => {
          activeSeatNum.push(item.seat_number)
        })
        activeSeatNum = activeSeatNum.join(', ')
        if (activeSeats.length === 0) {
          swalWithBootstrapButtons({
            type: 'error',
            title: '请先选择座椅'
          })
          return false
        }
        swalWithBootstrapButtons({
          title: '确定要停止座椅编号为 ' + activeSeatNum + ' 的影片播放?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: '确定 !',
          cancelButtonText: '取消 !',
          reverseButtons: true
        }).then((result) => {
          if (result.value) {
            API.updatePlayRecord({
              cinema_id: this.$store.state.currentUser.cinemaId,
              movie_id: this.selectedMovie.movie_id,
              seats: this.activeSeatsIds,
              is_main: this.is_main_seat
            }).then(response => {
              if (response.success) {
                // store中移除停止播放的座椅
                this.$store.commit('SET_PLAYING_SEATS', response.data.data)
                const movieName = this.selectedMovie.movie_name
                this.coverClass = '' // 除去遮罩层
                activeSeats.map(item => {
                  if (item.is_playing) {
                    Sender.sendMessage(JSON.stringify({type: 'stop', message: 'stop'}), item.ip_address, this.is_main_seat)
                  }
                })
                this.$notify({
                  group: 'foo',
                  text: '停止播放 《' + movieName + '》'
                })
                this.is_play = false
              } else {
                this.$notify({
                  group: 'foo',
                  text: '网络繁忙，请重试'
                })
              }
            })
          }
        })
      },
      activeSeat: function (seatNumber) {
        let currentSeatStatus = false
        this.$store.state.seat.playingSeats.forEach((value, key) => {
          if (value.seat_id === this.seats[seatNumber].id) {
            currentSeatStatus = true
          }
        })
        this.seats[seatNumber].is_active = !this.seats[seatNumber].is_active
        this.is_play = currentSeatStatus
      },
      searchByTag: function (val) {
        this.tag = val.name
        this.$refs.header.keyword = ''
        this.getMovies('', val.name)
      },
      getMovies (keyword, tag, page) {
        const cinemaId = this.$store.state.currentUser.cinemaId
        this.$refs.header.active = tag ? this.$refs.header.active : 0
        this.$store.dispatch('GetMovies', {
          cinema_id: cinemaId,
          mac_address: this.current_mac_address,
          key_word: keyword,
          tag: tag,
          page: page
        }).then(response => {
          this.movies = response.data
          this.pageNum = response.page
          this.showPagination = this.pageNum >= 1
          // 给当前播放按钮一个默认的电影
          this.selectedMovie = this.movies[0]
        })
      },
      jumpToPage (page) {
        this.currentPage = parseInt(page)
        const keyword = this.$refs.header.keyword
        const tag = this.tag
        this.getMovies(keyword, tag, page)
      },
      movieTime: function (movie) {
        const movieTime = movie.movie_time.split(':')
        const parseToSeconds = movieTime[0] * 3600 + movieTime[1] * 60 + movieTime[2] * 1
        return parseToSeconds
      },
      calculateProgress: function () {
        const playingSeats = this.$store.state.seat.playingSeats
        let progressArr = []
        let removePlayingSeats = []
        let playingSeatsNumber = []
        if (playingSeats.length !== 0) {
          playingSeats.forEach((value, key) => {
            const remainingTime = Math.round(new Date().getTime() / 1000) - value.play_start_time
            let handleMovieTime = function (movie) {
              return movie.running_time_hour * 3600 + movie.running_time_minute * 60 + movie.running_time_second * 1
            }
            let progress = (remainingTime / handleMovieTime(value.movie)) * 100 <= 100 ? (remainingTime / handleMovieTime(value.movie)) * 100 : 100
            progressArr.push({
              seat_number: value.cinema_seat.seat_number,
              progress: progress,
              mac_address: value.cinema_seat.mac_address
            })
            if (progress >= 100) {
              removePlayingSeats.push(value.seat_id)
              playingSeatsNumber.push(value.cinema_seat.seat_number)
              Sender.sendMessage(JSON.stringify({type: 'stop', message: 'stop'}), value.cinema_seat.ip_address, this.is_main_seat)
            }
          })
          if (removePlayingSeats.length !== 0) {
            API.updatePlayRecord({
              cinema_id: this.$store.state.currentUser.cinemaId,
              movie_id: this.selectedMovie.movie_id,
              seats: removePlayingSeats,
              is_main: this.is_main_seat
            }).then(response => {
              if (response.success) {
                this.$store.commit('SET_PLAYING_SEATS', response.data.data)
                this.$notify({
                  group: 'foo',
                  text: '座椅编号：' + playingSeatsNumber.join(',') + ' 播放已结束'
                })
              } else {
                this.$notify({
                  group: 'foo',
                  text: '网络繁忙，请重试'
                })
              }
            })
            this.is_play = false
          }
        }
        return progressArr
      },
      initSeatPlayingStatus: function () {
        this.seats.forEach((item, index) => {
          item.is_playing = false
          this.$store.state.seat.playingSeats.forEach((value, key) => {
            if (item.id === value.seat_id) {
              item.is_playing = true
            }
          })
        })
      },
      initCurrentPage: function () {
        this.current_mac_address = this.$store.state.public.macAddress
        // 获取影院所有的座椅信息
        API.getSeatByMac({
          cinema_id: this.$store.state.currentUser.cinemaId,
          mac_address: this.current_mac_address
        }).then((response) => {
          if (response.success) {
            this.seats = response.data.data
            this.is_main_seat = response.data.is_main_seat
            this.$store.commit('SET_SEATS', _.cloneDeep(response.data.data))
            this.$store.commit('SET_IS_MAIN', response.data.is_main_seat)
            this.$store.commit('SET_MAIN_SEAT', response.data.main_seat)
            if (!this.is_main_seat) {
              // 非中控只显示自己的座椅
              this.seats = this.seats.filter(item => {
                return item.mac_address === this.current_mac_address
              })
            }
            // 初始化座椅状态
            this.initSeatPlayingStatus()
          }
        })
        this.getMovies()
        // 计算当前播放座椅的状态
        this.playingProgress = this.calculateProgress()
        this.intervalId = setInterval(() => {
          this.playingProgress = this.calculateProgress()
        }, 1000)
      }
    },
    mounted () {
      if (this.$store.state.currentUser.isLogin) {
        this.initCurrentPage()
      }
    },
    beforeRouteLeave (to, from, next) {
      clearInterval(this.intervalId)
      next()
    },
    watch: {
      '$store.state.seat.playingSeats': function () {
        this.initSeatPlayingStatus()
      },
      seats: function () {
        this.seats.forEach((item, index) => {
          if (item.mac_address === this.current_mac_address) {
            this.$store.commit('SET_IP_ADDRESS', item.ip_address)
            this.$store.commit('SET_CURRENT_SEAT', item)
          }
        })
      }
    },
    computed: {
      baseUrl: function () {
        return this.global.baseUrl + '/storage/'
      },
      hasLogin () {
        return !!this.$store.state.currentUser.token
      }
    }
  }
</script>

<style scoped>
  .seat {
      margin-top: 20px;
  }
  .seat .seat_body {
      background: url("../assets/seat_bg.png");
      background-size: cover;
      border-width: 1px;
      border-color: rgba(0, 0, 0, 0.702);
      border-style: solid;
      border-radius: 5px;
      box-shadow: 0px 0px 5px 1px #aaa;
  }
  .seat .choose_seat_text {
      font-size: 24px;
      font-family: "Microsoft YaHei";
      color: rgb(255, 255, 255);
      padding: 5%;
  }
    .seat .seat_img {
        width: 80%;
        margin-bottom: 20px;
        margin-top: 15px;
    }
  .seat .big_seat .seat_img {
      max-width: 93px;
  }
  .seat .middle_seat .seat_img {
      max-width: 67px;
  }
  .seat .small_seat .seat_img {
      max-width: 59px;
  }
  .seat .least_seat .seat_img {
      max-width: 43px;
  }
  .seat .least_seat .check_body .text-green {
      width: 12px;
  }
  .seat .seat_img.active_seat_img, .seat .admin_view_seat{
      cursor: pointer;
  }
  .seat .seat_number {
      position: relative;
      font-size: 2rem;
      bottom: 35%;
  }
  .seat .active_seat_number {
      color: black;
  }
  .seat .middle_seat .seat_number {
      bottom: 32%;
      font-size: 1.5rem;
  }
  .seat .small_seat .seat_number {
      bottom: 32%;
      font-size: 1.2rem;
  }
  .seat .least_seat .seat_number {
      bottom: 32%;
      font-size: 1.2rem;
  }
  .seat .broadcast_pace_bg {
      padding: 3%;
      background-image: -moz-linear-gradient( 0deg, rgba(153,153,153,0.05098) 0%, rgba(153,153,153,0.4) 49%, rgba(153,153,153,0.05098) 100%);
      background-image: -webkit-linear-gradient( 0deg, rgba(153,153,153,0.05098) 0%, rgba(153,153,153,0.4) 49%, rgba(153,153,153,0.05098) 100%);
      background-image: -ms-linear-gradient( 0deg, rgba(153,153,153,0.05098) 0%, rgba(153,153,153,0.4) 49%, rgba(153,153,153,0.05098) 100%);
  }
  .seat .broadcast_pace_bg a {
      font-size: 24px;
      font-family: "Microsoft YaHei";
      color: rgb(25, 236, 236);
      text-decoration: none;
  }
  .seat .seat_list {
      padding: 0px 8%;
      margin-bottom: 5%;
      min-height: 220px;
      margin-right: 0px;
  }
  .seat .seat_list .seat_box {
      margin-bottom: -20%;
  }
  .play_stop {
      text-align: center;
      margin-top: 30px;
  }
  .seat .play_stop button {
      margin: 10px;
      padding: 5px 60px;
      background: none;
  }

  .seat .play_stop .play {
      font-size: 24px;
      font-family: "Microsoft YaHei";
      color: rgb(0, 0, 0);
      border-radius: 5px;
      background-image: -moz-linear-gradient( -90deg, rgb(97,255,255) 0%, rgb(25,236,236) 100%) !important;
      background-image: -webkit-linear-gradient( -90deg, rgb(97,255,255) 0%, rgb(25,236,236) 100%) !important;
      background-image: -ms-linear-gradient( -90deg, rgb(97,255,255) 0%, rgb(25,236,236) 100%) !important;

  }
  .seat .play_stop .play:hover {
      border-color: rgb(255, 255, 255);
      color: rgb(0, 0, 0);
  }
  .seat .play_stop .stop {
      border-width: 2px;
      border-color: rgb(255, 255, 255);
      border-style: solid;
      border-radius: 5px;
      font-size: 24px;
      font-family: "Microsoft YaHei";
      color: rgb(255, 255, 255);
  }
  .seat .play_stop .stop:hover{
      border-color: rgb(102, 102, 102);
  }
  .broadcast_list .seat_num {
      font-size: 22px;
  }

  .video_list .video_picture {
    max-width: 450px;
    max-height: 200px;
  }

  .cover {
    position: fixed;
    left: 0;
    bottom: 0;
    opacity: .5;
    width: 75%;
    height: 85%;
    z-index: 999;
  }
  .seat .open_vr {
      font-family: "Microsoft YaHei";
      font-size: 25px;
      line-height: 1;
  }
  .no_login_seat .seat_body {
      padding-top: 45px;
      padding-bottom: 20px;
  }
  .seat .check_body {
      position: relative;
      bottom: 71%;
      height: 24px;
  }
  .seat .selected_seat_number {
      color: rgb(25, 236, 236) !important;
  }
  .seat .check_body .text-green {
      color: rgb(25, 236, 236) !important;
  }
  .seat .check_body .text-black {
      color: #343a40 !important;
  }
  .col-md-1-5 {
      width: 20%;
  }
  @media (max-width:1250px){
      .seat .middle_seat .seat_number, .seat .small_seat .seat_number {
          font-size: 0.7rem !important;
          bottom: 30%;
      }
  }
  @media (max-width:1500px){
      .seat .middle_seat .seat_number, .seat .small_seat .seat_number {
          font-size: 1rem !important;
          bottom: 33%;
      }
      .seat .seat_list .seat_box {
          padding-left: 5px;
          padding-right: 5px;
      }
  }
</style>
