<template>
  <div class="glue-board-scroll-wrapper">
    <div class="glue-board-fragment-container">
      <Fragment
        v-for="(frag, i) in fragments"
        :key="frag.url + frag.selector + i + frag.mode"
        :frag-info="frag"
        @cancel="$emit('cancel', i)"
      />
    </div>
  </div>
</template>

<script>
import Fragment from '~/components/glue-board/Fragment'

export default {
  components: { Fragment },
  props: {
    fragments: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
// Transitions
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 500ms ease;
  transform: translateY(0%);
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}

.glue-board-scroll-wrapper {
  position: fixed;
  top: 0;
  padding-top: 3.5rem;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;

  .glue-board-fragment-container {
    display: inline-block;
  }
}
</style>
