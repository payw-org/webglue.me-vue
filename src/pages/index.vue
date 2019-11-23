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
      <div class="signin-btn" :class="{ appear: isMounted }">
        <a :href="signInUrl">
          <button class="google-login">
            <img src="~/assets/images/google_logo.png" class="google-logo" />
            <p class="text">{{ buttonLabel }}</p>
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
import { mapState } from 'vuex'
import ApiUrl from '~/modules/api-url'

export default {
  middleware({ route, redirect }) {
    const query = route.query
    if (query.isnew) {
      redirect('/welcome')
    }
  },
  data() {
    return {
      isMounted: false,
      signInUrl: ApiUrl.user.signInUp
    }
  },
  computed: {
    ...mapState({
      isSignedIn: state => state.auth.isSignedIn
    }),
    buttonLabel() {
      if (this.isSignedIn) {
        return '시작하기 →'
      } else {
        return 'Google 로그인'
      }
    }
  },
  mounted() {
    this.isMounted = true
    if (this.isSignedIn) {
      this.signInUrl = '/@' + this.$store.state.auth.userInfo.nickname
    }
  },
  head() {
    return {
      title: 'webglue'
    }
  },
  methods: {
    getUserInfo() {
      Axios.get(ApiUrl.user.profile, {
        withCredentials: true
      }).then(response => {
        window.alert(response.data)
      })
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.home {
  overflow: hidden;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .logo-wrapper {
    position: relative;
    width: 100%;
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

  .signin-btn {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-top: f(2);

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
