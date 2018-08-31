<template>
  <div>
    <b-modal id="modalLogin" ref="modal" title="管理员登陆" @ok="handleOk" @shown="clearName" centered>
      <form @submit.stop.prevent="handleSubmit">
        <b-form-input type="text" placeholder="请输入用户名" v-model="username"></b-form-input>
        <b-form-input type="password" placeholder="请输入密码" v-model="password"></b-form-input>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    clearName () {
      this.username = ''
      this.password = ''
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      // if (!this.username) {
      //   alert('请输入用户名')
      // } else {
      this.handleSubmit()
      // }
    },
    handleSubmit () {
      const self = this
      window.jQuery.ajax({
        url: 'http://vr-cinema.com/api/auth/login',
        type: 'POST',
        dataType: 'JSONP',
        data: {username: self.username, password: self.password},
        success: function (res) {
          console.log(res)
          // self.data = res.data.slice(0, 3)
          // self.opencode = res.data[0].opencode.split(',')
        }
      })
      // this.clearName()
      // this.$refs.modal.hide()
    }
  }
}
</script>

<style scoped>

  .modal-content {
    .modal-header {
      .modal-title {
        width: 100%;
        text-align: center;
      }
    }
  }



.log_in_btn {
  border-radius: 5px;
  background-image: -moz-linear-gradient( -90deg, rgb(97,255,255) 0%, rgb(25,236,236) 100%);
  background-image: -webkit-linear-gradient( -90deg, rgb(97,255,255) 0%, rgb(25,236,236) 100%);
  background-image: -ms-linear-gradient( -90deg, rgb(97,255,255) 0%, rgb(25,236,236) 100%);
}

</style>