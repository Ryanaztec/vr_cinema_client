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
                                          <span class="video_status downloaded" v-if="!item.downloaded && $store.state.currentUser.isLogin">已下载</span>
                                          <span @click="downloadMovie(item)" class="video_status not_download" v-else>下载影片</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="pagination_body" v-show="showPagination">
                          <b-pagination-nav size="sm" v-model="currentPage" prev-text="上一页" next-text="下一页" :number-of-pages="pageNum" hide-goto-end-buttons hide-ellipsis @input="jumpToPage(currentPage)"/>
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
        directPage: 1,
        intervalId: ''
      }
    },
    methods: {
      downloadMovie (item) {
        // 获取文件名
        const index = item.path.lastIndexOf('/')
        const fileName = item.path.substring(index + 1, item.path.length)
        // 文件路径
        const movieUrl = this.baseUrl + item.path
        // 初始化下载器
        var Downloader = require('mt-files-downloader')
        var downloader = new Downloader()
        var dl = downloader.download(movieUrl, './downloaded-movies/' + fileName)
        dl.setOptions({
          range: '0-200'
        })
        // 开始下载
        dl.start()

        setInterval(() => {
          let stats = dl.getStats()
          console.log('stats', dl.status)
          switch (dl.status) {
            case 1:
              console.log('download_speed_value__111', parseInt(stats.present.speed / 1000) || 0)
              console.log('set percent', parseInt(stats.total.completed))
              break
            case 2:
              break
            case -1:
              console.log('download_speed_value___-1', parseInt(stats.present.speed / 1000) || 0)
              console.log('set percent', parseInt(stats.total.completed))
              break
            default:
              console.log('1111')
          }
        }, 1000)

        dl.on('start', (dl) => {
          console.log('start', dl)
        })

        this.intervalId = setInterval(() => {
        }, 1000)

        dl.on('error', (dl) => {
          console.log('error', dl)
          clearInterval(this.intervalId)
        })

        dl.on('end', (dl) => {
          console.log('end', dl)
          clearInterval(this.intervalId)
        })
      },
      videoDetail (item) {
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
      }
    },
    mounted: function () {
      this.getMovies()
    },
    computed: {
      baseUrl: function () {
        return process.env.NODE_ENV === 'production' ? 'http://vrcinema.osvlabs.com/storage/' : 'http://dev.vrcinema.com/storage/'
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
