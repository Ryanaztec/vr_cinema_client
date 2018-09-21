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
                                      <img @click="videoDetail(item)" class="video_picture" :src="item.pictures.length > 0 ? (baseUrl + item.pictures[0].path) : ''"/>
                                      <div class="video_info">
                                          <span class="video_name">{{item.name}}</span>
                                          <span class="video_status downloaded" v-if="item.downloaded && $store.state.currentUser.isLogin">已下载</span>
                                          <span v-else-if="item.isDownloading" class="download_progress" @click="stopMovie(item)">
                                            <b-progress :value="item.stats?item.stats.total.completed:0" animated show-progress variant="success"></b-progress>
                                          </span>
                                          <span @click="downloadMovie(item, $index)" class="video_status not_download" v-else>下载影片</span>
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
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import HeaderInfo from './header'
  import API from '../service/api'
  const _ = require('lodash')
  const Downloader = require('mt-files-downloader')

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
      downloadMovie (item, index) {
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
        let intervalId = ''
        // 获取文件名
        const fileName = item.path.substring(item.path.lastIndexOf('/') + 1, item.path.length)
        // 文件路径
        // const movieUrl = this.baseUrl + item.path
        const movieUrl = 'http://vrcinema.osvlabs.com/storage/movies/10/qwerty.zip'
        // 初始化下载器
        var downloader = new Downloader()
        var dl = downloader.download(movieUrl, './downloaded-movies/' + fileName)
        dl.setOptions({ range: '0-200' })
        dl.setRetryOptions({ maxRetries: 10 })
        // 开始下载
        this.all_movies[index].isDownloading = true
        this.all_movies = _.cloneDeep(this.all_movies)
        dl.start()
        // 结果处理
        dl.on('start', (dl) => {
          clearInterval(intervalId)
          let stats = dl.getStats()
          this.all_movies[index].isDownloading = true
          this.all_movies[index].stats = stats
          this.all_movies = _.cloneDeep(this.all_movies)
          let downloadingMovie = _.cloneDeep(this.all_movies[index])
          if (!this.isDownloading(item)) {
            this.$store.commit('SET_DOWNLOADING_MOVIES', downloadingMovie)
          }
          console.log('start downloading...')
          intervalId = setInterval(() => {
            stats = dl.getStats()
            this.all_movies[index].isDownloading = true
            this.all_movies[index].stats = stats
            this.all_movies = _.cloneDeep(this.all_movies)
            downloadingMovie = _.cloneDeep(this.all_movies[index])
            this.$store.commit('UPDATE_DOWNLOADING_MOVIES', downloadingMovie)
            this.calculateDownloading()
          }, 1000)
        })

        dl.on('error', (dl) => {
          clearInterval(intervalId)
          this.all_movies[index].isDownloading = false
          this.all_movies = _.cloneDeep(this.all_movies)
          this.$store.commit('REMOVE_DOWNLOADING_MOVIES', item)
          this.calculateDownloading()
          console.log('error', dl)
        })

        dl.on('end', (dl) => {
          clearInterval(intervalId)
          API.storeCinemaMovie({
            cinema_id: this.$store.state.currentUser.cinemaId,
            movie_id: item.id
          }).then(response => {
            if (response.success) {
              this.$store.commit('REMOVE_DOWNLOADING_MOVIES', item)
              this.getMovies()
            }
          })
          this.unZipMovies('./downloaded-movies/' + fileName)
          console.log('end', dl)
        })
      },
      calculateDownloading () {
        this.$store.state.movie.downloadingMovies.forEach((value, key) => {
          this.all_movies.forEach((item, index) => {
            if (item.id === value.id) {
              item.stats = value.stats
              item.isDownloading = true
            }
          })
        })
      },
      isDownloading (item) {
        let isDownloading = false
        this.$store.state.movie.downloadingMovies.forEach((value, key) => {
          if (value.id === item.id) {
            isDownloading = true
          }
        })
        return isDownloading
      },
      stopMovie (item) {
        console.log(item)
      },
      linkGen (pageNum) {
      },
      videoDetail (item) {
        this.$router.push({ name: 'video_detail', params: { data: item } })
      },
      unZipMovies (path) {
        var AdmZip = require('adm-zip')
        var unzip = new AdmZip(path)
        unzip.extractAllTo('C:\\MOVIE', true)
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
            this.calculateDownloading()
          }
        })
      },
      jumpToPage (page) {
        this.currentPage = parseInt(page)
        const keyword = this.$refs.header.keyword
        const tag = this.tag
        this.getMovies(keyword, tag, page)
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
