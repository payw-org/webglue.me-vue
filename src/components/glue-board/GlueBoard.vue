<template>
  <div class="glue-board-scroll-wrapper">
    <Context
      class="contextmenu"
      :context-data="{
        glueBoardId
      }"
      @selecttime="activateTimePopUp($event)"
      @closeselector="deactivateTimePopUp"
    />
    <div v-if="selectTime" class="selector">
      <div class="speech-point" />
      <div class="time-selector">
        <div>
          <button class="thirty-m" @click="deactivateTimePopUp">
            30분
          </button>
          <button class="one-h" @click="deactivateTimePopUp">
            1시간
          </button>
          <button class="three-h" @click="deactivateTimePopUp">
            3시간
          </button>
        </div>
      </div>
    </div>
    <div class="glue-board-sentinel" />
    <div class="glue-board-fragment-container">
      <Fragment
        v-for="(frag, i) in fragments"
        :key="frag.localId"
        :frag-info="frag"
        :frag-index="i"
        :class="`fragment-${frag.id}`"
        :is-read-only="glueBoardHash !== undefined"
        @cancel="cancelNewFragment(i)"
        @sniff="updateSelector"
        @exitnewmode="changeModeTo($event, 'postit', i)"
        @fragmentmove="calculateWrapperSize"
        @donemove="updateFragmentData"
        @fragmentselect="fragmentSelect"
      />
    </div>
    <div class="zoom-btn">
      <button class="zoom-in" @click="zoomIn">
        <img class="plus" src="~/assets/images/plus.svg" />
      </button>
      <button class="zoom-out" @click="zoomOut">
        <img class="minus" src="~/assets/images/minus.svg" />
      </button>
    </div>
    <UrlBar
      v-if="$store.state.glueBoard.isURLBarActive"
      @urlentered="createNewFragment"
    />
    <Selector v-if="$store.state.glueBoard.mode === 'new'" :rect="rect" />
  </div>
</template>

<script>
import Fragment from '~/components/glue-board/Fragment'
import UrlBar from '~/components/glue-board/UrlBar'
import Selector from '~/components/glue-board/Selector'
import Context from '~/components/glue-board/Context'
import apiUrl from '~/modules/api-url'
import Axios from 'axios'
import { CEM } from '~/modules/custom-event-manager'
import Utils from '../../modules/utils'

