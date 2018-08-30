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
                                  <a href="#" v-if="index == 1">
                                      <img src="../assets/video.png" style="width:100%;">
                                  </a>
                                  <a href="#" v-else-if="index == 0">
                                      <img src="../assets/video01.png" style="width:100%;">
                                  </a>
                                  <a href="#" v-else>
                                      <img src="../assets/video01.png" style="width:100%;">
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
        video_data:
          {
            video_name: '拾梦老人',
            video_description: '该动画以VR的方式讲述了一个老人带着一个小狗每天都在拾起别人丢弃的梦想，并且通过特殊能力来修复梦想的故事。',
            video_time: '10分21秒',
            video_size: '500M',
            video_proportion: '20%',
            video_tags: '情感，剧情'
          },
        mark: 0,
        video_picture_list: [
          'http://p3.so.qhimgs1.com/t01f3c2fbbfc190da13.jpg',
          'http://p1.so.qhimgs1.com/t01fb8af23fa1c93441.jpg',
          'http://p0.so.qhimgs1.com/t013e7b12d08f155a4c.jpg'
        ]
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
      change (i) {
        this.mark = i
      },
      prev () {
        this.mark--
        if (this.mark === -1) {
          this.mark = 1
        }
      },
      next () {
        this.mark++
        if (this.mark === 3) {
          this.mark = 0
        }
      },
      autoPlay () {
        this.mark++
        if (this.mark === 3) {
          this.mark = 0
        }
      },
      play () {
        setInterval(this.autoPlay, 2500)
      }
    },
    created () {
      this.play()
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
