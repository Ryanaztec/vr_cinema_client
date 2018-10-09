<template>
  <div>
    <header-info :video_name="video_data.video_name"></header-info>

    <div class="row container_body video_detail_body">
          <div class="col-md-12">
              <div class="row ">
                  <div class="col-md-9">
                      <div class="row ">
                          <div id="topBanner" class="slide" >
                              <div v-for="(imgUrl, index) in video_picture_list" v-show="index===mark" :key="index" class="slideshow">
                                  <a href="#">
                                      <img :src="imgUrl" style="width: 100%; min-height: 700px; min-width: 1370px;">
                                  </a>
                              </div>
                              <div class="switch">
                                  <span class="prev" @click="prev"><img src="../assets/prev.png"></span>
                                  <span class="next" @click="next"><img src="../assets/next.png"></span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="col-md-3 video_synopsis">
                      <div class="video_content topnav_box" >
                          <p class="title">[影片简介]</p>
                          <div class="video_description">
                              <span>{{video_data.video_description}}</span>
                          </div>
                          <p class="title">[影片时长] <span>{{video_data.video_time}}</span></p>
                          <p class="title">[文件大小] <span>{{video_data.video_size}}</span></p>
                          <p class="title">[分成比例] <span>{{video_data.video_proportion}}</span></p>
                          <p class="title">[标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签] <span>{{video_data.video_tags}}</span></p>
                      </div>
                      <div class="download_box">
                        <template v-if="$store.state.seat.isMain">
                          <b-button :disabled="true" class="download_btn" v-if="currentMovie.downloaded==='all' && $store.state.currentUser.isLogin">已下载</b-button>
                          <b-button id="process" @click="downloadMovie(currentMovie)" class="download_btn" v-else-if="currentMovie.downloaded==='none'||currentMovie.downloaded==='partly'">{{showSubSeatProgress(currentMovie) ? '座椅下载中' : '下载影片'}}</b-button>
                          <b-popover target="process"
                           placement="topleft"
                           triggers="hover focus"
                           v-if="$store.state.seat.isMain&&showSubSeatProgress(currentMovie)">
                            <template>
                              <downloading-progress :movieInfo="currentMovie"></downloading-progress>
                            </template>
                          </b-popover>
                        </template>
                        <template v-else-if="movieIsDownloading(currentMovie)">
                          <b-progress height="20px" :value="currentMovieDownloadingProgress(currentMovie)" show-progress class="mb-2"></b-progress>
                        </template>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import HeaderInfo from './header'
  import API from '../service/api'
  import Sender from '../udp/sender'
  import DownloadingProgress from './downloading-progress'
  export default {
    components: { HeaderInfo, DownloadingProgress },
    data () {
      return {
        video_data: {},
        mark: 0,
        video_picture_list: [],
        is_downloaded: false,
        progress: 0,
        intervalId: '',
        currentMovie: ''
      }
    },
    methods: {
      async downloadMovie (item) {
        // 判断是否登录：
        if (!this.$store.state.currentUser.isLogin) {
          const swalWithBootstrapButtons = this.swal.mixin({
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
          })
          swalWithBootstrapButtons({ type: 'error', title: '请先登录' })
          return false
        }
        // 文件路径
        const movieUrl = this.baseUrl + item.path
        // const movieUrl = 'http://vrcinema.osvlabs.com/storage/movies/10/qwerty.zip'
        // 获取需要下载的座椅
        const needDownloadSeats = await this.getNeedDownloadSeats(item)
        needDownloadSeats.forEach((value, key) => {
          Sender.downloadMovie({ movie_url: movieUrl, file_name: item.file_name, movie_id: item.id, cinema_id: this.$store.state.currentUser.cinemaId, seat_id: value.id, size: item.size }, value.ip_address)
        })
      },
      async getNeedDownloadSeats (item) {
        return API.getNeedDownloadSeats({ cinema_id: this.$store.state.currentUser.cinemaId, movie_id: item.id }).then(response => {
          return response.data.data
        })
      },
      prev () {
        this.mark--
        if (this.mark === -1) {
          this.mark = this.video_picture_list.length - 1
        }
      },
      next () {
        this.mark++
        if (this.mark === this.video_picture_list.length) {
          this.mark = 0
        }
      },
      autoPlay () {
        this.mark++
        if (this.mark === this.video_picture_list.length) {
          this.mark = 0
        }
      },
      play () {
        setInterval(this.autoPlay, 2500)
      },
      fetchData () {
        const movieDetail = this.$route.params.data
        this.currentMovie = this.$route.params.data
        this.is_downloaded = movieDetail.downloaded
        this.video_data.video_name = movieDetail.name
        this.video_data.video_description = movieDetail.description
        this.video_data.video_size = movieDetail.size
        this.video_data.video_proportion = movieDetail.share_rate + '%'
        let videoTags = []

        // pictures
        movieDetail.pictures.forEach((value, key) => {
          this.video_picture_list.push(this.baseUrl + value.path)
        })
        // running time
        let buffer = []
        let handler = function (value) {
          return value.length === 1 ? ('0' + value) : value
        }
        if (parseInt(movieDetail.running_time_hour)) {
          buffer.push(movieDetail.running_time_hour)
        }
        if (parseInt(movieDetail.running_time_minute)) {
          buffer.push(handler(movieDetail.running_time_minute))
        }
        if (parseInt(movieDetail.running_time_second)) {
          buffer.push(handler(movieDetail.running_time_second))
        }
        this.video_data.video_time = buffer.join(':')
        // tags
        movieDetail.movie_has_tags.forEach((value, key) => {
          videoTags.push(value.tag.name)
        })
        this.video_data.video_tags = videoTags.join(',')
      },
      currentMovieDownloadingProgress (item) {
        let progress = 0
        this.$store.state.movie.downloadingMovies.forEach((value, key) => {
          if (value.movie_id === item.id) {
            progress = value.percentage
          }
        })
        return progress
      },
      showSubSeatProgress (item) {
        let flag = false
        this.$store.state.movie.subSeatDownloadingStatus.forEach((value, key) => {
          if (value.movie_id === item.id && value.status === 'downloading') {
            flag = true
          }
        })
        return flag
      },
      movieIsDownloading (item) {
        let flag = false
        if (this.$store.state.movie.downloadingMovies.length !== 0) {
          this.$store.state.movie.downloadingMovies.forEach((value, key) => {
            if (value.movie_id === item.id) {
              flag = true
            }
          })
          return flag
        }
      }
    },
    created () {
      this.play()
    },
    mounted () {
      this.fetchData()
    },
    computed: {
      baseUrl: function () {
        return process.env.NODE_ENV === 'production' ? this.global.baseUrl + '/storage/' : 'http://dev.vrcinema.com/storage/'
      }
    },
    beforeRouteLeave (to, from, next) {
      clearInterval(this.intervalId)
      next()
    }
  }
