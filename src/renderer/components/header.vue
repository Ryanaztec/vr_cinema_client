<template>
  <div>
    <div class="header">
      <img class="cinema_logo" src="../assets/header/logo.png"/>
      <div class="header_text">
          <router-link class="text vr_cinema_text" to="/vr_cinema"><span class="span"><span class="vr">VR</span>影院</span></router-link>
          <router-link class="text cinema_resources_text selected" :class="(path == '/video_detail' || path == '/')?'router-link-exact-active':''" to="/"><span class="span">影片库</span></router-link>
          <span class="new_mv_count" v-if="hasLogin && newMoviesCount">{{newMoviesCount}}</span>
      </div>
        <img class="navbar_right_bg" src="../assets/header/navbar_right_bg1.png"/>
      <div class="set_body">
              <b-dropdown variant="link" size="lg" no-caret toggle-class="set_dropdown">
                  <template slot="button-content">
                      <img class="navbar_bg" src="../assets/header/setting_btn.png"/>
                  </template>
                  <template v-if="!hasLogin">
                    <b-dropdown-item v-b-modal.modalLogin class="user_login">管理员登录</b-dropdown-item>
                    <b-dropdown-item class="check_update" @click="check_update">检查更新</b-dropdown-item>
                    <b-dropdown-item class="get_mac_ip" @click="getMacIp">获取MAC地址</b-dropdown-item>
                  </template>
                  <template v-else>
                    <b-dropdown-item to="/" class="account_name">账户：{{username}}</b-dropdown-item>
                    <b-dropdown-item class="manage_admin" v-if="$store.state.seat.isMain" @click="open_manege">影院管理后台</b-dropdown-item>
                    <b-dropdown-item class="dmz_host" v-if="$store.state.seat.isMain" @click="closeAllSeat">关闭所有主机</b-dropdown-item>
                    <b-dropdown-item to="/" class="log_out" @click="logout">注销登录</b-dropdown-item>
                    <b-dropdown-item class="check_update" @click="check_update">检查更新</b-dropdown-item>
                    <b-dropdown-item class="get_mac_ip" @click="getMacIp">获取MAC地址</b-dropdown-item>
                  </template>
              </b-dropdown>
          <img class="navbar_small" src="../assets/header/small.png" @click="minWindow"/>
          <img class="navbar_close" src="../assets/header/close.png" @click="closeWindow"/>
      </div>
    </div>
    <div class="menubar_bg">
        <div class="menubar_body">

          <b-nav class="menubar_list" v-if="path != '/video_detail'">
              <b-nav-item :class="{active:$index==active}" v-if="$index<10" v-for="(item, $index) in tags" :key="$index" @click="activeTag($index, item)">
                  {{item.name}}
              </b-nav-item>
              <b-dropdown variant="link" size="lg" v-if="tags && tags.length>10">
                  <template slot="button-content">
                      <span class="more_btn">更多</span>
                  </template>
                  <template>
                      <b-dropdown-item :class="{active:$index==active}" v-if="$index>9" v-for="(item, $index) in tags" :key="$index" @click="activeTag($index, item)">
                          {{item.name}}
                      </b-dropdown-item>
                  </template>
              </b-dropdown>

              <div class="search_box">
                  <input id="search_input" type="input" v-model="keyword" placeholder="输入要搜索的影片" @keyup.enter="handleSearch(keyword)"/>
                  <span @click="handleSearch(keyword)"><icon name="search" class="text-white search_icon"/></span>
              </div>
          </b-nav>
          <b-nav class="video_detail_menubar" v-else>
            <div class="return_resource">
                <router-link class="" to="/">く 返回列表</router-link>
            </div>
            <div class="video_name">
                {{video_name}}
            </div>
          </b-nav>
        </div>
    </div>
    <login-modal></login-modal>
      <div class="progress_body" v-show="show_download">
          <b-progress :value="downloadPercent" show-progress class="mb-3"></b-progress>
      </div>
  </div>

