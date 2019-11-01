<template>
  <div class="speech-bubble">
    <div class="speech-pointer" />
    <div class="speech-box">
      <button
        v-for="i in 15"
        id="color-button"
        :key="`color-picker-${i}`"
        class="color-choose"
        :class="'color' + i"
        @click="isSelectColor($event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'gray'
    }
  },
  methods: {
    isSelectColor(event) {
      this.$emit('select')
      const list = event.target.classList
      const selectedColorName = list[1]
      this.$emit('colorselect', selectedColorName)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';
.speech-bubble {
  position: relative;
  top: 2rem;
  z-index: 200;

  .speech-pointer {
    background-color: yellow;
    width: 2rem;
    height: 2rem;
    transform: rotate(45deg) translateX(-50%);
    position: absolute;
    left: 50%;
    top: -0.1rem;
    background-color: #eee;
    z-index: -1;
    border-radius: 5px;
  }

  .speech-box {
    background-color: #eeeeee;
    border-radius: 0.84rem;
    align-items: center;
    justify-content: center;
    display: block;
    padding: 0.5rem;

    .color-choose {
      width: 12%;
      display: inline-block;
      border-radius: 50%;
      margin-right: 0.4rem;
      margin-left: 0.4rem;
      margin-top: 0.4rem;
      margin-bottom: 0.4rem;
      transition: box-shadow 200ms ease;

      &:hover {
        box-shadow: 0 0 0 0.2rem #40b3ff;
      }
      &::before {
        content: '';
        display: block;
        padding-top: 100%;
      }
    }
  }
}
</style>
