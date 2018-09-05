<template>
  <div>
    <header-info></header-info>

      <div class="row container_body">
          <div class="col-md-12">
              <div class="row ">
                  <div class="col-md-9">
                      <div class="row video_list">
                          <div class="col-md-4 video_box" v-for="(item,$index) in arr" @click="activeVideo($index)">
                              <div class="video" :class="{active:$index==active}">
                                  <div class="acttive_bg">
                                      <img class="video_picture" src="../assets/xiongchumo.png"/>
                                      <div class="video_info">
                                          <span class="video_name">熊出没</span>
                                          <span class="video_time">12:00</span>
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
                  <div class="col-md-3 seat">
                      <div class="seat_body text-center">
                          <div v-if="show_seat">
                              <div class="choose_seat_text">选择座椅</div>
                              <div class="row seat_list">
                                  <div class="col-md-4" v-for="(item,$index) in seats">
                                      <img class="seat_img" src="../assets/seat.png"/>
                                  </div>

                              </div>
                              <div class="broadcast_pace_bg" @click="broadcast_pace()"><a href="#">《 播放进度 》</a></div>
                          </div>
                          <div class="broadcast_list" v-else>
                              <div class="choose_seat_text">播放进度</div>
                              <div class="row seat_list">
                                  <div v-for="bar in seats" class="col-md-12 row">
                                      <div class="col-sm-2 seat_num">{{ bar.seat_num }}</div>
                                      <div class="col-sm-10">
                                          <b-progress :value="bar.value"
                                                      :key="bar.variant"
                                                      class="mb-4"
                                                      striped :animated="animate"
                                                      height="12px"
                                          ></b-progress>
                                      </div>
                                  </div>
                              </div>
                              <div class="broadcast_pace_bg" @click="choose_seat()"><a href="#">《 选择座椅 》</a></div>
                          </div>

                      </div>

                      <div class="play_stop">
                          <div><b-button class="play" @click="start()">播放</b-button></div>
                          <div><b-button class="stop" @click="stop()">停止</b-button></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderInfo from './header'
  import Sender from '../udp/sender'
  export default {
    components: { HeaderInfo },

    data () {
      return {
        appendclass: '',
        active: 0,
        arr: [
          '熊出没',
          '熊出没',
          '熊出没',
          '熊出没',
          '熊出没',
          '熊出没'
        ],
        show_seat: true,
        max: 50,
        value: 33.333333333,
        seats: [
          {seat_num: '1', value: 75},
          {seat_num: '2', value: 35},
          {seat_num: '3', value: 35},
          {seat_num: '4', value: 55},
          {seat_num: '5', value: 95},
          {seat_num: '6', value: 75}
        ],
        animate: true
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
      broadcast_pace: function () {
        this.show_seat = false
      },
      choose_seat: function () {
        this.show_seat = true
      },
      start: function () {
        Sender.sendMessage('start Movie')
      },
      stop: function () {
        Sender.stopMovie()
      }
    }
  }
</script>

<style scoped>
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
      font-size: 24px;
      font-family: "Microsoft YaHei";
      color: rgb(255, 255, 255);
      padding: 5%;
  }
    .seat .seat_img {
        width: 80%;
        margin-bottom: 20px;
    }
  .seat .broadcast_pace_bg {
      padding: 3%;
      background-image: -moz-linear-gradient( 0deg, rgba(153,153,153,0.05098) 0%, rgba(153,153,153,0.4) 49%, rgba(153,153,153,0.05098) 100%);
      background-image: -webkit-linear-gradient( 0deg, rgba(153,153,153,0.05098) 0%, rgba(153,153,153,0.4) 49%, rgba(153,153,153,0.05098) 100%);
      background-image: -ms-linear-gradient( 0deg, rgba(153,153,153,0.05098) 0%, rgba(153,153,153,0.4) 49%, rgba(153,153,153,0.05098) 100%);
  }
  .seat .broadcast_pace_bg a {
      font-size: 24px;
      font-family: "Microsoft YaHei";
      color: rgb(25, 236, 236);
      text-decoration: none;
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
      font-size: 24px;
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
      font-size: 24px;
      font-family: "Microsoft YaHei";
      color: rgb(255, 255, 255);
  }
  .seat .play_stop .stop:hover{
      border-color: rgb(102, 102, 102);
  }
  .broadcast_list .seat_num {
      font-size: 22px;
  }


</style>