</template>

<script>
  import LoginModal from './login/login.vue'
  import API from '../service/api'
  import Sender from '../udp/sender'
  var ipcRenderer = require('electron').ipcRenderer
  const { shell } = require('electron')
  export default {
    components: {
      LoginModal
    },
    data () {
      return {
        routeName: this.$route.name,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version,
        tags: null,
        active: 0,
        keyword: '',
        newMoviesCount: localStorage.getItem('newMoviesCount'),
        timer: null,
        isMainSeat: localStorage.getItem('is_main_seat'),
        downloadPercent: 0,
        show_download: false
      }
    },
    props: ['video_name'],
    created: function () {
      if (this.hasLogin) {
        this.timer = setInterval(this.getNewCount, 300000)
      }
    },
    beforeDestroy () {
      if (!this.hasLogin) {
        clearInterval(this.timer)
      }
    },
    methods: {
      // unzip: function () {
      //   console.log(123)
      //   var exec = require('child_process').execFile
      //   var fs = require('fs')
      //   exec('./7-Zip/7z.exe', ['x', './resources/ziyou.7z', '-oc:\\MOVIE'], (err, stdout, stderr) => {
      //     if (stdout) {
      //       fs.unlink('./resources/' + 'ziyou.7z', () => { console.log('source file deleted') })
      //     }
      //   })
      // },
      getMacIp: function () {
        this.$store.dispatch('getMacAddress').then(response => {
          const swal = require('sweetalert2')
          swal({
            type: 'success',
            html: '<div style="color: white;"><div>MAC: ' + response + '</div></div>',
            allowOutsideClick: false
          })
        })
      },
      activeTag: function (index, item) {
        this.active = index
        this.$parent.searchByTag(item)
      },
      logout: function () {
        if (this.$store.state.seat.isMain) {
          this.$store.dispatch('subSeatsLogout', this.$store.state.seat.seats)
        }
        this.$store.dispatch('FedLogOut')
        this.$router.push({ path: '/' })
        this.$notify({
          group: 'foo',
          text: '注销成功'
        })
      },
      handleSearch: function (val) {
        if (val) {
          this.$parent.getMovies(val)
        } else {
          this.$parent.searchByTag({'name': '全部'})
        }
      },
      getNewCount: function () {
        const cinemaId = this.$store.state.currentUser.cinemaId
        API.getNewMoviesCount({
          cinema_id: cinemaId
        }).then((response) => {
          if (response.success) {
            localStorage.setItem('newMoviesCount', response.data)
          }
        })
      },
      closeAllSeat: function () {
        const swalWithBootstrapButtons = this.swal.mixin({
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: false,
          allowOutsideClick: false
        })

        swalWithBootstrapButtons({
          title: '确定要关闭所有主机?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: '关闭 !',
          cancelButtonText: '取消 !',
          reverseButtons: true
        }).then((result) => {
          if (result.value) {
            // TODO 关闭指定IP的主机
            Sender.sendMessage(JSON.stringify({type: 'shutdown', message: 'shutdown'}))
          } else if (
            result.dismiss === this.swal.DismissReason.cancel
          ) {

          }
        })
      },
      minWindow: function () {
        ipcRenderer.send('hide-window')
      },
      closeWindow: function () {
        const swalWithBootstrapButtons = this.swal.mixin({
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: false,
          allowOutsideClick: false
        })
        swalWithBootstrapButtons({
          title: '确定要关闭页面?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: '关闭 !',
          cancelButtonText: '取消 !',
          reverseButtons: true
        }).then((result) => {
          if (result.value) {
            ipcRenderer.send('window-all-closed')
            console.log(result)
          }
        })
      },
      open_manege: function () {
        shell.openExternal(this.global.baseUrl + '/#/?token=' + this.$store.state.currentUser.token)
      },
      check_update: function () {
        if (window.require) {
          var ipcRenderer = window.require('electron').ipcRenderer
          ipcRenderer.send('checkForUpdate')
          ipcRenderer.on('message', (event, text) => {
            console.log(text)
            if (text === '已是最新版本') {
              const swal = require('sweetalert2')
              swal({
                type: 'success',
                title: text,
                allowOutsideClick: false
              })
              return false
            }
            if (text === '正在检查更新……') {
              const swal = require('sweetalert2')
              swal({
                title: text,
                allowOutsideClick: false
              })
              return false
            }
            if (text === '检测到新版本，正在下载……') {
              this.show_download = true
              const swal = require('sweetalert2')
              swal({
                title: text,
                html: this.downloadPercent,
                allowOutsideClick: false,
                showConfirmButton: false,
                customClass: 'download_sweet_alert'
              })
              return false
            }
          })
          ipcRenderer.on('isUpdateNow', () => {
            this.show_download = false
            const swalWithBootstrapButtons = this.swal.mixin({
              confirmButtonClass: 'btn btn-success',
              cancelButtonClass: 'btn btn-danger',
              buttonsStyling: false,
              allowOutsideClick: false
            })
            swalWithBootstrapButtons({
              title: '检测到新版本，是否更新？',
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: '更新 !',
              cancelButtonText: '取消 !',
              reverseButtons: true
            }).then((result) => {
              console.log(result)
              if (result.value) {
                ipcRenderer.send('isUpdateNow')
              }
            })
          })
          ipcRenderer.on('downloadProgress', (event, progressObj) => {
            this.downloadPercent = progressObj.percent || 0
          })
        }
      }
    },
    computed: {
      hasLogin () {
        return !!this.$store.state.currentUser.token
      },
      username () {
        return this.$store.state.currentUser.username
      }
    },
    mounted: function () {
      API.getAllTags().then((response) => {
        if (response.success) {
          this.tags = response.data
        }
      })
    }
  }
