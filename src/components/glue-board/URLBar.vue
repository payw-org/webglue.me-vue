<template>
  <aside v-if="isURLBarActive" class="url-bar-container">
    <div class="bg" @click="closeURLBar" />
    <input v-model="url" type="text" class="url-input" placeholder="URL을 입력하세요" @keydown.enter="handleEnter" />
  </aside>
</template>

<script>
export default {
  data() {
    return {
      url: ''
    }
  },
  computed: {
    isURLBarActive() {
      return this.$store.state.glueBoard.isURLBarActive
    }
  },
  mounted() {
    if (this.$el.querySelector) {
      const urlInputElm = this.$el.querySelector('.url-input')
      urlInputElm.focus()
      this.url = this.$store.state.glueBoard.url
    }
  },
  methods: {
    closeURLBar() {
      this.$store.commit('glueBoard/SET_URL_BAR_ACTIVE', false)
    },
    handleEnter() {
      this.closeURLBar()
      this.$store.commit('glueBoard/SET_URL', this.url)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.url-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(#fff, 0.5);
    @include bgBlur;
  }

  .url-input {
    width: 100%;
    max-width: 30rem;
    font-size: h(2);
    padding: s(4) s(6);
    background-color: $base-white-blue;
    border-radius: r(5);
    z-index: 3;
  }
}
</style>
