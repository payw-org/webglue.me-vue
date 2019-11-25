<template>
  <div>
    <GlueBoard :glue-board-hash="glueBoardHash" />
  </div>
</template>

<script>
import GlueBoard from '~/components/glue-board/GlueBoard'

export default {
  components: { GlueBoard },
  computed: {
    glueBoardHash() {
      return this.$route.params.glueBoardHash
    }
  }
}
</script>