</script>

<style scoped>
    .header {
        background: url("../assets/header/navbar_bg.png");
        background-size: 100% 270%;
        z-index: 99;
        position: relative;
        /*background: url("../assets/header/navbar_bg.png") left no-repeat,*/
        /*url("../assets/header/navbar_right_bg1.png") right no-repeat;*/
        /*!*url("../assets/header/navbar_center_bg.png") center no-repeat;*!*/
        /*z-index: 99;*/
        /*position: relative;*/
        margin-top: -3px;
        height: 140px;
    }

    .header .vr_cinema_text {
        margin-right: 6% !important;

    }
    .header .navbar_right_bg {
        position: absolute;
        right: 0px;
        top: -2px;
    }
    .header .cinema_logo {
        margin: 1% 2%;
        position: absolute;
        width: 246px;
        height: 101px;
    }

    .header .header_text .router-link-exact-active {
        background: url("../assets/header/choosed_header_top.png") top no-repeat,
        url("../assets/header/choosed_header_bottom.png") bottom no-repeat;
        background-size: contain;
        padding: 20px 8px !important;
    }

    .header .header_text .new_mv_count {
        border-radius: 50%;
        background-color: rgb(223, 0, 0);
        position: absolute;
        width: 30px;
        height: 30px;
        color: white;
        text-align: center;
        margin-left: -10px;
        padding-top: 2px;
    }

    .header .header_text .router-link-exact-active span.span {
        background: url("../assets/header/choosed_header_center.png") 0 2px;
        padding: 14px 13px;
        background-size: 100% 100%;
    }

    .header .header_text .text {
        padding: 0.8% 1%;
        color: white;
        font-size: 38px;
        font-family: "HYK2GJ";
    }
    .header .header_text .text .vr {
        font-family: N2DB;
        font-size: 44px;
        display: table-caption;
        margin-bottom: -24px;
    }

    .header .header_text {
        display: inline;
        width: 100%;
        margin-top: 35px;
        text-align: center;
        position: absolute;
    }

    .header .header_text a:hover {
        text-decoration: none;
    }


    .header .set_body {
        display: inline-block;
        position: absolute;
        right: 5px;
    }
    .header .set_body .btn-group {
        position: absolute;
        right: 70px;
        margin-top: 6px;
    }
    .header .set_body .navbar_small {
        position: absolute;
        right: 50px;
        padding: 2rem 0px;
        cursor: pointer;
    }
    .header .set_body .navbar_close {
        position: absolute;
        right: 10px;
        padding: 1.5rem 0px;
        cursor: pointer;
    }
    .menubar_bg .menubar_body .video_name {
        width: 100%;
        margin-top: -55px;
        text-align: center;
        font-size: 30px;
        color: rgb(68, 247, 247);
    }

    .menubar_bg {
        margin-left: 30px;
        margin-right: 22px;
    }

    .menubar_bg .menubar_body {
        padding-top: 40px;
        position: relative;
    }


    .menubar_bg .menubar_body:before {
        position: absolute;
        left: -15px;
        right: -10px;
        bottom: 0;
        background: url("../assets/chain_left.png") left no-repeat,
        url("../assets/chain_right.png") right no-repeat;
        content: '';
        top: -115px;
        bottom: 0;
        z-index: 1;
        background-repeat: no-repeat;
    }

    .menubar_bg .menubar_body {
        padding-top: 30px;
    }

    .menubar_bg .menubar_body .menubar_list a {
        font-size: 18px;
        font-family: "Microsoft YaHei";
        color: white;
        padding: 0 1rem;
        height: 20px;
        line-height: 20px;
    }

    .menubar_bg .menubar_body .menubar_list li:not(:last-child) a {
        border-right: 1px solid rgb(0, 0, 0);
    }
    .menubar_bg .menubar_body .menubar_list li:nth-last-child(2) a {
        border-right: none;
    }
    .menubar_bg .menubar_body .menubar_list li:not(:first-child) a  {
        border-left: 1px solid rgb(69, 69, 70);
    }
    .menubar_bg .menubar_body .menubar_list .active a {
        color: rgb(25, 236, 236);
        font-size: 20px;
    }

    .menubar_bg ul {
        background: url("../assets/navbar_bg.png");
        background-size: 100% 100%;
        padding-left: 40px;
        padding-right: 40px;
    }

    .menubar_bg ul .nav-item {
        padding: 25px 0;
        position: relative;
        z-index: 99;
    }
    .search_box {
        position: absolute;
        right: 165px;
        margin-top: 13px;
        z-index: 9;
    }
    .search_box #search_input {
        font-size: 18px;
        font-family: "Microsoft YaHei";
        color: rgb(222, 222, 222);
        background-color: rgb(0, 0, 0);
        opacity: 0.6;
        border-radius: 30px;
        padding: 8px 15px;
        border: 1px solid rgb(52, 58, 64);
        width: 120%;
    }
    .search_box #search_input::-webkit-input-placeholder {
        color: #999999;
        font-size: 18px;
        font-family: "Microsoft YaHei";

    }
    .search_box #search_input:focus {
        outline: none;
    }
    .search_box .search_icon {
        position: absolute;
        right: -20px;
        margin-top: -34px;
        color: rgb(25, 234, 234) !important;
        cursor: pointer;
        width: 22px;
        height: 22px;
    }
    .return_resource {
        padding: 20px 0;
        position: relative;
        z-index: 99;
    }
    .return_resource a {
        font-size: 20px;
        color: white;
    }
    .return_resource a:hover {
        text-decoration: none;
    }
    .video_detail_menubar {
        font-size: 20px;
        font-family: "Microsoft YaHei";
        color: rgb(255, 255, 255);
    }
    .menubar_bg .menubar_body .menubar_list .more_btn {
        font-family: "Microsoft YaHei";
    }
    .progress_body {
        position: absolute;
        width: 100%;
        z-index: 9999;
        height: 100%;
        bottom: -55%;
        left: 50%;
        margin-left: -125px;
    }
    .progress_body .progress {
        width: 250px;
    }

</style>
