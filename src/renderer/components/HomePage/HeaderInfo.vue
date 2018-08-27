<template>
  <div>
    <div class="header">
      <img class="navbar_bg" src="../../assets/header/logo.png"/>
      <div class="header_text">
      <a class="text selected" href="#" style="margin-right: 6%;">VR影院</a>
      <a class="text"  href="#">影片库</a>
      </div>
      <div class="set_body">
        <b-nav-item-dropdown text="" class="set_btn">
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown>
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

  .header {
    background: url("../../assets/header/navbar_bg.png");
    background-size:cover;
  }
  .header .navbar_bg {
    width: 14%;
    margin: 0.5% 2%;
  }
  .selected {
    background: url("../../assets/header/choosed_header.png");
    background-size:cover;

  }
  .text {
    font-size: 2.3vw;
    padding: 0.8% 1%;
    font-weight: bold;
    color: white;

  }
  .header .header_text {
    display: inline;
    margin-top: 1.8%;
    margin-right: 20%;
    margin-left: 20%;
    width: 100%;
  }
  .header .header_text a:hover {
      text-decoration: none;
  }
  .header .set_body {
      display: inline-block;
      position: fixed;
  }
  .header .set_body .set_btn {
      display: inline-block;
      position: fixed;
      right: 10px;
  }
  .menubar_bg {
      background: url("../../assets/menubar_bg11.png");
      padding: 0px 50px;
      /*background-clip: padding-box, padding-box, content-box;*/
      background-size: cover;
      margin: -5px 1% 0px 1%;
  }
  .menubar_bg .menubar_body {
      padding-top: 3%;
  }
  .menubar_bg .menubar_body .menubar_list a {
      font-size: 1.3vw;
      font-family: "Microsoft YaHei";
      color: rgb(255, 255, 255);
      line-height: 0.556;

  }
  .menubar_bg .menubar_body .menubar_list .active a {
      color: rgb(25, 236, 236);
  }

</style>
