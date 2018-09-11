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
                                      <img :src="imgUrl" style="width: 100%;">
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
                      <div style="margin-bottom: 60px;">
                          <p class="title">[影片简介]</p>
                          <p class="video_description">{{video_data.video_description}}</p>
                          <p class="title">[影片时长] <span>{{video_data.video_time}}</span></p>
                          <p class="title">[文件大小] <span>{{video_data.video_size}}</span></p>
                          <p class="title">[分成比例] <span>{{video_data.video_proportion}}</span></p>
                          <p class="title">[标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签] <span>{{video_data.video_tags}}</span></p>
                      </div>
                      <div class="download_box">
                          <b-button class="download_btn">下载影片</b-button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import HeaderInfo from './header'
  export default {
    components: { HeaderInfo },
    data () {
      return {
        video_data: {},
        mark: 0,
        video_picture_list: []
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      activeVideo: function (index) {
        this.active = index
      },
      prev () {
        this.mark--
        if (this.mark === -1) {
          this.mark = 1
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
        return process.env.NODE_ENV === 'production' ? 'http://vrcinema.osvlabs.com/storage/' : 'http://dev.vrcinema.com/storage/'
      }
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
