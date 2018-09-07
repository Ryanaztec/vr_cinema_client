<template>
  <div id="app">
    <router-view></router-view>
    <notification></notification>
    <div class="g-loading" v-if="showLoading">
      <icon name="circle-notch" spin scale="5"/>
    </div>
  </div>
</template>

<script>
  import Notification from './components/notification/notification.vue'
  export default {
    name: 'vr_cinema_client',
    components: {
      Notification
    },
    computed: {
      showLoading () {
        return this.$store.state.public.showLoading
      }
    }
  }
</script>

<style>
  @import 'css/index.css';
</style>
