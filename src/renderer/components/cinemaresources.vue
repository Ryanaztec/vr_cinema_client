<template>
  <div>
    <header-info ref="header"></header-info>

      <div class="row container_body cinema_resource_body">
          <div class="col-md-12">
              <div class="row ">
                  <div class="col-md-12">
                      <div class="row video_list">
                          <div class="col-md-3 video_box" v-for="(item,$index) in all_movies" @click="activeVideo($index)">
                              <div class="video" :class="{active:$index==active}">
                                  <div class="acttive_bg">
                                      <router-link class="video_picture_box" to="/video_detail"><img class="video_picture" :src="item.pictures.length > 0 ? (baseUrl + item.pictures[0].path) : ''"/></router-link>
                                      <div class="video_info">
                                          <span class="video_name">{{item.name}}</span>
                                          <span class="video_status downloaded" v-if="item.downloaded">已下载</span>
                                          <span class="video_status not_download" v-else>下载影片</span>
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
  export default {
    components: { HeaderInfo },
    data () {
      return {
        appendclass: '',
        active: 0,
        all_movies: [],
        showPagination: false,
        currentPage: 1,
        pageNum: 1,
        tag: '',
        directPage: 1
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      linkGen (pageNum) {

      },
      activeVideo: function (index) {
        this.active = index
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
