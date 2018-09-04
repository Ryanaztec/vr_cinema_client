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
      >
      <form @submit.stop.prevent="handleSubmit" class="input-area">
        <b-form-input type="text" placeholder="请输入用户名" v-model="username" ref="focusText"></b-form-input>
        <b-form-input type="password" placeholder="请输入密码" v-model="password" style="margin-top: 20px;" @keyup.enter.native="handleOk()"></b-form-input>
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
    shownEvents () {
      this.$refs.focusText.focus()
      this.username = ''
      this.password = ''
    },
    handleOk (evt) {
      if (!this.username || !this.password) {
        alert('请输入用户名或密码')
        // Prevent modal from closing
        evt.preventDefault()
      } else {
        this.handleSubmit()
      }
    },
    handleSubmit () {
      this.$store.dispatch('Login', {username: this.username, password: this.password}).then((response) => {
        this.$refs.modal.hide()
      }).catch(() => {
        alert('用户名或密码错误！')
      })
    }
  }
}
</script>

<style scoped>
  .login-form .input-area {
    text-align: -webkit-center;
  }
</style>