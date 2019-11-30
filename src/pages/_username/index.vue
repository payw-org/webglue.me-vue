<template>
  <div>
    <div class="webglue-category">
      <Navigation class="navigation" />
      <transition name="fade">
        <ColorPicker
          v-if="isChangeColor"
          ref="colorPicker"
          class="colorpicker"
          @select="inActivateColorPicker"
          @colorselect="selectColor"
          @chromecolorselect="chromeSelectColor"
        />
      </transition>
      <transition-group class="grid-layout category-box" name="scale" tag="div">
        <div
          v-for="(block, i) in blocks"
          :key="block.localId"
          class="grid-item-wrapper"
          :data-index="i"
        >
          <CategoryBlock
            :cat-name="block.category.name"
            :color="block.category.color"
            :cat-id="block.id"
            :cat-local-id="block.localId"
            :type="block.type"
            :index="i"
            :is-edit-mode="isEditMode"
            @create="createBlock"
            @update="updateBlock(i, $event)"
            @remove="removeBlock"
            @colorchange="activateColorPicker($event, i)"
          />
        </div>

        <div
          v-if="!isEditMode"
          key="category-block-new"
          class="grid-item-wrapper"
        >
          <CategoryBlock
            type="add"
            class="gray"
            @add="addBlock"
            @popup="checkPopupActive"
          />
        </div>
      </transition-group>
      <button class="mypage-btn">
        <a :href="profileLink" class="mypage-link" />
        <img src="~/assets/images/mypage.png" class="mypage-icon" />
      </button>
      <div v-if="isPopUp" class="popup">
        <div class="bg" @click="deactivatePopUp" />
        <div class="color-picker-bg">
          <div class="color-pick">
            카테고리 색깔선택
          </div>
          <div class="button-box">
            <button
              v-for="i in 15"
              :key="`color-picker-${i}`"
              class="color-choose"
              :class="'color' + i"
              @click="selectBlockColor(`color${i}`)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
import ColorPicker from '~/components/ColorPicker'
import Navigation from '~/components/Navigation'
import CategoryBlock from '~/components/CategoryBlock'
import requireAuth from '~/mixins/require-auth'
import ApiUrl from '~/modules/api-url'
import Color from '~/modules/color'
import Utils from '~/modules/utils'

