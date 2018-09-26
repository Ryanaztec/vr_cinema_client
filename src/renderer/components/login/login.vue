<template>
  <div class="login-form">
    <b-modal id="modalLogin"
          ref="modal"
          title="管理员登录"
          @ok="handleOk"
          @shown="shownEvents"
          centered
          ok-only
          ok-title="登录"
          no-close-on-backdrop
          hide-footer
      >
      <b-form @submit.stop.prevent="handleOk" class="form">
        <b-form-group class="login-username">
          <input v-model="username"
                        required
                        ref="focusText"
                        placeholder="请输入用户名">
        </b-form-group>
        <b-form-group class="login-password">
          <input type="password"
                        v-model="password"
                        required
                        placeholder="请输入密码"
                        @keyup.enter.native="handleOk()">
        </b-form-group>
        <b-form-group class="button">
          <b-button type="submit" variant="primary">登录</b-button>
        </b-form-group>
        <b-form-group class="phone">
          <p>客服电话：400-931-8700</p>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
const {dialog} = require('electron').remote
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    shownEvents () {
      this.$refs.focusText.focus()
      this.username = ''
      this.password = ''
    },
    handleOk (evt) {
      if (!this.username || !this.password) {
        // Prevent modal from closing
        evt.preventDefault()
      } else {
        this.handleSubmit()
      }
    },
    handleSubmit () {
      this.$store.dispatch('Login', {username: this.username, password: this.password}).then((response) => {
        this.$refs.modal.hide()
        this.$notify({
          group: 'foo',
          text: '欢迎' + this.username
        })
        this.$router.push({
          path: '/vr_cinema'
        })
      }).catch((error) => {
        dialog.showMessageBox({
          title: '错误',
          message: error.response.data.error.message,
          type: 'warning'
        })
      })
    }
  }
}
</script>

<style scoped>
  .login-form .form {
    text-align: -webkit-center;
    padding: 1px;
  }
  .login-form .form .login-password {
    margin-top: 30px;
    margin-bottom: 40px;
  }
  .login-form .form .phone {
    color: white;
    margin-bottom: -25px;
  }
</style>