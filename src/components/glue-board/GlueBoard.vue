<template>
  <div class="glue-board-scroll-wrapper">
    <div class="glue-board-sentinel" />
    <div class="glue-board-fragment-container">
      <Fragment
        v-for="(frag, i) in fragments"
        :key="frag.id"
        :frag-info="frag"
        :class="`fragment-${frag.id}`"
        @cancel="cancelNewFragment(i)"
        @sniff="updateSelector"
        @exitnewmode="changeModeTo($event, 'postit', i)"
        @fragmentmove="calculateWrapperSize"
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
import apiUrl from '~/modules/api-url'
import Axios from 'axios'

export default {
  components: { Fragment, UrlBar, Selector },
  props: {
    glueBoardId: {
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
      maxBottom: -Infinity
    }
  },
  watch: {
    fragments(frags) {
      console.log(frags)
    }
  },
  mounted() {
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
    this.loadFragments()
  },
  methods: {
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

        console.log('min left:', this.minLeft)
      }

      const sentinel = document.getElementsByClassName('glue-board-sentinel')[0]
      sentinel.style.width = this.maxRight - this.minLeft + 'px'
      sentinel.style.height = this.maxBottom - this.minTop + 'px'
      sentinel.style.left = this.minLeft + 'px'
      sentinel.style.top = this.minTop + 'px'
    },
    updateFragmentData(payload, index) {
      console.log('position updated')
      console.log(index, payload)
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
      console.log('change mode to ' + mode)
      this.fragments[index].mode = mode
      console.log(payload)
      this.fragments[index].position = payload.position
      this.fragments[index].size = payload.size
      console.log(JSON.stringify(this.fragments, null, 2))
    },
    generateRandomId() {
      return Math.random()
        .toString(36)
        .substr(2, 5)
    },
    loadFragments() {
      Axios({
        ...apiUrl.fragment.list(this.glueBoardId),
        withCredentials: true
      }).then(res => {
        this.fragments = res.data.fragments
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
      //     url: 'https://comic.naver.com',
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
      //     url: 'https://comic.naver.com',
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
      url = apiUrl.mirror(url)
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
        id: this.generateRandomId()
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
</style>
