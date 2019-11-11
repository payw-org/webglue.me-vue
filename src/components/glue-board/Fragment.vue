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
    :style="{
      left: `${fragInfo.position.x}px`,
      top: `${fragInfo.position.y}px`,
      width: `${fragInfo.size.width}px`,
      height: `${fragInfo.size.height}px`
    }"
  >
    <div
      class="boundary-line top-line"
      data-pos="top"
      @mousedown="mouseDownBoundary"
    />
    <div
      class="boundary-line left-line"
      data-pos="left"
      @mousedown="mouseDownBoundary"
    />
    <div
      class="boundary-line right-line"
      data-pos="right"
      @mousedown="mouseDownBoundary"
    />
    <div
      class="boundary-line bottom-line"
      data-pos="bottom"
      @mousedown="mouseDownBoundary"
    />
    <iframe
      ref="webview"
      name="webview"
      allowtransparency="true"
      style="background: #fff;"
      src="about:blank"
      frameborder="0"
      class="wf-iframe"
      :scrolling="fragInfo.mode === 'new' ? 'yes' : 'no'"
    />
    <!-- <div ref="shadow" class="wf-shadow" /> -->
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
    <div
      v-if="fragInfo.mode === 'new'"
      class="selector"
      :style="{
        left: selector.x + 'px',
        top: selector.y + 'px',
        width: selector.width + 'px',
        height: selector.height + 'px'
      }"
    />
  </div>
</template>

