<template>
  <div class="speech-bubble">
    <chrome-picker class="chrome" :value="colors" @input="updateValue" />
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
import { chrome } from 'vue-color'
// https://github.com/xiaokaike/vue-color
export default {
  components: {
    'chrome-picker': chrome
  },
  props: {
    color: {
      type: String,
      default: 'gray'
    }
  },
  data() {
    return {
      colors: '#194d33'
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
  position: fixed;
  top: 2rem;
  z-index: 200;
  transition: all 200ms ease;
  .speech-pointer {
    background-color: yellow;
    width: 2rem;
    height: 2rem;
    transform: rotate(45deg) translateX(-50%);
    position: absolute;
    left: 50%;
    top: 0.3rem;
    background-color: #fff;
    z-index: -1;
    border-radius: 5px;
  }

  .speech-box {
    background-color: #fff;
    box-shadow: 0 1rem 5rem rgba(#000, 0.2);
    border-radius: 0.84rem;
    align-items: center;
    justify-content: center;
    display: block;
    padding: 0.5rem;

    .color-choose {
      width: calc(12% + 0.125rem);
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
