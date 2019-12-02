<template>
  <div id="glueboard-context">
    <ol>
      <li class="delete" @click="deleteFragment">
        삭제
      </li>
      <li class="alarm" @click="setNotifier">
        <div class="alarm-btn">
          <img src="~assets/images/bell.svg" class="alarm-image" />
          <div class="alarm-text">
            {{ notifyTitle }}
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
      glueBoardId: '',
      fragmentId: '',
      targetFrag: undefined,
      notifyTitle: ''
    }
  },
  mounted() {
    Axios({
      ...apiUrl.glueBoard.list,
      withCredentials: true
    }).then(res => {
      this.glueBoards = res.data.glueBoards.filter(gb => {
        return gb.id !== this.$route.params.category
      })
    })

    window.addEventListener('mousedown', e => {
      if (!e.target.closest('#glueboard-context')) {
        CEM.dispatchEvent('closecontext')
      }
    })

    CEM.addEventListener('context', this.$el, e => {
      /** @type {HTMLElement} */
      const fragment = e.detail.target

      if (fragment.getAttribute('is-subscribed')) {
        this.notifyTitle = '알림 해제'
      } else {
        this.notifyTitle = '알림 등록'
      }

      this.targetFrag = fragment
      this.fragmentId = fragment.getAttribute('data-fragment-id')
      this.glueBoardId = this.$route.params.category
      const fragRect = fragment.getBoundingClientRect()
      this.$el.style.left = `${fragRect.left + fragRect.width / 2}px`
      this.$el.style.top = `${fragRect.top + fragRect.height / 2}px`
      this.$el.classList.add('active')
    })

    CEM.addEventListener('closecontext', this.$el, e => {
      this.$emit('closeselector')
      this.$el.classList.remove('active')
    })
  },
  methods: {
    setNotifier() {
      let subscription = true
      if (this.targetFrag.getAttribute('is-subscribed')) {
        subscription = false
      }

      Axios({
        ...apiUrl.fragment.update(this.glueBoardId, this.fragmentId),
        withCredentials: true,
        data: {
          subscription
        }
      })
        .then(res => {
          console.log(
            'update subscription',
            subscription,
            this.glueBoardId,
            this.fragmentId
          )
          CEM.dispatchEvent('closecontext')
          const targetFrag = document.querySelector(
            `[data-fragment-id="${this.fragmentId}"]`
          )

          if (subscription) {
            targetFrag.setAttribute('is-subscribed', 'true')
          } else {
            targetFrag.removeAttribute('is-subscribed')
          }
        })
        .catch(err => {
          console.error('subscription failed')
          console.error(err)
        })
    },
    /**
     * @param {MouseEvent} e
     */
    moveFragment(e) {
      /** @type {HTMLElement} */
      const target = e.target
      const gboardId = target.getAttribute('data-glueboard-id')
      Axios({
        ...apiUrl.fragment.update(this.glueBoardId, this.fragmentId),
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
          CEM.dispatchEvent('closecontext')
        })
        .catch(err => {
          console.error(err)
        })
    },
    deleteFragment() {
      Axios({
        ...apiUrl.fragment.delete(this.glueBoardId, this.fragmentId),
        withCredentials: true
      })
        .then(res => {
          const deletingFragIndex = Number(
            this.targetFrag.getAttribute('data-fragment-index')
          )
          CEM.dispatchEvent('removefragment', deletingFragIndex)
          CEM.dispatchEvent('closecontext')
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
      height: 3rem;
      user-select: none;
      border-bottom: 1px solid rgba(#fff, 0.15);
      text-align: center;
      z-index: 12000;
      display: flex;
      align-items: center;
      justify-content: center;

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
        color: #66d679;
        font-weight: fw(5);
        background-color: rgba(#fff, 0.1);
        align-items: center;

        .alarm-btn {
          display: flex;
          flex-direction: row;
          align-items: center;

          .alarm-image {
            padding-right: 0.4rem;
            width: 1.5rem;
            height: 1.5rem;
          }

          .alarm-text {
            padding-left: 0.1rem;
            padding-right: 0.2rem;
          }
        }

        &:hover {
          background-color: #25b32c;
          color: #fff;
        }
      }
    }
  }
}
</style>
