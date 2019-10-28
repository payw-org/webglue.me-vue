<template>
  <div
    class="webglue-fragment"
    :class="[
      fragInfo.mode,
      {
        hover: stat.hover,
        active: stat.catched,
        invalid: !stat.isValidPos,
        transitioning: stat.isTransitioning
      }
    ]"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <iframe
      name="webview"
      allowtransparency="true"
      style="background: #fff;"
      :src="fragInfo.url"
      frameborder="0"
      class="wf-iframe"
      :scrolling="fragInfo.mode === 'new' ? 'yes' : 'no'"
    />
    <button
      v-if="fragInfo.mode === 'new'"
      class="webview-close-btn"
      @click="$emit('cancel')"
    >
      <IconPlus x color="#fff" class="webview-close-icon" />
    </button>
    <transition name="fade">
      <div v-if="!stat.isValidPos" class="invalid-overlay" />
    </transition>
  </div>
</template>

<script>
import IconPlus from '~/components/icons/IconPlus'

export default {
  components: { IconPlus },
  props: {
    fragInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      stat: {
        hover: false,
        catched: false,
        isMoving: false,
        isValidPos: true,
        isTransitioning: false
      },
      origin: {
        pointer: {
          x: 0,
          y: 0
        },
        position: {
          x: 0,
          y: 0
        }
      },
      position: {
        x: 0,
        y: 0
      }
    }
  },
  mounted() {
    this.position.x = this.fragInfo.position.x
    this.position.y = this.fragInfo.position.y

    this.$el.addEventListener('mouseenter', () => {
      if (this.fragInfo.mode === 'new') {
      } else {
        this.stat.hover = true
      }
    })
    this.$el.addEventListener('mouseleave', () => {
      if (this.fragInfo.mode === 'new') {
      } else {
        this.stat.hover = false
      }
    })
    this.$el.addEventListener('mousedown', (/** @type {MouseEvent} */ e) => {
      if (this.fragInfo.mode === 'new') {
      } else {
        e.preventDefault()
        this.stat.catched = true
        this.origin.pointer.x = e.clientX
        this.origin.pointer.y = e.clientY
        this.origin.position.x = this.position.x
        this.origin.position.y = this.position.y

        let mouseMoveCallback
        window.addEventListener(
          'mousemove',
          (mouseMoveCallback = (/** @type {MouseEvent} */ e) => {
            if (this.stat.catched) {
              this.$store.commit('glueBoard/setMode', 'dragging')
              this.stat.isMoving = true
              const moveX = e.clientX - this.origin.pointer.x
              const moveY = e.clientY - this.origin.pointer.y
              this.position.x = this.origin.position.x + moveX
              this.position.y = this.origin.position.y + moveY
              const topLeftElm = document.elementFromPoint(
                this.position.x,
                this.position.y
              )
              const topRightElm = document.elementFromPoint(
                this.position.x + this.$el.clientWidth,
                this.position.y
              )
              const bottomLeftElm = document.elementFromPoint(
                this.position.x,
                this.position.y + this.$el.clientHeight
              )
              const bottomRightElm = document.elementFromPoint(
                this.position.x + this.$el.clientWidth,
                this.position.y + this.$el.clientHeight
              )
              if (
                (topLeftElm &&
                  topLeftElm.classList.contains('webglue-fragment')) ||
                (topRightElm &&
                  topRightElm.classList.contains('webglue-fragment')) ||
                (bottomLeftElm &&
                  bottomLeftElm.classList.contains('webglue-fragment')) ||
                (bottomRightElm &&
                  bottomRightElm.classList.contains('webglue-fragment'))
              ) {
                this.stat.isValidPos = false
              } else {
                this.stat.isValidPos = true
              }
            }
          })
        )

        window.addEventListener('mouseup', () => {
          if (!this.stat.isValidPos) {
            this.stat.isTransitioning = true
            setTimeout(() => {
              this.position.x = this.origin.position.x
              this.position.y = this.origin.position.y
              this.stat.isValidPos = true
              setTimeout(() => {
                this.stat.isTransitioning = false
              }, 300)
            }, 10)
          }
          this.$store.commit('glueBoard/setMode', 'idle')
          this.stat.catched = false
          window.removeEventListener('mousemove', mouseMoveCallback)
        })
      }
    })
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.webglue-fragment {
  position: relative;
  width: 400px;
  height: 300px;
  position: absolute;
  transition: box-shadow 300ms ease, transform 200ms ease,
    border-radius 200ms ease;
  cursor: default;

  &.new {
    z-index: 10003;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .wf-iframe {
      pointer-events: all !important;
    }
  }

  &.transitioning {
    transition: all 300ms ease;
    z-index: 90;
  }

  .invalid-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(#ff0000, 0.5);
  }

  &.hover {
    border-radius: r(3);
    overflow: hidden;
    box-shadow: 0 2rem 5rem rgba(#000, 0.4);
  }

  &.active {
    transform: scale(0.92);
    box-shadow: 0 1rem 2rem rgba(#000, 0.3);
    z-index: 10;
  }

  // iframe
  .wf-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    pointer-events: none;
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
