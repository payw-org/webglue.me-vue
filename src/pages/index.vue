<template>
  <div class="home">
    <div class="login-container">
      <div class="logo-wrapper">
        <div class="logo-container">
          <div class="logo-image">
            <img src="~/assets/images/logo-simplified.svg" />
          </div>
          <div class="logo-text">
            webglue
          </div>
        </div>
      </div>
      <div class="login-btn">
        <a href="https://api.dev-hch.webglue.me/v1/oauth2/google">
          <button class="google-login">
            <img src="~/assets/images/google_logo.png" class="google-logo" />
            <div>Sign in with Google</div>
          </button>
        </a>
      </div>
      <!-- <button @click="getUserInfo">
        유저 정보 가져오기
      </button> -->
    </div>
  </div>
</template>

<script>
import Axios from 'axios'

export default {
  head() {
    return {
      title: 'webglue'
    }
  },
  methods: {
    getUserInfo() {
      Axios.get('https://api.dev-hch.webglue.me/v1/me/profile', {
        withCredentials: true
      }).then((response) => {
        console.log(response.data)
        window.alert(response.data)
      })
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.home {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .logo-wrapper {
    position: relative;
    width: 100vw;
    display: flex;
    justify-content: center;

    .logo-container {
      width: 70vw;
      position: relative;
    }
  }

  .logo-wraper img {
    width: 100%;
    vertical-align: middle;
  }

  .logo-text {
    font-size: 3.5rem;
    font-weight: fw(6);
    color: #fff;
    mix-blend-mode: overlay;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    text-align: center;
    transform: translate(-50%, -50%);
  }
  .logo-image {
    width: 70vw;
    display: block;
    margin: auto;
    max-width: 20rem;
  }
  .login-btn {
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-top: 4rem;
    .google-login {
      background-color: #e9e8e8;
      padding: 1rem;
      display: flex;
      flex-direction: row;
      border-radius: 0.84rem;
      align-items: center;
      .google-logo {
        width: 1rem;
        margin-right: 0.3rem;
      }
    }
  }
}
</style>
