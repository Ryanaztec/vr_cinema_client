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
                                                 triggers="hover focus">
                                        <template>
                                          已下载座椅：{{seatHaveDownloaded(item)}} <br />
                                          未下载座椅：{{seatNeedDownload(item)}}
                                        </template>
                                      </b-popover>
                                      <div class="video_info">
                                          <span class="video_name">{{item.name}}</span>
                                          <template v-if="$store.state.seat.isMain">
                                            <span class="video_status downloaded" v-if="item.downloaded==='all' && $store.state.currentUser.isLogin">已下载</span>
                                            <span @click="downloadMovie(item)" class="video_status not_download" v-else-if="item.downloaded==='none'||item.downloaded==='partly'">下载影片</span>
                                          </template>
                                          <template v-else>
                                            <span class="video_status downloaded" v-if="checkDownload(item) && $store.state.currentUser.isLogin">已下载</span>
                                            <span v-else-if="$store.state.movie.downloadingMovies.length!==0&&$store.state.movie.downloadingMovies[0].movie_id===item.id" class="download_progress">
                                              <b-progress :value="$store.state.movie.downloadingMovies[0].stats.total.completed" animated show-progress variant="success"></b-progress>
                                            </span>
                                            <span class="video_status" v-else>未下载</span>
                                          </template>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="pagination_body" v-show="showPagination">
                          <b-pagination-nav size="sm" v-model="currentPage" prev-text="上一页" next-text="下一页" :number-of-pages="pageNum" hide-goto-end-buttons hide-ellipsis @input="jumpToPage(currentPage)"/>

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

  export default {
    components: { HeaderInfo },
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
        // 获取文件名
        const fileName = item.path.substring(item.path.lastIndexOf('/') + 1, item.path.length)
        // 文件路径
        const movieUrl = this.baseUrl + item.path
        // const movieUrl = 'http://vrcinema.osvlabs.com/storage/movies/10/qwerty.zip'
        // 获取需要下载的座椅
        const needDownloadSeats = await this.getNeedDownloadSeats(item)
        needDownloadSeats.forEach((value, key) => {
          Sender.downloadMovie({ movie_url: movieUrl, file_name: fileName, movie_id: item.id, cinema_id: this.$store.state.currentUser.cinemaId, seat_id: value.id }, value.ip_address)
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
      }
    },
    mounted: function () {
      this.getMovies()
    },
    computed: {
      baseUrl: function () {
        return process.env.NODE_ENV === 'production' ? 'http://vrcinema.osvlabs.com/storage/' : 'http://dev.vrcinema.com/storage/'
        // return 'http://vrcinema.osvlabs.com/storage/'
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
