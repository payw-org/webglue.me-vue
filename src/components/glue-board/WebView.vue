<template>
  <div class="glue-board-webview-wrapper">
    <iframe
      name="webview"
      allowtransparency="true"
      style="background: #fff;"
      :src="mirroringSrc"
      frameborder="0"
      class="glue-board-webview"
    />
    <button class="webview-close-btn" @click="handleClose">
      <IconPlus x color="#fff" class="webview-close-icon" />
    </button>
  </div>
</template>

<script>
import IconPlus from '~/components/icons/IconPlus'

export default {
  components: { IconPlus },
  data() {
    return {
      mirroringSrc: ''
    }
  },
  created() {
    let inputUrl = this.$store.state.glueBoard.url
    if (!/^https?:\/\//i.test(inputUrl)) {
      inputUrl = 'http://' + inputUrl
    }

    const corsUrl = 'https://jsonp.afeld.me/?url='

    this.mirroringSrc = corsUrl + inputUrl
  },
  methods: {
    handleClose() {
      this.$store.commit('glueBoard/setWebviewActive', false)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.glue-board-webview-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2);

  // iframe
  .glue-board-webview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }

  .webview-close-btn {
    @include bgBlur;
    @include center;
    background-color: rgba(#333, 0.5);
    border-radius: 50px;
    z-index: 10;
    position: fixed;
    top: s(6);
    left: s(6);
    width: 3rem;
    height: 3rem;

    .webview-close-icon {
      width: 45%;
      height: 45%;
      opacity: 0.8;
    }
  }
}
</style>
