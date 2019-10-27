<template>
  <div class="nickname">
    <h1 class="manifesto">
      이성민님 환영합니다!
      <br />
      <span class="sub">닉네임을 설정하고 webglue를 시작하세요.</span>
    </h1>
    <input class="nickname-input" placeholder="닉네임" />
  </div>
</template>

<script>
export default {
  mounted() {
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

  .manifesto {
    margin-top: 50vh;
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