export default {
  components: { Navigation, CategoryBlock, ColorPicker },
  mixins: [requireAuth],
  props: {
    color: {
      type: String,
      default: 'gray'
    }
  },
  data() {
    return {
      isCreating: false,
      newColor: '',
      blockcolor: '',
      blocks: [],
      colors: [],
      isEditMode: false,
      isPopUp: false,
      profileLink: '',
      isChangeColor: false,
      willChangeCatBlockIndex: null,
      isMovePosition: false,
      points: {
        original: {
          x: 0,
          y: 0
        }
      },
      stat: {
        catch: false,
        move: false
      },
      moving: {
        /** @type {HTMLElement} */
        elm: undefined,
        index: undefined,
        x: undefined,
        y: undefined
      },
      isCatMoving: false
    }
  },
  computed: {
    editBtnText() {
      if (this.isEditMode) {
        return '완료'
      } else {
        return '편집'
      }
    }
  },
  mounted() {
    // Load blocks(glueboards)
    Axios({
      ...ApiUrl.glueBoard.list,
      withCredentials: true
    })
      .then(res => {
        this.blocks = res.data.glueBoards.map(item => {
          item.localId = Utils.makeId()
          return item
        })
      })
      .catch(err => {
        console.error(err)
      })

    this.profileLink = `/@${this.$store.state.auth.userInfo.nickname}/profile`

    // Touch actions
    this.$el.addEventListener('touchstart', e => {
      if (!e.target.closest('.real-category')) {
        return
      }

      /** @type {HTMLElement} */
      const target = e.target.closest('.real-category')
      const targetRect = target.getBoundingClientRect()

      const touchOrgX = e.pageX
      const touchOrgY = e.pageY - window.scrollY
      const posOrgX = targetRect.left
      const posOrgY = targetRect.top

      console.log('touchstart on category block', touchOrgX, touchOrgY)

      let touchmoveCallback, touchendCallback

      // Set timeout for long press detection
      const timeout = setTimeout(() => {
        console.log('long press')

        setTimeout(() => {
          console.log('long long press')
        }, 900)

        target.classList.add('long-pressed')

        document.body.classList.add('touch-interactive')

        // If long press is detected
        // remove event listener of touchmove and touchend
        // to prevent additional wrong touch actions
        this.$el.removeEventListener('touchmove', touchmoveCallback)
        this.$el.removeEventListener('touchend', touchendCallback)

        // Clone node
        const clonedNode = target.cloneNode(true)
        clonedNode.removeChild(clonedNode.querySelector('.actions'))
        clonedNode.classList.add('cloned')
        clonedNode.style.position = 'fixed'
        clonedNode.style.width = targetRect.width + 'px'
        clonedNode.style.height = targetRect.height + 'px'
        clonedNode.style.left = targetRect.left + 'px'
        clonedNode.style.top = targetRect.top + 'px'

        target.classList.add('ghost')
        clonedNode.classList.add('bounce')
        document.body.appendChild(clonedNode)

        let LPTMCB, LPTECB
        let movingIndex = Number(
          target.parentElement.getAttribute('data-index')
        )

        window.addEventListener(
          'touchmove',
          (LPTMCB = e => {
            console.log(e.pageX)
            console.log(e)
            const moveX = e.pageX - touchOrgX
            const moveY = e.pageY - window.scrollY - touchOrgY

            // Set clonedNode's style
            clonedNode.style.left = posOrgX + moveX + 'px'
            clonedNode.style.top = posOrgY + moveY + 'px'
            clonedNode.style.zIndex = '8888'

            const clonedNodeRect = clonedNode.getBoundingClientRect()

            // Calculate center axis
            const center = {
              x: clonedNodeRect.left + clonedNodeRect.width / 2,
              y: clonedNodeRect.top + clonedNodeRect.height / 2
            }

            // Scroll up or down
            // if cloned boundary exceeds window
            if (clonedNodeRect.top < 0) {
              window.scrollTo(0, window.scrollY + clonedNodeRect.top)
            } else if (clonedNodeRect.bottom > window.innerHeight) {
              window.scrollTo(
                0,
                window.scrollY + clonedNodeRect.bottom - window.innerHeight
              )
            }

            // Get elms from the pointer axis
            const elms = document.elementsFromPoint(center.x, center.y)

            if (this.isCatMoving) {
              return
            }

            elms.forEach(elm => {
              if (
                elm.classList.contains('grid-item-wrapper') &&
                elm.getAttribute('data-index')
              ) {
                const targetIndex = Number(elm.getAttribute('data-index'))
                movingIndex = Number(
                  target.parentElement.getAttribute('data-index')
                )
                console.log('movingIndex', movingIndex)
                const tempBlocks = this.blocks.slice()

                const cutOut = tempBlocks.splice(movingIndex, 1)[0]
                tempBlocks.splice(targetIndex, 0, cutOut)

                movingIndex = targetIndex

                this.blocks = tempBlocks
                this.isCatMoving = true

                setTimeout(() => {
                  this.isCatMoving = false
                }, 400)
              }
            })
          })
        )

        window.addEventListener(
          'touchend',
          (LPTECB = e => {
            target.classList.remove('long-pressed')
            window.removeEventListener('touchmove', LPTMCB)
            window.removeEventListener('touchmove', LPTECB)

            const gridItemWrapper = document.getElementsByClassName(
              'grid-item-wrapper'
            )[movingIndex]
            const giwRect = gridItemWrapper.getBoundingClientRect()
            clonedNode.classList.add('returning')
            clonedNode.style.left = giwRect.left + 'px'
            clonedNode.style.top = giwRect.top + 'px'
            clonedNode.style.transform = 'scale(1)'

            setTimeout(() => {
              target.classList.remove('ghost')
              if (clonedNode && clonedNode.parentElement) {
                clonedNode.parentElement.removeChild(clonedNode)
              }
              document.body.classList.remove('touch-interactive')
            }, 300)
          })
        )
      }, 400)

      // Touch move event
      this.$el.addEventListener(
        'touchmove',
        (touchmoveCallback = e => {
          console.log('touchmove', e.pageX, e.pageY)
          // Clear timeout for long press detection
          // when touchmove
          if (
            Math.abs(touchOrgX - e.pageX) > 8 ||
            Math.abs(touchOrgY - e.pageY) > 8
          ) {
            clearTimeout(timeout)
            this.$el.removeEventListener('touchmove', touchmoveCallback)
          }
        })
      )

      // Touch end event
      this.$el.addEventListener(
        'touchend',
        (touchendCallback = e => {
          if (
            Math.abs(touchOrgX - e.pageX) < 5 &&
            Math.abs(touchOrgY - e.pageY) < 5 &&
            e.target &&
            e.target.querySelector('.glueboard')
          ) {
          }
          clearTimeout(timeout)
          this.$el.removeEventListener('touchmove', touchendCallback)
        })
      )
    })

    /** @type {HTMLElement} */
    let original

    // Attach mousedown event
    // When mousedown on category block
    // it remembers the original pointer position
    // and apply the movement changes
    // to category block when mousemove
    window.addEventListener('mousedown', e => {
      if (window.isTouchDevice) return

      /** @type {HTMLElement} */
      const target = e.target

      // Mousedown category element
      if (target.closest('.real-category') && !target.closest('.actions')) {
        e.preventDefault()
        e.stopPropagation()
        // Init mousedown event information
        this.stat.catch = true
        this.points.x = e.clientX
        this.points.y = e.clientY

        original = target.closest('.add-category')
        const orgRect = original.getBoundingClientRect()

        // Clone the category element to move
        /** @type {HTMLElement} */
        const clonedNode = original.cloneNode(true)

        // Assign to data
        this.moving.elm = clonedNode
        this.moving.index = Number(
          original.closest('.grid-item-wrapper').getAttribute('data-index')
        )

        // Remove unnecessary elements
        clonedNode.removeChild(clonedNode.querySelector('.actions'))

        // Add additional class names
        clonedNode.classList.add('cloned')

        // Set geometry
        clonedNode.style.width = orgRect.width + 'px'
        clonedNode.style.height = orgRect.height + 'px'
        clonedNode.style.top = orgRect.top + 'px'
        clonedNode.style.left = orgRect.left + 'px'
        clonedNode.style.position = 'absolute'
        document.body.appendChild(clonedNode)
        this.moving.x = orgRect.left
        this.moving.y = orgRect.top
      }
    })

    window.addEventListener('mousemove', e => {
      if (window.isTouchDevice) return

      if (this.stat.catch) {
        if (original) {
          original.classList.add('ghost')
        }

        this.stat.move = true
        const moveX = e.pageX - this.points.x
        const moveY = e.pageY - this.points.y
        this.moving.elm.style.left = this.moving.x + moveX + 'px'
        this.moving.elm.style.top = this.moving.y + moveY + 'px'

        const movingElmRect = this.moving.elm.getBoundingClientRect()

        const center = {
          x: movingElmRect.left + movingElmRect.width / 2,
          y: movingElmRect.top + movingElmRect.height / 2
        }

        const elms = document.elementsFromPoint(center.x, center.y)

        if (this.isCatMoving) {
          return
        }

        elms.forEach(elm => {
          if (
            elm.classList.contains('grid-item-wrapper') &&
            elm.getAttribute('data-index')
          ) {
            const targetIndex = Number(elm.getAttribute('data-index'))
            const movingIndex = this.moving.index
            const tempBlocks = this.blocks.slice()

            const cutOut = tempBlocks.splice(movingIndex, 1)[0]
            tempBlocks.splice(targetIndex, 0, cutOut)

            this.moving.index = targetIndex

            this.blocks = tempBlocks
            this.isCatMoving = true

            setTimeout(() => {
              this.isCatMoving = false
            }, 400)
          }
        })
      }
    })

    window.addEventListener('mouseup', () => {
      if (window.isTouchDevice) {
        return
      }

      if (original && !this.stat.move) {
        const glueBoardLink = original.querySelector('.glueboard-link').href
        window.location.href = glueBoardLink
        console.log('move to link')
      }

      if (this.moving.elm) {
        this.stat.catch = false
        this.stat.move = false
        this.moving.elm.classList.add('returning')
        this.moving.elm.getBoundingClientRect()

        // Move back the cloned element
        // to the position where it was
        const gridItemWrapper = document.getElementsByClassName(
          'grid-item-wrapper'
        )[this.moving.index]
        const giwRect = gridItemWrapper.getBoundingClientRect()
        this.moving.elm.style.left = giwRect.left + 'px'
        this.moving.elm.style.top = giwRect.top + window.scrollY + 'px'

        console.log('updating category position')

        Axios({
          ...ApiUrl.glueBoard.update(
            this.moving.elm.getAttribute('data-category-id')
          ),
          withCredentials: true,
          data: {
            position: this.moving.index
          }
        })
          .then(() => {
            console.log('Position updated')
          })
          .catch(err => {
            console.error(err)
          })

        const originalCloned = original
        setTimeout(() => {
          this.moving.elm.parentElement.removeChild(this.moving.elm)
          if (originalCloned) {
            originalCloned.classList.remove('ghost')
          }
          this.moving.elm = null
        }, 300)
      }

      original = null
    })

    window.addEventListener('mousedown', e => {
      if (window.isTouchDevice) return

      /** @type {HTMLElement} */
      const target = e.target
      if (
        !target.closest('.color-picker') &&
        !target.closest('.add-category')
      ) {
        this.isChangeColor = false
      }
    })
  },
  methods: {
    chromeSelectColor(newColor) {
      const blockElms = document.getElementsByClassName('real-category')
      blockElms[this.willChangeCatBlockIndex].style.backgroundColor = newColor
      blockElms[this.willChangeCatBlockIndex].style.backgroundImage = 'none'
    },
    clickColorPicker() {
      this.isChangeColor = true
    },
    selectColor(newColor) {
      this.blocks[this.willChangeCatBlockIndex].category.color = Color[newColor]
      const blockElms = document.getElementsByClassName('real-category')
      blockElms[this.willChangeCatBlockIndex].style.backgroundImage = ''
    },
    inActivateColorPicker() {
      this.isChangeColor = false
    },
    activateColorPicker(catElem, index) {
      this.willChangeCatBlockIndex = index
      this.isChangeColor = true
      this.$nextTick(() => {
        const colorPickerElm = document.querySelector('.colorpicker')
        colorPickerElm.style.left =
          catElem.getBoundingClientRect().left +
          (catElem.getBoundingClientRect().width -
            colorPickerElm.getBoundingClientRect().width) /
            2 +
          'px'
        colorPickerElm.style.top =
          catElem.getBoundingClientRect().top +
          catElem.getBoundingClientRect().height -
          10 +
          'px'
      })
    },
    selectBlockColor(color) {
      this.deactivatePopUp()
      this.addBlock(color)
      this.newColor = color
    },
    checkPopupActive() {
      this.isPopUp = true
    },
    deactivatePopUp() {
      this.isPopUp = false
    },
    updateCategory() {},
    addBlock(color) {
      color = Color[color] ? Color[color] : color
      const newBlock = {
        category: {
          name: '',
          color
        },
        type: 'temp',
        id: Utils.makeId(),
        localId: Utils.makeId(),
        color
      }
      this.blocks.push(newBlock)
    },
    removeBlock(index) {
      Axios({
        ...ApiUrl.glueBoard.delete(this.blocks[index].id),
        withCredentials: true
      })
        .then(() => {})
        .catch(err => {
          console.error(err)
        })
      this.isChangeColor = false
      const removeTarget = this.$el.querySelectorAll(
        '.category-box .grid-item-wrapper'
      )[index]
      removeTarget.style.width =
        removeTarget.getBoundingClientRect().width + 'px'
      this.blocks.splice(index, 1)
    },
    createBlock(payload) {
      if (this.isCreating) {
        return
      }

      const categoryName = payload.categoryName
      const color = Color[this.newColor] ? Color[this.newColor] : this.newColor

      // Change type from temp to category
      this.blocks[payload.index].category.name = categoryName
      this.blocks[payload.index].type = 'category'
      this.blocks[payload.index].category.name = categoryName

      this.isCreating = true

      Axios({
        ...ApiUrl.glueBoard.create,
        withCredentials: true,
        data: {
          name: categoryName,
          color
        }
      })
        .then(res => {
          console.log(res.data.createdID)
          console.log('Created a category')
          this.blocks[payload.index].id = res.data.createdID
        })
        .catch(err => {
          console.log('An error occurs while creating a category')
          console.error(err)
        })
        .finally(() => {
          this.isCreating = false
        })
    },
    updateBlock(index, payload) {
      const { name } = payload
      this.blocks[index].category.name = name
      // this.inActivateColorPicker()
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.scale-enter-active,
.scale-move,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.scale-enter {
  opacity: 0;
  -webkit-transform: scale(0);
  transform: scale(0);
}

.scale-leave-active {
  opacity: 0;
  position: absolute;
  -webkit-transform: scale(0);
  transform: scale(0);
}

@keyframes bounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1.03);
  }
}

