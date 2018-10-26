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
          hide-footer
          v-model="show"
          :hide-header-close=true
      >
      <img class="close_img" src="../../assets/header/login_close.png" @click="show=false"/>
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
export default {
  data () {
    return {
      username: '',
      password: '',
      show: false
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
    hideModal () {
      this.$refs.myModalRef.hide()
    },
    handleSubmit () {
      this.$store.dispatch('Login', {username: this.username, password: this.password}).then((response) => {
        this.$refs.modal.hide()
        this.$notify({
          group: 'foo',
          text: '欢迎' + this.username
        })
      }).catch((error) => {
        const swal = require('sweetalert2')
        swal({
          type: 'error',
          title: error.response.data.error.message
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
    font-size: 20px;
  }
  .close_img {
    position: absolute;
    top: -50px;
    right: 10px;
    cursor: pointer;
  }
  #modalLogin___BV_modal_body_ .form input::-webkit-input-placeholder {
    color: #999999;
    font-size: 18px;
  }
  .btn-primary {
    border-color: transparent;
    width: 380px !important;
    height: 50px;
    font-size: 22px;
    margin-top: 25px;
  }
  .btn-primary:hover {
    color: #000;
  }


</style>