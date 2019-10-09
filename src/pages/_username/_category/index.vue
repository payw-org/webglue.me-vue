<template>
  <div class="glue-board">
    <Navigation />
    <section class="gb-section">
      <URLBar />
    </section>
  </div>
</template>

<script>
import Navigation from '~/components/Navigation'
import URLBar from '~/components/glue-board/URLBar'

export default {
  components: { Navigation, URLBar }
}
</script>

<style lang="scss">
.glue-board {
  .gb-section {
  }
}
</style>