</script>

<style scoped>
    .video_detail_body .switch span{
        position: absolute;
        width: 50px;
        text-align: center;
        top: 50%;
        margin-top: -25px;
        cursor: pointer;
    }
    .video_detail_body .prev{
        left: 0;
    }
    .video_detail_body .next{
        right: 0;
    }
    .video_detail_body .video_synopsis {
        background: rgba(255, 255, 255, 0.102);
        font-size: 20px;
        padding-top: 10px;
    }
    .video_detail_body .video_synopsis span {
        margin-left: 10px;
        color: white;
    }
    .video_detail_body .video_synopsis .video_content {
        max-height: 600px;
        overflow-y: scroll;
        min-height: 400px;
    }
    .video_detail_body .video_synopsis .title {
        font-size: 20px;
        color: rgb(204, 204, 204);
        margin-bottom: 5px;
    }
    .video_detail_body .video_synopsis .video_description {
        margin-bottom: 5px;
    }
    .video_detail_body .video_synopsis .download_box {
        text-align: center;
        position: absolute;
        bottom: 20px;
        width: 100%;
        margin-left: -15px;
        padding: 0 30px;
    }
    .video_detail_body .video_synopsis .download_btn {
        font-size: 24px;
        width: 100%;
        color: rgb(0, 0, 0);
        border-radius: 5px;
        background-image: -moz-linear-gradient( -90deg, rgb(97,255,255) 0%, rgb(25,236,236) 100%) !important;
        background-image: -webkit-linear-gradient( -90deg, rgb(97,255,255) 0%, rgb(25,236,236) 100%) !important;
        background-image: -ms-linear-gradient( -90deg, rgb(97,255,255) 0%, rgb(25,236,236) 100%) !important;
    }

    .slide {
        overflow: hidden;
        position: relative;
        margin: 0px 15px;
        margin-right: 25px;
    }
    li {
        position: absolute;
    }

</style>
