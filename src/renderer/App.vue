<template>
  <div id="app">
    <router-view></router-view>
    <notification></notification>
  </div>
</template>

<script>
  import Notification from './components/notification/notification.vue'
  export default {
    name: 'vr_cinema_client',
    components: {
      Notification
    }
  }
</script>

<style>
  @import 'css/index.css';
</style>
