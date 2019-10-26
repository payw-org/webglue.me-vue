<template>
  <div class="webglue-fragment" :class="mode">
    <iframe
      name="webview"
      allowtransparency="true"
      style="background: #fff;"
      :src="url"
      frameborder="0"
      class="glue-board-webview"
    />
    <button
      v-if="mode === 'new'"
      class="webview-close-btn"
      @click="$emit('cancel')"
    >
      <IconPlus x color="#fff" class="webview-close-icon" />
    </button>
  </div>
</template>

<script>
import IconPlus from '~/components/icons/IconPlus'

export default {
  components: { IconPlus },
  props: {
    url: {
      type: String,
      default: 'https://comic.naver.com'
    },
    mode: {
      type: String,
      default: 'postit',
      validator(value) {
        return ['postit', 'new'].includes(value)
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.webglue-fragment {
  position: relative;
  width: 400px;
  height: 300px;

  &.new {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

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
    position: absolute;
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
