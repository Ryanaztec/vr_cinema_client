<template>
  <div>
    <div class="header">
      <img class="navbar_bg" src="../assets/header/logo.png"/>
      <div class="header_text">
          <a class="text selected" href="#" style="margin-right: 6%;padding: 20px 8px;"><span>VR影院</span></a>
          <a class="text"  href="#"><span>影片库</span></a>
          <span class="new_mv_count">2</span>
      </div>
      <div class="set_body">
              <b-dropdown variant="link" size="lg" no-caret toggle-class="new_class">
                  <template slot="button-content">
                      <img class="navbar_bg" src="../assets/header/setting_btn.png"/>
                  </template>
                  <b-dropdown-item href="#" class="account_name">账户CIN001</b-dropdown-item>
                  <b-dropdown-item href="#" class="manage_admin">影院管理后台</b-dropdown-item>
                  <b-dropdown-item href="#" class="dmz_host">关闭所有主机</b-dropdown-item>
                  <b-dropdown-item href="#" class="log_out">注销登录</b-dropdown-item>
              </b-dropdown>
          <img class="navbar_small" src="../assets/header/setting_btn.png"/>
          <img class="navbar_close" src="../assets/header/setting_btn.png"/>
      </div>
    </div>
    <div class="menubar_bg">
        <div class="menubar_body">
          <b-nav class="menubar_list">
              <b-nav-item class="active">全部</b-nav-item>
              <b-nav-item>最新</b-nav-item>
              <b-nav-item>喜剧</b-nav-item>
              <b-nav-item>爱情</b-nav-item>
              <b-nav-item>科幻</b-nav-item>
              <b-nav-item>科普</b-nav-item>
              <b-nav-item>惊悚</b-nav-item>
              <b-nav-item>动作</b-nav-item>
          </b-nav>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        electron: process.versions['atom-shell'],
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version
      }
    }
  }
</script>

<style scoped>
    /*@import '../css/index.css';*/
    .header {
        background: url("../assets/header/navbar_bg.png");
        background-size: 100% 270%;
        z-index: 99;
        position: relative;
    }

    .header .navbar_bg {
        margin: 0.5% 2%;
    }

    .header .header_text .selected {
        background: url("../assets/header/choosed_header_top.png") top no-repeat,
        url("../assets/header/choosed_header_bottom.png") bottom no-repeat;
        background-size: contain;

    }

    .header .header_text .new_mv_count {
        border-radius: 50%;
        background-color: rgb(223, 0, 0);
        position: absolute;
        width: 30px;
        height: 30px;
        color: white;
        text-align: center;
        top: 35px;
        margin-left: -20px;
    }

    .header .header_text .selected span {
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
        position: static;
        margin-top: 35px;
        margin-left: 17%;
    }

    .header .header_text a:hover {
        text-decoration: none;
    }

    .header .set_body {
        display: inline-block;
        position: absolute;
        right: 4.5%;
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
        background: url("../assets/02.png") left no-repeat,
        url("../assets/01.png") right no-repeat;
        content: '';
        top: -115px;
        bottom: 0;
        z-index: 1;
        background-repeat: no-repeat;
    }

    .menubar_bg .menubar_body {
        padding-top: 20px;
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


</style>
