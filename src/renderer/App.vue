<template>
  <div id="app" class="topnav_box">
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
    },
    mounted: function () {
      if (window.require) {
        var ipcRenderer = window.require('electron').ipcRenderer
        ipcRenderer.send('checkForUpdate')
        ipcRenderer.on('isUpdateNow', () => {
          const swalWithBootstrapButtons = this.swal.mixin({
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
          })
          swalWithBootstrapButtons({
            title: '检测到新版本，是否更新？',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: '更新 !',
            cancelButtonText: '取消 !',
            reverseButtons: true
          }).then((result) => {
            if (result.value) {
              ipcRenderer.send('isUpdateNow')
            }
          })
        })
      }
    }
  }
</script>

<style>
  @import 'css/index.css';
</style>
