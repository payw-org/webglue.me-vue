<template>
  <div>
    <div class="webglue-category">
      <Navigation class="navigation" />
      <transition name="fade">
        <ColorPicker
          v-if="isChangeColor"
          ref="colorPicker"
          class="colorpicker"
          @select="invisibleColorPicker"
          @colorselect="selectColor"
          @chromecolorselect="chromeSelectColor"
        />
      </transition>
      <transition-group class="grid-layout category-box" name="scale" tag="div">
        <div
          v-for="(block, i) in blocks"
          :key="block.id"
          class="grid-item-wrapper"
          :data-index="i"
        >
          <CategoryBlock
            :cat-name="block.catName"
            :color="block.color"
            :type="block.type"
            :index="i"
            :is-edit-mode="isEditMode"
            :style="{ backgroundColor }"
            @create="createBlock"
            @remove="removeBlock"
            @colorchange="visibleColorPicker($event, i)"
          />
        </div>

        <div
          v-if="!isEditMode"
          key="category-block-new"
          class="grid-item-wrapper"
        >
          <CategoryBlock type="add" @add="addBlock" @popup="checkPopupActive" />
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
import ColorPicker from '~/components/ColorPicker'
import Navigation from '~/components/Navigation'
import CategoryBlock from '~/components/CategoryBlock'

export default {
  components: { Navigation, CategoryBlock, ColorPicker },
  props: {
    color: {
      type: String,
      default: 'gray'
    }
  },
  data() {
    return {
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
    this.profileLink = `/@${this.$store.state.auth.userInfo.nickname}/profile`

    /** @type {HTMLElement} */
    let original

    // Attach mousedown event
    // When mousedown on category block
    // it remembers the original pointer position
    // and apply the movement changes
    // to category block when mousemove
    window.addEventListener('mousedown', e => {
      /** @type {HTMLElement} */
      const target = e.target

      // Mousedown category element
      if (
        target.closest('.add-category:not(.gray)') &&
        !target.closest('.actions')
      ) {
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
      if (original && !this.stat.move) {
        const glueBoardLink = original.querySelector('.glueboard-link').href
        window.location.href = glueBoardLink
      }

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
      this.moving.elm.style.top = giwRect.top + 'px'

      const originalCloned = original
      setTimeout(() => {
        this.moving.elm.parentElement.removeChild(this.moving.elm)
        if (originalCloned) {
          originalCloned.classList.remove('ghost')
        }
      }, 300)

      original = null
    })

    window.addEventListener('click', e => {
      /** @type {HTMLElement} */
      const target = e.target
      if (
        !target.closest('.speech-bubble') &&
        !target.closest('.add-category')
      ) {
        this.isChangeColor = false
      }
    })
  },
  methods: {
    chromeSelectColor(newColor) {
      this.blocks[this.willChangeCatBlockIndex].color = newColor + ''
    },
    clickColorPicker() {
      this.isChangeColor = true
    },
    selectColor(newColor) {
      this.blocks[this.willChangeCatBlockIndex].color = newColor
    },
    invisibleColorPicker() {
      this.isChangeColor = false
    },
    visibleColorPicker(catElem, index) {
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
          (catElem.getBoundingClientRect().height +
            colorPickerElm.getBoundingClientRect().height) /
            2 +
          'px'
      })
    },
    selectBlockColor(color) {
      this.deactivatePopUp()
      this.addBlock(color)
    },
    checkPopupActive() {
      this.isPopUp = true
    },
    deactivatePopUp() {
      this.isPopUp = false
    },
    addBlock(color) {
      const newBlock = {
        catName: '',
        type: 'temp',
        id: Math.random(),
        color
      }
      this.blocks.push(newBlock)
    },
    removeBlock(index) {
      this.isChangeColor = false
      const removeTarget = this.$el.querySelectorAll(
        '.category-box .grid-item-wrapper'
      )[index]
      removeTarget.style.width =
        removeTarget.getBoundingClientRect().width + 'px'
      this.blocks.splice(index, 1)
    },
    createBlock(payload) {
      if (payload.catName.trim().length === 0) {
        this.removeBlock(payload.index)
      } else {
        for (let i = 0; i < this.blocks.length; i++) {
          if (this.blocks[i].catName === payload.catName) {
            this.blocks[payload.index].available = false
          } else {
            this.blocks[payload.index].catName = payload.catName
            this.blocks[payload.index].type = 'category'
          }
        }
      }
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
    background-image: linear-gradient(to bottom, #ff3952, #ff6f37);
    opacity: 0.8;
    width: 3rem;
    height: 3rem;
    left: 1rem;
    bottom: 1rem;
    border-radius: 50%;

    .mypage-link {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 3;
    }

    .mypage-icon {
      width: 80%;
      height: 80%;
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
      border-radius: 0.7rem;
      z-index: 1;
      display: block;
      justify-content: center;
      align-items: center;

      .color-pick {
        width: 100%;
        text-align: center;
        color: #6b6b6b;
        padding-top: 1.2rem;
        padding-bottom: 1.2rem;
      }
      .button-box {
        padding-right: 0.7rem;
        padding-left: 0.7em;
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