export default {
  components: { Fragment, UrlBar, Selector, Context },
  props: {
    glueBoardId: {
      type: String,
      default: ''
    },
    glueBoardHash: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      initialheight: null,
      initialwidth: null,
      initialscale: null,
      resizedirection: null,
      initialposition: null,
      willResizeElm: null,
      glueboardsize: 1,
      fragmentsize: 1,
      fragments: [],
      rect: {
        x: 0,
        y: 0,
        width: 0,
        heigth: 0
      },
      minLeft: Infinity,
      maxRight: -Infinity,
      minTop: Infinity,
      maxBottom: -Infinity,
      isReadOnly: false,
      initialX: 0,
      initialY: 0,
      scrollLeft: 0,
      scrollTop: 0,
      selectTime: false
    }
  },
  watch: {
    fragments(frags) {}
  },
  mounted() {
    // Remove fragment custom event
    CEM.addEventListener('removefragment', this.$el, e => {
      const index = e.detail
      this.fragments.splice(index, 1)
    })

    if (this.glueBoardHash) {
      this.isReadOnly = true
      this.loadFragments()

      return
    }

    window.addEventListener('mousemove', event => {
      if (this.resizedirection === 'right') {
        if (event.pageX < this.initialposition) {
          const size =
            (this.initialwidth - (this.initialposition - event.pageX) * 2) /
            parseInt(this.willResizeElm.style.width)
          this.willResizeElm.style.transform = `scale(${size})`
        } else if (event.pageX > this.initialposition) {
          const size =
            (this.initialwidth + (event.pageX - this.initialposition) * 2) /
            parseInt(this.willResizeElm.style.width)
          this.willResizeElm.style.transform = `scale(${size})`
        }
      } else if (this.resizedirection === 'left') {
        if (event.pageX < this.initialposition) {
          const size =
            (this.initialwidth + (this.initialposition - event.pageX) * 2) /
            parseInt(this.willResizeElm.style.width)
          this.willResizeElm.style.transform = `scale(${size})`
        } else if (event.pageX > this.initialposition) {
          const size =
            (this.initialwidth - (event.pageX - this.initialposition) * 2) /
            parseInt(this.willResizeElm.style.width)
          this.willResizeElm.style.transform = `scale(${size})`
        }
      } else if (this.resizedirection === 'top') {
        if (event.pageY < this.initialposition) {
          const size =
            (this.initialheight + (this.initialposition - event.pageY) * 2) /
            parseInt(this.willResizeElm.style.height)
          this.willResizeElm.style.transform = `scale(${size})`
        } else if (event.pageY > this.initialposition) {
          const size =
            (this.initialheight - (event.pageY - this.initialposition) * 2) /
            parseInt(this.willResizeElm.style.height)
          this.willResizeElm.style.transform = `scale(${size})`
        }
      } else if (this.resizedirection === 'bottom') {
        if (event.pageY < this.initialposition) {
          const size =
            (this.initialheight - (this.initialposition - event.pageY) * 2) /
            parseInt(this.willResizeElm.style.height)
          this.willResizeElm.style.transform = `scale(${size})`
        } else if (event.pageY > this.initialposition) {
          const size =
            (this.initialheight + (event.pageY - this.initialposition) * 2) /
            parseInt(this.willResizeElm.style.height)
          this.willResizeElm.style.transform = `scale(${size})`
        }
      }
    })
    window.addEventListener('mouseup', () => {
      this.resizedirection = null
    })
    window.addEventListener('mousedown', event => {
      if (event.target.closest('.webglue-fragment')) {
        return
      }
      this.initialX = event.clientX
      this.initialY = event.clientY
      const glueboardScroll = document.querySelector(
        '.glue-board-scroll-wrapper'
      )
      let scrollLeft = glueboardScroll.scrollLeft
      let scrollTop = glueboardScroll.scrollTop
      this.scrollLeft = scrollLeft
      this.scrollTop = scrollTop

      let mousemoveCallback, mouseupCallback

      window.addEventListener(
        'mousemove',
        (mousemoveCallback = event => {
          scrollLeft = this.scrollLeft
          scrollTop = this.scrollTop
          const mouseXPos = event.clientX
          const mouseYPos = event.clientY

          scrollLeft += (mouseXPos - this.initialX) / 2
          scrollTop += (mouseYPos - this.initialY) / 2
          glueboardScroll.scrollTo(scrollLeft, scrollTop)
        })
      )

      window.addEventListener(
        'mouseup',
        (mouseupCallback = event => {
          window.removeEventListener('mousemove', mousemoveCallback)
          window.removeEventListener('mouseup', mouseupCallback)
        })
      )
    })

    this.loadFragments()
  },
  methods: {
    deactivateTimePopUp() {
      this.selectTime = false
    },
    activateTimePopUp(conElem) {
      this.selectTime = true
      this.$nextTick(() => {
        const timeSelectorElm = document.querySelector('.selector')
        timeSelectorElm.style.left =
          conElem.getBoundingClientRect().width +
          conElem.getBoundingClientRect().left +
          10 +
          'px'
        timeSelectorElm.style.top =
          conElem.getBoundingClientRect().top +
          conElem.getBoundingClientRect().height / 3 +
          'px'
      })
    },
    fragmentSelect(payload, data) {
      this.willResizeElm = payload
      if (data === 'right') {
        this.initialposition = this.willResizeElm.getBoundingClientRect().right
        this.resizedirection = 'right'
      } else if (data === 'left') {
        this.initialposition = this.willResizeElm.getBoundingClientRect().left
        this.resizedirection = 'left'
      } else if (data === 'top') {
        this.initialposition = this.willResizeElm.getBoundingClientRect().top
        this.resizedirection = 'top'
      } else if (data === 'bottom') {
        this.initialposition = this.willResizeElm.getBoundingClientRect().bottom
        this.resizedirection = 'bottom'
      }
      this.initialwidth = this.willResizeElm.getBoundingClientRect().width
      this.initialheight = this.willResizeElm.getBoundingClientRect().height
      const scale = this.willResizeElm.style.transform
      const regExp = /[+-]?\d+(?:\.\d+)?/g
      const regExpResult = regExp.exec(scale)
      let scaleVal = 1
      if (regExpResult) {
        scaleVal = Number(regExpResult[0])
      }
      this.initialscale = scaleVal
    },
    calculateWrapperSize() {
      this.minLeft = Infinity
      this.maxRight = -Infinity
      this.minTop = Infinity
      this.maxBottom = -Infinity

      /** @type {HTMLElement[]} */
      const fragElms = document.querySelectorAll('.webglue-fragment')
      for (let i = 0; i < this.fragments.length; i++) {
        const leftOffset = fragElms[i].getBoundingClientRect().left
        const rightOffset = fragElms[i].getBoundingClientRect().right
        const topOffset = fragElms[i].getBoundingClientRect().top
        const bottomOffset = fragElms[i].getBoundingClientRect().bottom
        if (leftOffset < this.minLeft) {
          this.minLeft = leftOffset
        }
        if (rightOffset > this.maxRight) {
          this.maxRight = rightOffset
        }
        if (topOffset < this.minTop) {
          this.minTop = topOffset
        }
        if (bottomOffset > this.maxBottom) {
          this.maxBottom = bottomOffset
        }
      }

      const sentinel = document.getElementsByClassName('glue-board-sentinel')[0]
      sentinel.style.width = this.maxRight - this.minLeft + 'px'
      sentinel.style.height = this.maxBottom - this.minTop + 'px'
      sentinel.style.left = this.minLeft + 'px'
      sentinel.style.top = this.minTop + 'px'
    },
    updateFragmentData(payload) {
      Axios({
        ...apiUrl.fragment.update(this.glueBoardId, payload.fragmentId),
        withCredentials: true,
        data: {
          xPos: payload.x,
          yPos: payload.y
        }
      })
        .then(() => {})
        .catch(err => {
          console.error(err)
        })
    },
    zoomIn() {
      this.glueboardsize += 0.2
      const zoomElm = document.querySelector('.glue-board-fragment-container')
      zoomElm.style.transform = `scale(${this.glueboardsize})`
    },
    zoomOut() {
      if (this.glueboardsize - 0.2 > 0.001) {
        this.glueboardsize -= 0.2
        const zoomElm = document.querySelector('.glue-board-fragment-container')
        zoomElm.style.transform = `scale(${this.glueboardsize})`
      }
    },
    sniff(payload) {
      this.$emit('sniff', payload)
    },
    changeModeTo(payload, mode, index) {
      this.fragments[index].mode = mode
      this.fragments[index].position = payload.position
      this.fragments[index].size = payload.size

      const data = {
        url: payload.url,
        selector: {
          name: payload.selector,
          offset: payload.selectorIndex
        },
        xPos: payload.position.x,
        yPos: payload.position.y
      }

      console.log('creating data', data)
      Axios({
        ...apiUrl.fragment.create(this.glueBoardId),
        withCredentials: true,
        data
      })
        .then(res => {
          console.log('created')
          this.fragments[index].id = res.data.createdID
        })
        .catch(err => {
          console.error(err)
        })
    },
    generateRandomId() {
      return Math.random()
        .toString(36)
        .substr(2, 5)
    },
    loadFragments() {
      let api
      if (this.glueBoardHash) {
        api = apiUrl.glueBoard.shared(this.glueBoardHash)
      } else {
        api = apiUrl.fragment.list(this.glueBoardId)
      }

      Axios({
        ...api,
        withCredentials: true
      }).then(res => {
        /** @type {Array} */
        const fragments = res.data.fragments.map(frag => {
          return {
            localId: Utils.makeId(),
            id: frag.id,
            mode: 'postit',
            position: {
              x: frag.xPos,
              y: frag.yPos
            },
            url: frag.url,
            selector: frag.selector
          }
        })

        this.fragments = fragments
      })

      // this.fragments = [
      //   {
      //     position: {
      //       x: 50,
      //       y: 100
      //     },
      //     size: {
      //       width: 400,
      //       height: 550
      //     },
      //     url: 'https://naver.com',
      //     mode: 'postit',
      //     selector: '',
      //     id: this.generateRandomId()
      //   },
      //   {
      //     position: {
      //       x: 500,
      //       y: 150
      //     },
      //     size: {
      //       width: 400,
      //       height: 550
      //     },
      //     url: 'https://naver.com',
      //     mode: 'postit',
      //     selector: '',
      //     id: this.generateRandomId()
      //   }
      // ]
    },
    updateSelector(payload) {
      this.rect = payload
    },
    createNewFragment(url) {
      // url = apiUrl.mirror(url)
      this.$store.commit('glueBoard/setMode', 'new')
      this.fragments.push({
        position: {
          x: null,
          y: null
        },
        size: {
          width: null,
          heigth: null
        },
        url,
        mode: 'new',
        selector: '',
        localId: Utils.makeId()
      })
    },
    cancelNewFragment(index) {
      this.$store.commit('glueBoard/setMode', 'idle')
      this.fragments.splice(index, 1)
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

  .glue-board-sentinel {
    position: absolute;
  }

  .glue-board-fragment-container {
    display: inline-block;
    transition: transform 200ms ease;
    transform-origin: center;
    ::after {
      content: '';
      display: block;
      clear: both;
    }
  }

  .zoom-btn {
    position: fixed;
    z-index: 500;

    width: 7rem;
    height: 3rem;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    flex-direction: row;

    .zoom-in,
    .zoom-out {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      background-color: #cecece;

      &:hover {
        background-color: #bdbdbd;
      }
    }
    .zoom-in {
      border-top-left-radius: 50%;
      border-bottom-left-radius: 50%;

      .plus {
        width: 45%;
        padding-left: 0.1rem;
      }
    }
    .zoom-out {
      border-top-right-radius: 50%;
      border-bottom-right-radius: 50%;

      .minus {
        width: 45%;
        padding-right: 0.1rem;
      }
    }
  }
}
.selector {
  display: flex;
  flex-direction: row;
  position: fixed;
  width: 4rem;
  height: 5.4rem;
  z-index: 100000;

  .speech-point {
    width: 1rem;
    height: 1rem;
    transform: rotate(45deg) translateY(50%);
    position: absolute;
    top: 0.8rem;
    left: 0rem;
    background-color: #4e4e4e;
    border-radius: 3px;
    z-index: -1;
  }
  .time-selector {
    background-color: #4e4e4e;
    border-radius: 0.5rem;
    width: 3rem;
    .thirty-m,
    .one-h,
    .three-h {
      font-size: 0.7rem;
      width: 100%;
      text-align: center;
      color: white;
      height: 1.8rem;
      &:hover {
        transition: transform 200ms ease;
        background-color: #a7a6a6;
      }
    }
    .thirty-m {
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }
    .three-h {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }
  }
}
</style>