<script>
import Axios from 'axios'
import IconPlus from '~/components/icons/IconPlus'
import ApiUrl from '~/modules/api-url'

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
      shadow: null,
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
      },
      selector: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    }
  },
  mounted() {
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
    this.$el.addEventListener('mousedown', e => {
      if (this.fragInfo.mode === 'new') {
      } else {
        if (e.target.closest('.boundary-line')) {
          return
        }
        e.preventDefault()
        this.stat.catched = true
        this.origin.pointer.x = e.clientX
        this.origin.pointer.y = e.clientY
        this.origin.position.x = this.fragInfo.position.x
        this.origin.position.y = this.fragInfo.position.y

        let mouseMoveCallback
        window.addEventListener(
          'mousemove',
          (mouseMoveCallback = e => {
            if (this.stat.catched) {
              this.$store.commit('glueBoard/setMode', 'dragging')
              this.stat.isMoving = true
              const moveX = e.clientX - this.origin.pointer.x
              const moveY = e.clientY - this.origin.pointer.y
              // this.fragInfo.position.x = this.origin.position.x + moveX
              // this.fragInfo.position.y = this.origin.position.y + moveY
              this.fragInfo.position.x = this.origin.position.x + moveX
              this.fragInfo.position.y = this.origin.position.y + moveY

              const fragmentElms = document.querySelectorAll(
                '.webglue-fragment.postit:not(.hover)'
              )

              for (let i = 0; i < fragmentElms.length; i += 1) {
                let isInvalid = false
                const fragElm = fragmentElms[i]
                const fragElmRect = fragElm.getBoundingClientRect()
                const vertices = []
                vertices[0] = {
                  x: fragElmRect.left,
                  y: fragElmRect.top
                }
                vertices[1] = {
                  x: fragElmRect.right,
                  y: fragElmRect.top
                }
                vertices[2] = {
                  x: fragElmRect.left,
                  y: fragElmRect.bottom
                }
                vertices[3] = {
                  x: fragElmRect.right,
                  y: fragElmRect.bottom
                }

                const thisRect = this.$el.getBoundingClientRect()

                for (let j = 0; j < vertices.length; j += 1) {
                  const vertex = vertices[j]
                  if (
                    vertex.x >= thisRect.left &&
                    vertex.x <= thisRect.right &&
                    vertex.y >= thisRect.top &&
                    vertex.y <= thisRect.bottom
                  ) {
                    this.stat.isValidPos = false
                    isInvalid = true
                    break
                  } else {
                    this.stat.isValidPos = true
                    isInvalid = false
                  }
                }

                if (isInvalid) {
                  break
                }
              }

              const topLeftElm = document.elementFromPoint(
                this.fragInfo.position.x,
                this.fragInfo.position.y
              )
              const topRightElm = document.elementFromPoint(
                this.fragInfo.position.x + this.$el.clientWidth,
                this.fragInfo.position.y
              )
              const bottomLeftElm = document.elementFromPoint(
                this.fragInfo.position.x,
                this.fragInfo.position.y + this.$el.clientHeight
              )
              const bottomRightElm = document.elementFromPoint(
                this.fragInfo.position.x + this.$el.clientWidth,
                this.fragInfo.position.y + this.$el.clientHeight
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
              this.$emit('fragmentmove')
            }
          })
        )

        window.addEventListener('mouseup', () => {
          this.isfragmentmove = 0
          if (!this.stat.isValidPos) {
            this.stat.isTransitioning = true
            setTimeout(() => {
              this.fragInfo.position.x = this.origin.position.x
              this.fragInfo.position.y = this.origin.position.y
              this.stat.isValidPos = true
              setTimeout(() => {
                this.stat.isTransitioning = false
              }, 300)
            }, 10)
          }
          this.$store.commit('glueBoard/setMode', 'idle')
          this.stat.catched = false
          window.removeEventListener('mousemove', mouseMoveCallback)

          // Emit mouseup event and change the fragments
          // position data from the parent
          this.$emit('donemove', {
            x: this.fragInfo.position.x,
            y: this.fragInfo.position.y
          })
          this.$emit('fragmentmove')
        })
      }
    })

    // Shadow DOM
    // this.shadow = this.$refs.shadow.attachShadow({ mode: 'closed' })
    // const htmlDoc = document.implementation.createHTMLDocument(null)
    // this.shadow.append(htmlDoc)

    Axios({
      method: 'GET',
      url: ApiUrl.mirror,
      params: {
        url: this.fragInfo.url
      }
    })
      .then(res => {
        this.$refs.webview.contentWindow.document.documentElement.innerHTML =
          res.data

        if (this.fragInfo.mode === 'new') {
          this.$refs.webview.contentWindow.addEventListener('mousemove', e => {
            const rect = e.target.getBoundingClientRect()
            const payload = {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height
            }
            this.$emit('sniff', payload)
          })

          let newMouseDownEventCallback
          this.$refs.webview.contentWindow.addEventListener(
            'mousedown',
            (newMouseDownEventCallback = e => {
              e.stopPropagation()
              e.preventDefault()
              const rect = e.target.getBoundingClientRect()
              const moveX = rect.left + this.$refs.webview.contentWindow.scrollX
              const moveY = rect.top
              const fragBody = this.$refs.webview.contentDocument.body
              this.$refs.webview.style.transition =
                'top 300ms ease, left 300ms ease'
              this.$refs.webview.style.position = 'absolute'
              this.$refs.webview.style.width = fragBody.clientWidth + 'px'
              this.$refs.webview.style.height = fragBody.clientHeight + 'px'
              this.$refs.webview.style.left = 0
              this.$refs.webview.style.top = 0
              // eslint-disable-next-line no-unused-expressions
              this.$refs.webview.getBoundingClientRect().left

              this.$refs.webview.style.left = -moveX + 'px'
              this.$refs.webview.style.top = -moveY + 'px'

              this.$el.style.transition =
                'top 300ms ease, left 300ms ease, width 300ms ease, height 300ms ease'
              // eslint-disable-next-line no-unused-expressions
              this.$el.getBoundingClientRect().left
              this.$el.classList.remove('new')
              this.$el.style.left = rect.left + 'px'
              this.$el.style.top = rect.top + 'px'
              this.$el.style.width = rect.width + 'px'
              this.$el.style.height = rect.height + 'px'

              setTimeout(() => {
                this.$el.style.transition = ''
              }, 300)

              this.fragInfo.mode = 'postit'

              this.$store.commit('glueBoard/setMode', 'idle')

              this.$emit('exitnewmode', {
                position: {
                  x: rect.left,
                  y: rect.top
                },
                size: {
                  width: rect.width,
                  height: rect.height
                }
              })

              // Remove mousedown event listener
              this.$refs.webview.contentWindow.removeEventListener(
                'mousedown',
                newMouseDownEventCallback
              )
            })
          )

          this.$refs.webview.contentWindow.addEventListener('click', e => {
            e.stopPropagation()
            e.preventDefault()
          })
        }
      })
      .catch(err => {
        console.error('[webglue] ❌', err)
      })
  },
  methods: {
    mouseDownBoundary(e) {
      this.$emit(
        'fragmentselect',
        e.target.closest('.webglue-fragment'),
        e.target.getAttribute('data-pos')
      )
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.webglue-fragment {
  position: relative;
  width: 400px;
  height: 550px;
  position: absolute;
  // transition: box-shadow 300ms ease, transform 200ms ease;
  transition: box-shadow 300ms ease;
  cursor: default;
  border-radius: 0px;
  box-shadow: 0 0.3rem 0.5rem rgba(#000, 0.2);
  overflow: hidden;

  .top-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;

    cursor: ns-resize;
  }

  .bottom-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;

    cursor: ns-resize;
  }

  .left-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 3px;
    height: 100%;
    z-index: 10000;

    cursor: ew-resize;
  }

  .right-line {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 3px;
    height: 100%;
    cursor: ew-resize;
  }

  &.new {
    z-index: 10003 !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: auto;

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
    overflow: hidden;
    box-shadow: 0 2rem 5rem rgba(#000, 0.4);
  }

  &.active {
    // transform: scale(0.92);
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

  .selector {
    display: none;
    background-color: blue;
    padding: 1rem;
    position: fixed;
    z-index: 99999999;
  }
}
</style>
