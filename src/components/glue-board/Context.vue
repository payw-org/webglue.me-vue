<template>
  <div id="glueboard-context">
    <ol>
      <li class="delete">
        삭제
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
      glueBoards: []
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
      CEM.dispatchEvent('closecontext', {
        target: this.$el
      })
    })
    CEM.addEventListener('context', this.$el, e => {
      /** @type {HTMLElement} */
      const fragment = e.detail.target
      const fragRect = fragment.getBoundingClientRect()
      this.$el.style.left = `${fragRect.left + fragRect.width / 2}px`
      this.$el.style.top = `${fragRect.top + fragRect.height / 2}px`
      this.$el.classList.add('active')
    })

    CEM.addEventListener('closecontext', this.$el, e => {
      this.$el.classList.remove('active')
    })
  },
  methods: {
    /**
     * @param {MouseEvent} e
     */
    moveFragment(e) {
      /** @type {HTMLElement} */
      const target = e.target
      const gboardId = target.getAttribute('data-glueboard-id')
      const splitFragId = this.fragmentId.split('-')
      const fragId = splitFragId[1]
      Axios({
        ...apiUrl.fragment.update(this.glueboardId, fragId),
        data: {
          transferGlueBoardID: gboardId
        },
        withCredentials: true
      })
        .then(res => {
          console.log('서버에 저장됨')
          const updatingFragIndex = Number(
            this.targetFrag.getAttribute('data-fragment-index')
          )
          console.log('updating frag index', updatingFragIndex)
          CEM.dispatchEvent('removefragment', updatingFragIndex)
        })
        .catch(err => {
          console.error(err)
        })
    },
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
  z-index: 99999999999999;
  pointer-events: none;
  opacity: 0;
  // transition: all 200ms ease;
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
      transition: background-color 200ms ease, color 200ms ease,
        transform 200ms ease;
      user-select: none;
      border-bottom: 1px solid rgba(#fff, 0.15);
      text-align: center;

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
    }
  }
}
</style>
