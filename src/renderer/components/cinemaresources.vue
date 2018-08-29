<template>
  <div>
    <header-info></header-info>

      <div class="row container_body cinema_resource_body">
          <div class="col-md-12">
              <div class="row ">
                  <div class="col-md-12">
                      <div class="row video_list">
                          <div class="col-md-3 video_box">
                              <div class="video active">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/jueji.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_status downloaded">已下载</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-3 video_box">
                              <div class="video ">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/guichuideng.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_status not_download">下载影片</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-3 video_box">
                              <div class="video">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/jueji.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_status">已下载</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-3 video_box">
                              <div class="video ">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/guichuideng.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_status">已下载</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-3 video_box">
                              <div class="video">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/jueji.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_status">已下载</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-3 video_box">
                              <div class="video ">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/guichuideng.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_status">已下载</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-3 video_box">
                              <div class="video">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/jueji.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_status">已下载</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-3 video_box">
                              <div class="video ">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/guichuideng.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_status">已下载</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="pagination_body">
                          <b-pagination-nav size="sm" prev-text="上一页" next-text="下一页" :link-gen="linkGen" :number-of-pages="10" hide-goto-end-buttons hide-ellipsis/>
                          <span><span>共10页</span> &nbsp;&nbsp;&nbsp;跳转到<input class="jump_to"/>页 <a href="#" class="jump_btn">跳转</a></span>
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

    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      linkGen (pageNum) {

      }
    }
  }
</script>

<style scoped>

    .container_body .video_list .video_box {
        margin: 20px 0;
    }
</style>
