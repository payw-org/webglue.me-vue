<template>
  <div id="category-context">
    <button class="option delete" @click="deleteCategory">
      삭제
    </button>
  </div>
</template>

<script>
import disableScroll from 'disable-scroll'
import { CEM } from '~/modules/custom-event-manager'
import Axios from 'axios'
import ApiUrl from '~/modules/api-url'

export default {
  data() {
    return {
      targetInfo: {
        x: null,
        y: null,
        width: null,
        height: null,
        glueBoardId: null,
        glueBoardIndex: null
      }
    }
  },
  mounted() {
    CEM.addEventListener('activatecategorycontext', this.$el, e => {
      // Activate category context
      disableScroll.on()

      this.targetInfo = e.detail
      const x = this.targetInfo.x
      const y = this.targetInfo.y
      const width = this.targetInfo.width
      const height = this.targetInfo.height
      const glueBoardIndex = this.targetInfo.glueBoardIndex

      console.log('top:', y)

      this.$el.style.left = x + 'px'
      this.$el.style.top = y + height - 50 + 10 + 'px'
      this.$el.style.width = width + 'px'
      this.$el.classList.add('active')
    })

    CEM.addEventListener('deactivatecategorycontext', this.$el, e => {
      // Deactivate category context
      disableScroll.off()

      this.$el.classList.remove('active')
    })
  },
  methods: {
    deleteCategory() {
      CEM.dispatchEvent('removecategory', this.targetInfo.glueBoardIndex)
      CEM.dispatchEvent('deactivateblurrylayer')
      CEM.dispatchEvent('deactivatecategorycontext')
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

#category-context {
  position: fixed;
  background-color: rgba(#000, 0.5);
  color: #fff;
  pointer-events: none;
  border-radius: r(5);
  opacity: 0;
  z-index: 10002;
  display: flex;

  &.active {
    opacity: 1;
    pointer-events: all;
  }

  .option {
    flex: 1;
    padding: s(3) 0;
    color: #fff;
    font-weight: fw(4);
    font-size: h(1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
