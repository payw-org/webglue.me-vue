<template>
  <div class="home">
    <div class="login-container">
      <div class="logo-wrapper">
        <div class="logo-container">
          <div class="logo-image" :class="{ appear: isMounted }">
            <img src="~/assets/images/logo-simplified.svg" />
          </div>
          <div class="logo-text">
            webglue
          </div>
        </div>
      </div>
      <div class="login-btn" :class="{ appear: isMounted }">
        <a href="https://api.dev-hch.webglue.me/v1/oauth2/google">
          <button class="google-login">
            <img src="~/assets/images/google_logo.png" class="google-logo" />
            <p class="text">Sign in with Google</p>
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
  data() {
    return {
      isMounted: false
    }
  },
  mounted() {
    this.isMounted = true
  },
  methods: {
    getUserInfo() {
      Axios.get('https://api.dev-hch.webglue.me/v1/me/profile', {
        withCredentials: true
      }).then((response) => {
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
    opacity: 0;
    transform: scale(20);

    &.appear {
      $time: 3s;
      $curve: cubic-bezier(0.5, 0.03, 0, 1.04);
      transition: opacity $time/2 $curve, transform $time $curve;
      opacity: 1;
      transform: scale(1);
    }
  }

  .login-btn {
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-top: f(2);
    opacity: 0;

    &.appear {
      animation: springSlideUp 1s linear both;
      animation-delay: 3s;
    }

    .google-login {
      background-color: #fff;
      padding: s(4) s(5);
      display: flex;
      flex-direction: row;
      border-radius: r(2);
      box-shadow: 0 0.15rem 0.3rem rgba(#000, 0.2);
      align-items: center;

      .google-logo {
        width: 1.2rem;
        margin-right: s(3);
      }

      .text {
        font-size: b(4);
      }
    }
  }
}
</style>
