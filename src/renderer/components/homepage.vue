<template>
  <div>
    <header-info></header-info>

      <div class="row container_body">
          <div class="col-md-12">
              <div class="row ">
                  <div class="col-lg-9 col-sm-9 col-xs-9">
                      <div class="row video_list">
                          <div class="col-lg-4 col-sm-4 col-xs-4 video_box">
                              <div class="video active">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/xiongchumo.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_time">12:00</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-lg-4 col-sm-4 col-xs-4 video_box">
                              <div class="video ">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/xiongchumo.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_time">12:00</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-lg-4 col-sm-4 col-xs-4 video_box">
                              <div class="video ">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/xiongchumo.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_time">12:00</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-lg-4 col-sm-4 col-xs-4 video_box">
                              <div class="video ">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/xiongchumo.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_time">12:00</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-lg-4 col-sm-4 col-xs-4 video_box">
                              <div class="video ">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/xiongchumo.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_time">12:00</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-lg-4 col-sm-4 col-xs-4 video_box">
                              <div class="video ">
                                  <div class="acttive_bg">
                                      <img class="navbar_bg" src="../assets/xiongchumo.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_time">12:00</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="pagination">
                          <b-pagination-nav prev-text="上一页" next-text="下一页" :link-gen="linkGen" :number-of-pages="10" v-model="currentPage" hide-goto-end-buttons="true" hide-ellipsis=""true/>
                          <span><span>共10页</span> 跳转到 页 <a href="#" class="jump_btn">跳转</a></span>
                      </div>
                  </div>
                  <div class="col-lg-3 col-sm-3 col-xs-3 seat">
                      <div class="seat_body text-center">
                          <div class="choose_seat_text">选择座椅</div>
                          <div class="row seat_list">
                              <div class="col-lg-4 col-sm-4 col-xs-4">
                                  <img class="seat_img" src="../assets/seat.png"/>
                              </div>
                              <div class="col-lg-4 col-sm-4 col-xs-4">
                                  <img class="seat_img" src="../assets/seat.png"/>
                              </div>
                              <div class="col-lg-4 col-sm-4 col-xs-4">
                                  <img class="seat_img" src="../assets/seat.png"/>
                              </div>
                              <div class="col-lg-4 col-sm-4 col-xs-4">
                                  <img class="seat_img" src="../assets/seat.png"/>
                              </div>
                              <div class="col-lg-4 col-sm-4 col-xs-4">
                                  <img class="seat_img" src="../assets/seat.png"/>
                              </div>
                              <div class="col-lg-4 col-sm-4 col-xs-4">
                                  <img class="seat_img" src="../assets/seat.png"/>
                              </div>
                          </div>
                          <div class="broadcast_pace_bg">《 播放进度 》</div>
                      </div>
                      <div class="play_stop">
                          <div><b-button class="play">播放</b-button></div>
                          <div><b-button class="stop">停止</b-button></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import HeaderInfo from './HomePage/HeaderInfo'
//  return '#page/' + pageNum + '/foobar'
  export default {
    name: 'landing-page',
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

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
    background: url("../assets/homePageBg.png") no-repeat center center fixed;
    background-size:cover;
  }

    .container_body {
        padding: 2% 1%;
        color: white;
        margin: 0px;
    }
  .container_body .video_list .video_box{
      margin: 20px -5px;
  }
  .container_body .col-lg-4 img {
      width: 100%;
  }
  .container_body .col-lg-4 .video {
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.102);
      padding: 2%;
      cursor: pointer;
  }
  .container_body .col-lg-4 .video .video_time {
      float: right;
  }
  .container_body .col-lg-4 .video.active{
      background: url("../assets/active_mv_bg_top.png") top no-repeat,
                  url("../assets/active_mv_bg_bottom.png") bottom no-repeat;
      background-size: contain;
      padding: 3px;
      font-family: "Microsoft YaHei";
      color: rgb(25, 236, 236);
      margin-top: -2%;
  }

  .container_body .col-lg-4 .video.active .acttive_bg{
      background: url("../assets/active_mv_bg_center1.png");
      background-size: contain;
      padding: 2%;
      border-radius: 5px;
  }
  .container_body .col-lg-4 .video_info {
      margin-top: 2%;
  }
  .container_body .col-lg-4 .video.active .video_info {
      margin-top: 2%;
      padding: 1% 0px;
  }
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
      font-size: 1.5vw;
      font-family: "Microsoft YaHei";
      color: rgb(255, 255, 255);
      padding: 5%;
  }
    .seat .seat_img {
        width: 80%;
        margin-bottom: 20px;
    }
  .seat .broadcast_pace_bg {
      font-size: 1.5vw;
      font-family: "Microsoft YaHei";
      /*color: rgb(255, 255, 255);*/
      color: rgb(25, 236, 236);
      padding: 3%;
      background-image: -moz-linear-gradient( 0deg, rgba(153,153,153,0.05098) 0%, rgba(153,153,153,0.4) 49%, rgba(153,153,153,0.05098) 100%);
      background-image: -webkit-linear-gradient( 0deg, rgba(153,153,153,0.05098) 0%, rgba(153,153,153,0.4) 49%, rgba(153,153,153,0.05098) 100%);
      background-image: -ms-linear-gradient( 0deg, rgba(153,153,153,0.05098) 0%, rgba(153,153,153,0.4) 49%, rgba(153,153,153,0.05098) 100%);
  }
  .seat .seat_list {
      padding: 0px 8%;
      margin-bottom: 5%;
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
      font-size: 1.5vw;
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
      font-size: 1.5vw;
      font-family: "Microsoft YaHei";
      color: rgb(255, 255, 255);
  }
  .seat .play_stop .stop:hover{
      border-color: rgb(102, 102, 102);
  }
  .pagination .page-item {
  margin: 0px 10px;

  }
  .pagination .page-item .page-link {
      padding: 0.4rem 0.75rem;
  }
  .pagination .page-item a, .pagination .page-item .page-link {
      border-width: 1px;
      border-color: rgb(255, 255, 255);
      border-style: solid;
      border-radius: 5px;
      background: rgb(0, 0, 0);
      color: rgb(255, 255, 255);
  }
  .pagination .page-item.active a, .pagination .jump_btn {
      color: rgb(25, 236, 236);
      border-width: 1px;
      border-color: rgb(25, 236, 236);
      border-style: solid;
      border-radius: 5px;
  }
  .pagination .jump_btn {
      padding: 0.4rem 1.5rem;
  }


</style>
