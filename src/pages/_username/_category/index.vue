<template>
  <div class="glue-board-page">
    <Navigation />
    <GlueBoard :glue-board-id="$route.params.category" />
  </div>
</template>

<script>
import Navigation from '~/components/Navigation'
import GlueBoard from '~/components/glue-board/GlueBoard'

export default {
  components: { Navigation, GlueBoard }
}
</script>