.bounce {
  animation-name: bounce;
  animation-duration: 700ms;
  animation-fill-mode: forwards;
}

.webglue-category {
  display: flex;
  flex-direction: column;
  align-items: center;

  .edit-box {
    padding-top: s(3);
    width: 100%;
    display: flex;
    justify-content: flex-end;

    .edit-button {
      margin-right: 3rem;
    }
  }

  .grid-layout {
    display: grid;
    grid-gap: 1.24rem;
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  }

  .category-box {
    margin: auto;
    margin-top: s(6);
    width: calc(100% - 3rem);
    max-width: 80rem;
    padding-bottom: 3rem;
  }

  .mypage-btn {
    position: fixed;
    background-color: white;
    opacity: 1;
    width: 3.2rem;
    height: 3.2rem;
    left: 1rem;
    bottom: 1rem;
    border-radius: 50%;
    box-shadow: 0 0.5rem 2rem rgba(#000, 0.3);

    .mypage-link {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 3;
    }

    .mypage-icon {
      width: 55%;
      height: 55%;
    }
  }
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(#000, 0.7);
    }
    .color-picker-bg {
      background-color: #fff;
      border-radius: r(4);
      z-index: 1;
      display: block;
      justify-content: center;
      align-items: center;

      .color-pick {
        width: 100%;
        text-align: center;
        color: #6b6b6b;
        padding-top: 1.2rem;
        padding-bottom: 0.7rem;
      }

      .button-box {
        padding-right: 0.7rem;
        padding-left: 0.7em;
        padding-bottom: 0.7em;

        .color-choose {
          width: 10%;
          display: inline-block;
          border-radius: 50%;
          margin: 0.7rem;
          transition: box-shadow 200ms ease;

          &:hover {
            box-shadow: 0 0 0 0.2rem #40b3ff;
          }
          &::before {
            content: '';
            display: block;
            padding-top: 100%;
          }
        }
      }
    }
  }
}
</style>
