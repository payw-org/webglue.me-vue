<template>
  <div id="glueboard-context">
    <ol>
      <li class="delete" @click="deleteFragment">
        삭제
      </li>
      <li class="alarm" @click="timeSelected">
        <div class="alarm-btn">
          <img src="~assets/images/bell.svg" class="alarm-image" />
          <div class="alarm-text">
            알림
          </div>
        </div>
      </li>
      <li
        v-for="gBoard in glueBoards"
        :key="gBoard.id"
        :data-glueboard-id="gBoard.id"
        @click="moveFragment"
      >
        → {{ gBoard.category.name }}
      </li>
    </ol>
  </div>
</template>

<script>
import apiUrl from '~/modules/api-url'
import Axios from 'axios'
import { CEM } from '~/modules/custom-event-manager'

export default {
  props: {
    contextData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      glueBoards: [],
      glueboardId: '',
      fragmentId: '',
      targetFrag: undefined
    }
  },
  mounted() {
    Axios({
      ...apiUrl.glueBoard.list,
      withCredentials: true
    }).then(res => {
      this.glueBoards = res.data.glueBoards
    })
    window.addEventListener('mouseup', e => {
      /** @type {HTMLElement} */
      const target = e.target
      if (e.target.closest('.alarm')) {
        return
      }
      CEM.dispatchEvent('closecontext', {
        target: this.$el
      })
    })
    CEM.addEventListener('context', this.$el, e => {
      /** @type {HTMLElement} */
      const fragment = e.detail.target
      this.targetFrag = fragment
      this.fragmentId = fragment.getAttribute('data-fragment-id')
      this.glueboardId = this.$route.params.category
      const fragRect = fragment.getBoundingClientRect()
      this.$el.style.left = `${fragRect.left + fragRect.width}px`
      this.$el.style.top = `${fragRect.top + fragRect.height}px`
      this.$el.classList.add('active')
    })

    CEM.addEventListener('closecontext', this.$el, e => {
      this.$emit('closeselector')
      this.$el.classList.remove('active')
    })
  },
  methods: {
    timeSelected() {
      this.$emit('selecttime', this.$el)
    },
    /**
     * @param {MouseEvent} e
     */
    moveFragment(e) {
      /** @type {HTMLElement} */
      const target = e.target
      const gboardId = target.getAttribute('data-glueboard-id')
      Axios({
        ...apiUrl.fragment.update(this.glueboardId, this.fragmentId),
        data: {
          transferGlueBoardID: gboardId
        },
        withCredentials: true
      })
        .then(res => {
          const updatingFragIndex = Number(
            this.targetFrag.getAttribute('data-fragment-index')
          )
          CEM.dispatchEvent('removefragment', updatingFragIndex)
        })
        .catch(err => {
          console.error(err)
        })
    },
    deleteFragment() {
      Axios({
        ...apiUrl.fragment.delete(this.glueboardId, this.fragmentId),
        withCredentials: true
      })
        .then(res => {
          const deletingFragIndex = Number(
            this.targetFrag.getAttribute('data-fragment-index')
          )
          CEM.dispatchEvent('removefragment', deletingFragIndex)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

#glueboard-context {
  background-color: rgba(0, 0, 0, 0.7);
  @include bgBlur;
  border-radius: r(6);
  overflow: hidden;
  width: 13rem;
  max-width: 100%;
  position: fixed;
  z-index: 10000;
  pointer-events: none;
  opacity: 0;
  top: 2rem;
  // hover: all 200ms ease;
  transform: translateX(-50%) translateY(-50%);

  &.active {
    opacity: 1;
    pointer-events: all;
  }

  ol {
    li {
      color: #fff;
      padding: s(3) s(4);
      cursor: pointer;
      hover: background-color 200ms ease, color 200ms ease, transform 200ms ease;
      user-select: none;
      border-bottom: 1px solid rgba(#fff, 0.15);
      text-align: center;
      z-index: 12000;

      &:first-child {
        padding-top: s(4);
      }

      &:last-child {
        padding-bottom: s(4);
        border-bottom: none;
      }

      &:hover {
        background-color: rgba(#fff, 0.2);
      }

      &.delete {
        color: #ff2f2f;
        font-weight: fw(5);
        background-color: rgba(#fff, 0.1);

        &:hover {
          background-color: #ff2f2f;
          color: #fff;
        }
      }
      &.alarm {
        color: #7dd666;
        font-weight: fw(5);
        background-color: rgba(#fff, 0.1);
        align-items: center;
        .alarm-btn {
          display: flex;
          padding-left: 2.5rem;
          flex-direction: row;
          align-items: center;
          .alarm-image {
            padding-right: 0.4rem;
            width: 2rem;
            height: 2rem;
          }
          .alarm-text {
            padding-left: 0.1rem;
          }
        }

        &:hover {
          background-color: #7dd666;
          color: #fff;
        }
      }
    }
  }
}
</style>
