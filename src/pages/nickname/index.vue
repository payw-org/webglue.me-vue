<template>
  <div class="nickname">
    <div class="message1">
      환영합니다 이성민님!
    </div>
    <div class="message2">
      닉네임을 설정하시고 webglue를 시작하세요
    </div>
    <input class="nickname-input" />
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
      particleCount: 100,
      spread: 160
    })
  }
}
</script>

<style lang="scss">
.nickname {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 5rem;
  .message1,
  .message2 {
    font-size: 1.5rem;
    color: #727171;
    padding: 1rem;
  }
  .message1 {
    margin-top: 20rem;
  }
  .nickname-input {
    text-align: center;
    font-size: 1.2rem;
    margin: 1rem;
    padding: 0.2rem;
    border-bottom: 1px solid #000000;
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
