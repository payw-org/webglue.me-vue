<template>
  <div id="blurry-layer" @click="hideLayer" />
</template>

<script>
import { CEM } from '~/modules/custom-event-manager'

export default {
  mounted() {
    CEM.addEventListener('activateblurrylayer', this.$el, e => {
      this.$el.classList.add('active')
    })

    CEM.addEventListener('deactivateblurrylayer', this.$el, e => {
      this.$el.classList.remove('active')
    })
  },
  methods: {
    hideLayer() {
      CEM.dispatchEvent('deactivateblurrylayer')
      CEM.dispatchEvent('deactivatepopupmode')
      CEM.dispatchEvent('deactivatecategorycontext')
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

#blurry-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10001;
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms ease;
  @include bgBlur;
  background-color: rgba(#fff, 0.5);

  &.active {
    pointer-events: all;
    opacity: 1;
  }
}
</style>
