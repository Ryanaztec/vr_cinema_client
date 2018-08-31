<template>
  <div>
    <div class="header">
      <img class="cinema_logo" src="../assets/header/logo.png"/>
      <div class="header_text">
          <router-link class="text vr_cinema_text selected" to="/"><span>VR影院</span></router-link>
          <router-link class="text cinema_resources_text" to="/cinema_resources"><span>影片库</span></router-link>
          <span class="new_mv_count">2</span>
      </div>
        <img class="navbar_right_bg" src="../assets/header/navbar_right_bg1.png"/>
      <div class="set_body">
              <b-dropdown variant="link" size="lg" no-caret toggle-class="set_dropdown">
                  <template slot="button-content">
                      <img class="navbar_bg" src="../assets/header/setting_btn.png"/>
                  </template>
                  <b-dropdown-item to="/" class="account_name">账户CIN001</b-dropdown-item>
                  <b-dropdown-item to="/" class="manage_admin">影院管理后台</b-dropdown-item>
                  <b-dropdown-item to="/" class="dmz_host">关闭所有主机</b-dropdown-item>
                  <b-dropdown-item to="/cinema_resources" class="log_out">注销登录</b-dropdown-item>
              </b-dropdown>
          <img class="navbar_small" src="../assets/header/small.png"/>
          <img class="navbar_close" src="../assets/header/close.png"/>
      </div>
    </div>
    <div class="menubar_bg">
        <div class="menubar_body">

          <b-nav class="menubar_list" v-if="this.$route.path != '/video_detail'">
              <b-nav-item :class="{active:$index==active}" to="/cinema_resources" v-for="(item, $index) in tag" :key="item.id" @click="activeTag($index)">
                  {{item}}
              </b-nav-item>

              <div class="search_box">
                  <input id="search_input" type="input" placeholder="输入要搜索的影片"/>
                  <span class="glyphicon glyphicon-search"></span>
              </div>
          </b-nav>
          <b-nav class="video_detail_menubar" v-else>
            <div class="return_resource">
                <router-link class="" to="/cinema_resources">く 返回列表</router-link>
            </div>
            <div class="video_name">
                {{video_name}}
            </div>
          </b-nav>
        </div>
    </div>
  </div>
</template>

<script>
  import api from '../service/api'

  export default {
    data () {
      return {
        electron: process.versions['atom-shell'],
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version,
        tag: [
          '全部',
          '最新',
          '喜剧',
          '爱情',
          '文艺',
          '科幻',
          '动作',
          '惊悚'
        ],
        active: 0
      }
    },
    props: ['video_name'],
    methods: {
      open: function () {

      },
      activeTag: function (index) {
        this.active = index
      },
      getTag: function () {
        api.getAllTags({}).then((response) => {
          console.log(response)
          if (response.success) {
            this.tags = response.data
            console.log(this.tags)
          }
        })
      },
      test: function () {
        console.log(11111)
        this.getTag()
      }

    },
    mounted: function () {
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
        margin: 0.5% 2%;
        position: absolute;
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
    }

    .header .header_text .router-link-exact-active span {
        background: url("../assets/header/choosed_header_center.png") 0 2px;
        padding: 14px 13px;
        background-size: 100% 100%;
    }

    .header .header_text .text {
        padding: 0.8% 1%;
        font-weight: bold;
        color: white;
        font-size: 38px;
        font-family: "HYk2gj";

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
        color: rgb(153, 153, 153);
    }
    .search_box #search_input:focus {
        outline: none;
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

</style>
