<template>
  <div class="webglue-selector" />
</template>

<script>
export default {
  props: {
    rect: {
      type: Object,
      default: () => {
        return {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      }
    }
  },
  watch: {
    rect(newValue) {
      this.$el.style.left = `${newValue.x}px`
      this.$el.style.top = `${newValue.y}px`
      this.$el.style.width = `${newValue.width}px`
      this.$el.style.height = `${newValue.height}px`
    }
  }
}
</script>

<style lang="scss">
.webglue-selector {
  pointer-events: none;
  position: fixed;
  background-color: rgba(#0077ff, 0.4);
  z-index: 99999999;
  transition: all 200ms ease-out;
}
</style>
