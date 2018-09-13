<template>
  <div>
    <header-info ref="header" :isMainSeat="is_main_seat"></header-info>

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
                          <b-pagination-nav size="sm" v-model="currentPage" prev-text="上一页" next-text="下一页" :link-gen="linkGen" :number-of-pages="pageNum" hide-goto-end-buttons hide-ellipsis @input="jumpToPage(currentPage)"/>
                          <span><span>共{{pageNum}}页</span> &nbsp;&nbsp;&nbsp;跳转到<input class="jump_to" v-model="directPage" />页 <a href="#" class="jump_btn" @click="jumpToPage(directPage)">跳转</a></span>
                      </div>
                  </div>
                  <div class="col-md-3 seat" v-if="hasLogin">
                      <div v-if="seats.length>0">
                          <div class="seat_body text-center">
                              <div v-if="show_seat">
                                  <div class="choose_seat_text">选择座椅</div>
                                  <div class="seat_list topnav_box">
                                      <div :class="(7 > seats.length && 4 < seats.length) ? 'middle_seat' : ((6 < seats.length) ? 'small_seat' : '')">
                                          <div class="row" v-if="!is_main_seat">
                                              <div class="seat_box" :class="(7 > seats.length && 4 < seats.length) ? 'col-md-4' : ((6 < seats.length) ? 'col-md-3' : 'col-md-6')" v-for="(item,$index) in seats">
                                                  <img class="seat_img" src="../assets/seat.png"
                                                       v-show="item.mac_address != current_mac_address"/>
                                                  <img class="seat_img active_seat_img" src="../assets/active_seat.png"
                                                       v-show="item.mac_address == current_mac_address"/>
                                                  <p class="seat_number"
                                                     :class="item.mac_address == current_mac_address ? 'active_seat_number':''">{{item.seat_number}}</p>
                                              </div>
                                          </div>
                                          <div class="row" v-else>
                                              <div class="seat_box admin_view_seat" :class="(7 > seats.length && 4 < seats.length) ? 'col-md-4' : ((6 < seats.length) ? 'col-md-3' : 'col-md-6')" @click="activeSeat($index)"
                                                   v-for="(item,$index) in seats">
                                                  <img class="seat_img" src="../assets/seat.png" v-show="!item.is_active"/>
                                                  <img class="seat_img active_seat_img" src="../assets/active_seat.png"
                                                       v-show="item.is_active"/>
                                                  <p class="seat_number"
                                                     :class="item.is_active ? 'active_seat_number':''">{{item.seat_number}}</p>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="broadcast_pace_bg" @click="broadcast_pace()"><a href="#">《 播放进度 》</a></div>
                              </div>
                              <div class="broadcast_list" v-else>
                                  <div class="choose_seat_text">播放进度</div>
                                  <div class="row seat_list topnav_box">
                                      <div v-for="bar in seats" class="col-md-12 ">
                                          <div class="row" v-if="is_main_seat">
                                              <div class="col-sm-2 seat_num">{{ bar.seat_number }}</div>
                                              <div class="col-sm-10">
                                                  <b-progress :value="bar.value"
                                                              :key="bar.variant"
                                                              class="mb-4"
                                                              striped :animated="animate"
                                                              height="12px"
                                                  ></b-progress>
                                              </div>
                                          </div>
                                          <div v-else>
                                              <div class="row" v-if="bar.mac_address == current_mac_address">
                                                  <div class="col-sm-2 seat_num">{{ bar.seat_number }}</div>
                                                  <div class="col-sm-10">
                                                      <b-progress :value="bar.value"
                                                                  :key="bar.variant"
                                                                  class="mb-4"
                                                                  striped :animated="animate"
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
                          <p class="open_vr">即可开启 VR 影院</p>
                          <p class="open_vr">感受观影极致体验</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div :class="coverClass"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderInfo from './header'
  import Sender from '../udp/sender'
  import API from '../service/api'
  const {dialog} = require('electron').remote
  export default {
    components: { HeaderInfo },
    data () {
      return {
        appendclass: '',
        active: 0,
        movies: [],
        show_seat: true,
        max: 50,
        value: 33.333333333,
        seats: [],
        is_main_seat: false,
        animate: true,
        active_seat: false,
        is_play: true,
        currentPage: 1,
        tag: '',
        showPagination: false,
        pageNum: 1,
        directPage: 1,
        selectedMovie: '',
        coverClass: '',
        current_mac_address: ''
      }
    },

    methods: {
      activeVideo: function (item, index) {
        this.selectedMovie = item
        this.active = index
      },
      broadcast_pace: function () {
        this.show_seat = false
      },
      choose_seat: function () {
        this.show_seat = true
      },
      start: function () {
        // 所有选中的座椅
        let activeSeats = []
        this.seats.forEach((item, key) => {
          if (item.is_active) {
            activeSeats.push(item)
          }
        })
        if (activeSeats.length === 0) {
          dialog.showMessageBox({
            title: '错误',
            message: '请先选择座椅',
            type: 'warning'
          })
          return false
        }

        // 选中座椅添加影片信息
        this.seats.forEach((item, key) => {
          if (item.is_active) {
            item.movieData = this.selectedMovie
            item.progressTime = 0
            this.playProgress(item)
          }
        })
        const movieName = this.selectedMovie.movie_name
        // this.coverClass = 'cover' // 添加遮罩层
        Sender.sendMessage('start ' + movieName)
        this.$notify({
          group: 'foo',
          text: '开始播放 《' + movieName + '》'
        })
        this.is_play = true
      },
      stop: function () {
        const movieName = this.selectedMovie.movie_name
        this.coverClass = '' // 除去遮罩层
        Sender.stopMovie()
        this.$notify({
          group: 'foo',
          text: '停止播放 《' + movieName + '》'
        })
        this.is_play = false
      },
      activeSeat: function (seatNumber) {
        this.seats[seatNumber].is_active = !this.seats[seatNumber].is_active
        this.is_play = false
      },
      searchByTag: function (val) {
        this.tag = val.name
        this.$refs.header.keyword = ''
        this.getMovies('', val.name)
      },
      getMovies (keyword, tag, page) {
        const macAddress = this.getMac()

        const cinemaId = this.$store.state.currentUser.cinemaId
        this.$refs.header.active = tag ? this.$refs.header.active : 0
        this.$store.dispatch('GetMovies', {
          cinema_id: cinemaId,
          mac_address: macAddress,
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
      async getMac () {
        return new Promise(function (resolve, reject) {
          require('getmac').getMac(function (err, macAddress) {
            if (err) {
              reject(err)
            } else {
              resolve(macAddress)
            }
          })
        })
      },
      movieTime: function (item) {
        if (item.movieData) {
          const movieTime = item.movieData.movie_time.split(':')
          const parseToSeconds = movieTime[0] * 3600 + movieTime[1] * 60 + movieTime[2] * 1
          return parseToSeconds
        }
      },
      playProgress: function (item) {
        setInterval(() => {
          item.progressTime += 1000
        }, 500)
      }
    },
    async mounted () {
      if (this.$store.state.currentUser.isLogin) {
        this.getMovies()
        const macAddress = await this.getMac()
        this.current_mac_address = macAddress
        const cinemaId = this.$store.state.currentUser.cinemaId
        API.getSeatByMac({
          cinema_id: cinemaId,
          mac_address: macAddress
        }).then((response) => {
          if (response.success) {
            this.seats = response.data.data
            this.is_main_seat = response.data.is_main_seat
          }
        })
      }
    },
    watch: {
      '$store.state.currentUser.cinemaId': function () {
        this.getMovies()
      }
    },
    computed: {
      baseUrl: function () {
        return process.env.NODE_ENV === 'production' ? 'http://vrcinema.osvlabs.com/storage/' : 'http://dev.vrcinema.com/storage/'
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
      bottom: 35%;
      font-size: 1.5rem;
  }
  .seat .small_seat .seat_number {
      bottom: 35%;
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
      max-height: 420px;
      overflow-y: scroll;
      margin-right: 0px;
  }
  .seat .seat_list .seat_box {
      margin-bottom: -10%;
  }
  .seat .seat_list.topnav_box::-webkit-scrollbar {
      width: 5px;
      height:10px;
      background-color:#b5b1b1;
    }
  .seat .seat_list.topnav_box::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
      background-color:black;
    }
  .seat .seat_list.topnav_box::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      background-color:#b5b1b1;
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
    max-width: 420px;
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
  @media (max-width:1250px){
      .seat .middle_seat .seat_number, .seat .small_seat .seat_number {
          font-size: 0.7rem !important;
          bottom: 32%;
      }
  }
  @media (max-width:1500px){
      .seat .middle_seat .seat_number, .seat .small_seat .seat_number {
          font-size: 1rem !important;
          bottom: 37%;
      }
      .seat .seat_list .seat_box {
          padding-left: 5px;
          padding-right: 5px;
      }
  }
</style>
