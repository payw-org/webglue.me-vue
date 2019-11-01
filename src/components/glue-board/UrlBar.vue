<template>
  <aside class="url-bar-container" :class="{ mounted: isMounted }">
    <div class="bg" @click="closeURLBar" />
    <input
      v-model="url"
      type="text"
      class="url-input"
      placeholder="URL을 입력하세요"
      spellcheck="false"
      @keydown.enter="handleEnter"
    />
  </aside>
</template>

<script>
export default {
  data() {
    return {
      url: '',
      isMounted: false
    }
  },
  mounted() {
    this.url = this.$store.state.glueBoard.url
    const urlInputElm = this.$el.querySelector('.url-input')
    urlInputElm.focus()

    this.$nextTick(() => {
      this.isMounted = true
    })
  },
  methods: {
    closeURLBar() {
      this.$store.commit('glueBoard/setUrlBarActive', false)
    },
    handleEnter() {
      this.closeURLBar()
      this.$emit('urlentered', this.url)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.url-bar-container {
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 100ms ease;
  opacity: 0;

  &.mounted {
    opacity: 1;

    .url-input {
      animation: springZoomOut 600ms linear both;
    }
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(#fff, 0.9);
  }

  .url-input {
    width: 100%;
    max-width: 30rem;
    font-size: h(2);
    padding: s(4) s(6);
    background-color: rgba(#000, 0.7);
    // @include bgBlur;
    border-radius: r(5);
    z-index: 3;
    color: #fff;
    position: relative;
    top: -2rem;
  }
}
</style>
