<template>
  <div class="nickname">
    <img class="profile-image" :src="imgSrc" />
    <h1 class="manifesto">
      {{ name }}님 환영합니다!
      <br />
      <span class="sub">닉네임을 설정하고 webglue를 시작하세요.</span>
    </h1>
    <input
      ref="inputNickname"
      v-model="nickname"
      class="nickname-input"
      placeholder="새 닉네임"
      @keypress.enter="updateNickname"
    />
  </div>
</template>

<script>
import Axios from 'axios'
import ApiUrl from '~/modules/api-url'

export default {
  data() {
    return {
      name: this.$store.state.app.user.name,
      nickname: this.$store.state.app.user.nickname,
      imgSrc: ''
    }
  },
  mounted() {
    Axios.get(ApiUrl.user.profile, {
      withCredentials: true
    })
      .then((res) => {
        this.$store.commit('app/setUser', res.data)
        this.$store.commit('app/setSignedIn', true)

        this.imgSrc = res.data.image
        this.name = res.data.name
        this.nickname = res.data.nickname

        this.$nextTick(() => {
          this.$refs.inputNickname.select()
        })
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.$store.commit('app/setSignedIn', false)
        }
      })

    const confetti = require('canvas-confetti')
    const myCanvas = document.createElement('canvas')
    myCanvas.className = 'confetti-canvas'
    document.body.appendChild(myCanvas)

    const myConfetti = confetti.create(myCanvas, { resize: true })
    myConfetti({
      particleCount: 300,
      spread: 200
    })
    setTimeout(() => {
      myConfetti({
        particleCount: 200,
        spread: 150
      })
    }, 500)
    setTimeout(() => {
      myConfetti({
        particleCount: 300,
        spread: 180
      })
    }, 1000)
  },
  methods: {
    updateNickname() {
      if (this.nickname.trim().length === 0) {
        window.alert('공백은 안됩니다')
        return
      }
      console.log('update nickname')
      Axios({
        method: 'patch',
        url: ApiUrl.user.profile,
        withCredentials: true,
        data: {
          nickname: this.nickname
        }
      })
        .then(() => {
          window.location.replace(`/@${this.nickname}`)
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.nickname {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 s(4);
  padding-bottom: 30vh;

  .profile-image {
    width: 15rem;
    height: 15rem;
    margin-top: 30vh;
    margin-bottom: f(2);
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 0.3rem 1rem rgba(#000, 0.2);
  }

  .manifesto {
    text-align: center;
    font-size: h(4);

    .sub {
      font-size: h(1);
      font-weight: fw(4);
    }
  }

  .nickname-input {
    text-align: center;
    font-size: b(5);
    margin-top: f(1);
    padding: s(4);
    background-color: $base-white-blue;
    border-radius: r(3);
  }
}

.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
