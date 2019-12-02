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
      top: `${fragInfo.position.y}px`
    }"
    :data-fragment-id="fragInfo.id"
    :data-fragment-index="fragIndex"
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
      :src="`/api/mirror?url=${fragInfo.url}`"
      sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts"
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
import apiUrl from '~/modules/api-url'
import { CEM } from '~/modules/custom-event-manager'

export default {
  components: { IconPlus },
  props: {
    fragInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fragIndex: {
      type: Number,
      default: 0
    },
    isReadOnly: {
      type: Boolean,
      default: false
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
    /** @type {HTMLElement} */
    const rootElm = this.$el
    /** @type {HTMLIFrameElement} */
    const webview = this.$refs.webview

    // When the postit fragment is loaded
    // find the user's target with the selector
    // and adjust its position to the right place
    if (this.fragInfo.mode === 'postit') {
      rootElm.style.opacity = '0'
      rootElm.style.width = '1400px'
      rootElm.style.height = '1200px'
      rootElm.style.pointerEvents = 'none'
      webview.style.width = '1400px'
      webview.style.height = '1200px'

      webview.addEventListener('load', e => {
        const fDocument = webview.contentDocument
        const fHtml = fDocument.documentElement
        const fBody = fDocument.body

        fHtml.style.width = '1400px'
        fHtml.style.height = '1200px'
        fHtml.style.position = 'absolute'
        fHtml.style.left = '0px'
        fHtml.style.top = '0px'

        const inputs = fDocument.getElementsByTagName('input')
        for (let i = 0; i < inputs.length; i += 1) {
          inputs[i].disabled = true
        }

        try {
          /** @type {HTMLElement} */
          const userTarget = Array.from(
            fDocument.querySelectorAll(this.fragInfo.selector.name)
          )[this.fragInfo.selector.offset]

          // TODO: Tree Pruning

          const userTargetRect = userTarget.getBoundingClientRect()
          const userTargetX = userTargetRect.left
          const userTargetY = userTargetRect.top
          const userTargetWidth = userTargetRect.width
          const userTargetHeight = userTargetRect.height

          // fHtml.style.transform = `translateX(-${userTargetX}px) translateY(-${userTargetY}px)`
          webview.style.left = -userTargetX + 'px'
          webview.style.top = -userTargetY + 'px'

          rootElm.style.width = `${userTargetWidth}px`
          rootElm.style.height = `${userTargetHeight}px`

          rootElm.style.opacity = '1'
          rootElm.style.pointerEvents = 'all'
        } catch (error) {
          console.error('WEBGLUE Error', error)
          rootElm.style.opacity = '1'
          rootElm.style.pointerEvents = 'all'
          window.alert(
            '프래그먼트를 찾지 못했습니다. 문서의 구조가 변경되었을 수 있습니다.'
          )
          rootElm.classList.add('error')
        }
      })
    }

    rootElm.addEventListener('contextmenu', e => {
      e.preventDefault()
      CEM.dispatchEvent('context', {
        target: this.$el
      })
    })

    rootElm.addEventListener('mouseenter', () => {
      if (this.fragInfo.mode === 'postit') {
        this.stat.hover = true
      }
    })

    rootElm.addEventListener('mouseleave', () => {
      if (this.fragInfo.mode === 'postit') {
        this.stat.hover = false
      }
    })

    // if (this.isReadOnly) {
    //   return
    // }

    rootElm.addEventListener('mousedown', e => {
      if (e.which === 3) {
        return
      }

      if (this.fragInfo.mode === 'postit') {
        if (e.target.closest('.boundary-line')) {
          return
        }

        e.preventDefault()
        this.stat.catched = true
        this.origin.pointer.x = e.clientX
        this.origin.pointer.y = e.clientY
        this.origin.position.x = this.fragInfo.position.x
        this.origin.position.y = this.fragInfo.position.y
      }
    })

    let mouseMoveCallback
    window.addEventListener(
      'mousemove',
      (mouseMoveCallback = e => {
        if (!this.stat.catched) {
          return
        }

        if (this.stat.catched) {
          this.$store.commit('glueBoard/setMode', 'dragging')
          this.stat.isMoving = true
          const moveX = e.clientX - this.origin.pointer.x
          const moveY = e.clientY - this.origin.pointer.y

          let newX = this.origin.position.x + moveX
          let newY = this.origin.position.y + moveY

          if (newX <= 0) {
            newX = 0
          }
          if (newY <= 0) {
            newY = 0
          }

          this.fragInfo.position.x = newX
          this.fragInfo.position.y = newY

          const fragmentElms = document.querySelectorAll(
            '.webglue-fragment.postit:not(.hover)'
          )

          this.stat.isValidPos = true

          for (let i = 0; i < fragmentElms.length; i += 1) {
            const otherFragRect = fragmentElms[i].getBoundingClientRect()
            const otherFragHalfX = otherFragRect.width / 2
            const otherFragHalfY = otherFragRect.height / 2
            const otherFragCenterX = otherFragRect.left + otherFragHalfX
            const otherFragCenterY = otherFragRect.top + otherFragHalfY

            const thisFragRect = rootElm.getBoundingClientRect()
            const thisFragHalfX = thisFragRect.width / 2
            const thisFragHalfY = thisFragRect.height / 2
            const thisFragCenterX = thisFragRect.left + thisFragHalfX
            const thisFragCenterY = thisFragRect.top + thisFragHalfY

            const distanceX = Math.abs(thisFragCenterX - otherFragCenterX)
            const distanceY = Math.abs(thisFragCenterY - otherFragCenterY)

            if (
              distanceX <= thisFragHalfX + otherFragHalfX &&
              distanceY <= thisFragHalfY + otherFragHalfY
            ) {
              this.stat.isValidPos = false
              break
            }
          }
          this.$emit('fragmentmove')
        }
      })
    )

    let mouseUpCallback
    window.addEventListener(
      'mouseup',
      (mouseUpCallback = () => {
        if (this.stat.catched) {
          this.stat.catched = false
        }

        if (!this.stat.isMoving || this.fragInfo.mode !== 'postit') {
          return
        }

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
        // window.removeEventListener('mousemove', mouseMoveCallback)
        // window.removeEventListener('mouseup', mouseUpCallback)

        // Emit mouseup event and change the fragments
        // position data from the parent
        // this.$emit('donemove', {
        //   x: this.fragInfo.position.x,
        //   y: this.fragInfo.position.y
        // })
        this.$emit('fragmentmove')
        this.$emit('donemove', {
          x: this.fragInfo.position.x,
          y: this.fragInfo.position.y,
          fragmentId: this.fragInfo.id
        })
      })
    )

    // When new mode, use selector
    if (this.fragInfo.mode === 'new') {
      webview.addEventListener('load', () => {
        /** @type {Window} */
        const fragWindow = webview.contentWindow
        /** @type {Document} */
        const fragDocument = webview.contentDocument

        let newMouseMoveEventCallback
        fragWindow.addEventListener(
          'mousemove',
          (newMouseMoveEventCallback = e => {
            const rect = e.target.getBoundingClientRect()
            const payload = {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height
            }
            this.$emit('sniff', payload)
          })
        )

        let newMouseDownEventCallback
        fragWindow.addEventListener(
          'mousedown',
          (newMouseDownEventCallback = e => {
            e.stopPropagation()
            e.preventDefault()
            /** @type {HTMLElement} */
            const target = e.target
            const rect = e.target.getBoundingClientRect()
            const moveX = rect.left + fragWindow.scrollX
            const moveY = rect.top
            const initialX = e.pageX
            const initialY = e.pageY

            let mousemoveCallback, mouseupCallback

            const fragBody = webview.contentDocument.body
            const transitionTime = 1000
            webview.style.transition = `top ${transitionTime}ms ease, left ${transitionTime}ms ease`
            webview.style.position = 'absolute'
            webview.style.width = fragBody.clientWidth + 'px'
            // webview.style.height = fragBody.clientHeight + 'px'
            webview.style.height = webview.contentWindow.innerHeight + 'px'
            webview.style.left = 0
            webview.style.top = 0
            // eslint-disable-next-line no-unused-expressions
            webview.getBoundingClientRect().left

            webview.style.left = -moveX + 'px'
            webview.style.top = -moveY + 'px'

            rootElm.style.transition = `all ${transitionTime}ms`
            // eslint-disable-next-line no-unused-expressions
            rootElm.getBoundingClientRect().left
            rootElm.classList.remove('new')
            rootElm.style.left = rect.left + 'px'
            rootElm.style.top = rect.top + 'px'
            rootElm.style.width = rect.width + 'px'
            rootElm.style.height = rect.height + 'px'

            setTimeout(() => {
              rootElm.style.transition = ''
            }, 1300)

            this.fragInfo.mode = 'postit'

            this.$store.commit('glueBoard/setMode', 'idle')

            let selector = ''
            if (target.id) {
              selector = `#${target.id}`
            } else if (target.className) {
              if (target.parentElement && target.parentElement.id) {
                selector = `#${target.parentElement.id} `
              } else if (
                target.parentElement &&
                target.parentElement.className
              ) {
                for (
                  let i = 0;
                  i < target.parentElement.classList.length;
                  i += 1
                ) {
                  selector += `.${target.parentElement.classList[i]}`
                }

                selector += ' '
              }

              for (let i = 0; i < target.classList.length; i += 1) {
                selector += `.${target.classList[i]}`
              }
            }

            const selectorIndex = Array.from(
              fragDocument.querySelectorAll(selector)
            ).indexOf(target)

            const a = initialX - parseInt(this.$el.style.left)
            const b = initialY - parseInt(this.$el.style.top)
            let mouseX = e.pageX - a
            let mouseY = e.pageY - b
            window.addEventListener(
              'mousemove',
              (mousemoveCallback = e => {
                mouseX = e.pageX - a
                mouseY = e.pageY - b
                this.$el.style.left = mouseX + 'px'
                this.$el.style.top = mouseY + 'px'
              })
            )
            window.addEventListener(
              'mouseup',
              (mouseupCallback = e => {
                this.$emit('exitnewmode', {
                  position: {
                    x: mouseX,
                    y: mouseY
                  },
                  size: {
                    width: rect.width,
                    height: rect.height
                  },
                  selector,
                  selectorIndex,
                  url: this.fragInfo.url
                })
                window.removeEventListener('mousemove', mousemoveCallback)
                window.removeEventListener('mouseup', mouseupCallback)
              })
            )

            // Remove mouse event listeners
            fragWindow.removeEventListener(
              'mousedown',
              newMouseDownEventCallback
            )
            fragWindow.removeEventListener(
              'mousemove',
              newMouseMoveEventCallback
            )
          })
        )

        fragWindow.addEventListener('click', e => {
          e.stopPropagation()
          e.preventDefault()
        })
      })
    }
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
  transition: box-shadow 300ms ease, opacity 500ms ease;
  cursor: default;
  border-radius: 0px;
  box-shadow: 0 0.2rem 0.4rem rgba(#000, 0.2);
  overflow: hidden;

  &[is-subscribed] {
    border: 1px solid #5ed02f;
  }

  &.error {
    border: 1px solid red;
    filter: invert(1);
  }

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
    box-shadow: 0 1rem 2rem rgba(#000, 0.2);
  }

  &.active {
    // transform: scale(0.92);
    // box-shadow: 0 1rem 2rem rgba(#000, 0.3);
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
      display: flex;
      align-items: center;
      justify-content: center;
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
