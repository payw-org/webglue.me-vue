<template>
  <div class="glue-board">
    <Navigation />
    <section class="gb-section">
      <URLBar v-if="$store.state.glueBoard.isURLBarActive" />
      <WebView v-if="$store.state.glueBoard.isWebViewActive" />
    </section>
  </div>
</template>

<script>
import Navigation from '~/components/Navigation'
import URLBar from '~/components/glue-board/URLBar'
import WebView from '~/components/glue-board/WebView'

export default {
  components: { Navigation, URLBar, WebView }
}
</script>

<style lang="scss">
.glue-board {
  .gb-section {
  }
}
</style>
