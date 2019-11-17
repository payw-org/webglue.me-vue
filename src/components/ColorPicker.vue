<template>
  <div class="color-picker">
    <div class="arrow" />
    <div class="cp-colors">
      <button
        v-for="i in 15"
        id="color-button"
        :key="`color-picker-${i}`"
        class="color-choose"
        :class="'color' + i"
        @click="selectColor($event)"
      />
      <button class="chrome-picker" @click="selectChromeColor" />
    </div>
    <chrome-picker
      v-if="isChromePicker"
      class="chrome"
      :value="colors"
      @input="updateValue"
    />
  </div>
</template>

<script>
import { Chrome } from 'vue-color'
// https://github.com/xiaokaike/vue-color
export default {
  components: {
    'chrome-picker': Chrome
  },
  props: {
    color: {
      type: String,
      default: 'gray'
    }
  },
  data() {
    return {
      colors: '#194d33',
      isChromePicker: false
    }
  },
  methods: {
    updateValue(colorData) {
      const color = colorData.hex
      this.isChromePicker = false
      this.$emit('chromecolorselect', color)
    },
    selectChromeColor() {
      this.isChromePicker = true
    },
    selectColor(event) {
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
.color-picker {
  position: fixed;
  top: 2rem;
  z-index: 200;
  transition: all 200ms ease;

  .arrow {
    box-shadow: 0 0 1rem rgba(#000, 0.2);
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

  .cp-colors {
    background-color: #fff;
    box-shadow: 0 1rem 5rem rgba(#000, 0.2);
    border-radius: 0.84rem;
    align-items: center;
    justify-content: center;
    display: block;
    padding: 0.5rem;

    .color-choose,
    .chrome-picker {
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

    .chrome-picker {
      background-image: conic-gradient(
        #ff4141,
        #ffff51,
        #55fc55,
        #5555ff,
        #ff5959
      );
    }
  }

  .chrome {
    position: absolute;
  }
}
</style>
