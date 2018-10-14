<template>
  <div>
    <header-info ref="header"></header-info>
      <div class="row container_body cinema_resource_body">
          <div class="col-md-12">
              <div class="row ">
                  <div class="col-md-12">
                      <div class="row video_list">
                          <div class="col-md-3 video_box" v-for="(item,$index) in all_movies">
                              <div class="video">
                                  <div class="acttive_bg">
                                      <img @click="videoDetail(item)" class="video_picture" :src="item.pictures.length > 0 ? (baseUrl + item.pictures[0].path) : ''"  :id="'popover'+$index"/>
                                      <b-popover :target="'popover'+$index"
                                                 placement="bottom"
                                                 triggers="hover focus"
                                                 v-if="$store.state.seat.isMain&&!showSubSeatProgress(item)">
                                        <template>
                                          已下载座椅：{{seatHaveDownloaded(item)}} <br />
                                          未下载座椅：{{seatNeedDownload(item)}}
                                        </template>
                                      </b-popover>
                                      <b-popover :target="'popover'+$index"
                                                 placement="bottom"
                                                 triggers="hover focus"
                                                 v-else-if="$store.state.seat.isMain">
                                        <template>
                                          下载中：{{downloadStats(item, 'downloading')}} <br />
                                          已完成：{{downloadStats(item, 'end')}} <br />
                                          下载失败：{{downloadStats(item, 'error')}}
                                        </template>
                                      </b-popover>
                                      <div class="video_info">
                                          <span class="video_name">{{item.name}}</span>
                                          <template v-if="$store.state.seat.isMain">
                                            <span class="video_status downloaded" v-if="item.downloaded==='all' && $store.state.currentUser.isLogin">已下载</span>
                                            <span :id="'progress'+$index" @click="downloadMovie(item)" class="video_status not_download" v-else-if="item.downloaded==='none'||item.downloaded==='partly'">{{showSubSeatProgress(item) ? '座椅下载中' : '下载影片'}}</span>
                                            <b-popover :target="'progress'+$index"
                                             placement="topleft"
                                             triggers="hover focus"
                                             v-if="$store.state.seat.isMain&&showSubSeatProgress(item)">
                                              <template>
                                                <downloading-progress :movieInfo="item"></downloading-progress>
                                              </template>
                                            </b-popover>
                                          </template>
                                          <template v-else>
                                            <span class="video_status downloaded" v-if="checkDownload(item) && $store.state.currentUser.isLogin">已下载</span>
                                            <span v-else-if="movieIsDownloading(item)" class="download_progress">
                                              <b-progress :value="currentMovieDownloadingProgress(item)" animated show-progress variant="success"></b-progress>
                                            </span>
                                            <span class="video_status" v-else>未下载</span>
                                          </template>
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
    components: {
      HeaderInfo,
      DownloadingProgress
    },
    data () {
      return {
        appendclass: '',
        all_movies: [],
        showPagination: false,
        currentPage: 1,
        pageNum: 1,
        tag: '',
        directPage: 1
      }
    },
    methods: {
      linkGen (pageNum) {
        this.jumpToPage(2)
      },
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
      videoDetail (item) {
        // console.log(item)
        this.$router.push({ name: 'video_detail', params: { data: item } })
      },
      searchByTag: function (val) {
        this.tag = val.name
        this.$refs.header.keyword = ''
        this.getMovies('', val.name)
      },
      getMovies (keyword, tag, page) {
        const cinemaId = this.$store.state.currentUser.cinemaId
        this.$refs.header.active = tag ? this.$refs.header.active : 0
        API.getMoviesByTag({
          cinema_id: cinemaId,
          key_word: keyword,
          tag: tag,
          page: page
        }).then((response) => {
          if (response.success) {
            this.all_movies = response.data.data
            this.pageNum = response.data.page
            this.showPagination = this.pageNum >= 1
          }
        })
      },
      jumpToPage (page) {
        this.currentPage = parseInt(page)
        const keyword = this.$refs.header.keyword
        const tag = this.tag
        this.getMovies(keyword, tag, page)
      },
      seatNeedDownload: function (item) {
        let str = ''
        if (item.downloaded === 'partly' || item.downloaded === 'none') {
          let seatNumber = []
          item.seatsNeedDownload.forEach((value, index) => {
            seatNumber.push(value.seat_number)
          })
          seatNumber = seatNumber.join(', ')
          str = seatNumber
        } else if (item.downloaded === 'all') {
          str = '-'
        }
        return str
      },
      seatHaveDownloaded: function (item) {
        let str = ''
        if (item.downloaded === 'partly' || item.downloaded === 'all') {
          let seatNumber = []
          item.seatsHaveDownloaded.forEach((value, index) => {
            seatNumber.push(value.seat_number)
          })
          seatNumber = seatNumber.join(', ')
          str = seatNumber
        } else if (item.downloaded === 'none') {
          str = '-'
        }
        return str
      },
      checkDownload: function (item) {
        if (item.downloaded === 'partly') {
          item.seatsHaveDownloaded.forEach((value, key) => {
            if (value.id === this.$store.state.seat.currentSeat.id) {
              return true
            }
          })
        } else if (item.downloaded === 'none') {
          return false
        } else {
          return true
        }
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
      downloadStats (item, type) {
        // 获取不同下载状态的座椅编号
        let seatNumber = []
        this.$store.state.movie.subSeatDownloadingStatus.forEach((value, key) => {
          if (item.id === value.movie_id && type === value.status) {
            this.$store.state.seat.seats.forEach((option, index) => {
              if (option.id === value.seat_id) {
                seatNumber.push(option.seat_number)
              }
            })
          }
        })
        return seatNumber.length === 0 ? '-' : seatNumber.join(', ')
      }
    },
    mounted: function () {
      this.getMovies()
    },
    computed: {
      baseUrl: function () {
        return this.global.baseUrl + '/storage/'
      }
    },
    watch: {
      '$store.state.movie.subSeatDownloadingStatus': function (value) {
        if (value.length === 0) {
          this.getMovies()
        }
      },
      '$store.state.movie.downloadingMovies': function (value) {
        if (value.length === 0) {
          this.getMovies()
        }
      },
      '$store.state.currentUser.isLogin': function (value) {
        if (value) {
          this.getMovies()
        }
      }
    }
  }
</script>

<style scoped>
  .container_body .video_list .video_box {
      margin: 20px 0;
  }

  .video_list .video_picture {
    max-width: 420px;
    max-height: 200px;
  }

</style>
