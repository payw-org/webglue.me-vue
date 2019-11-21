<template>
  <div
    class="add-category"
    :class="[{ 'real-category': type === 'category' }]"
    :style="{ backgroundColor: hexColor }"
    :data-category-id="catId"
    :data-category-local-id="catLocalId"
    :data-color="color"
    :data-name="catName"
    @click="activatePopUp"
    @mousedown="mousedown"
    @mouseenter="handleMouseEnter(true)"
    @mouseleave="handleMouseEnter(false)"
  >
    <a
      v-if="type === 'category'"
      :href="glueBoardLink"
      class="glueboard-link"
    />
    <!-- <a v-if="type === 'category'" :href="link" class="category-link" /> -->
    <div v-if="type === 'add'" class="plus-icon" />
    <div v-else>
      <h1
        ref="categoryName"
        class="category-name"
        :contenteditable="
          isContentEditable || type === 'temp' ? 'true' : 'false'
        "
        spellcheck="false"
        @click="handleCategoryNameClick"
        @blur="updateCategory"
        @keydown.enter="updateCategory"
        @keydown="categoryKeyDown"
      >
        <span>{{ catName }}</span>
      </h1>
    </div>
    <div class="actions">
      <transition name="zoom-in">
        <button v-if="isMouseEnter" class="edit-btn" @click="edit">
          <img src="~/assets/images/edit-icon.svg" class="edit-icon" />
        </button>
      </transition>
      <transition name="zoom-in">
        <button v-if="isMouseEnter" class="remove-btn" @click="removeCategory">
          <IconPlus class="icon-x" x mode="thin" color="red" />
        </button>
      </transition>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
import IconPlus from '@/components/icons/IconPlus'
import ApiUrl from '~/modules/api-url'

export default {
  components: { IconPlus },
  props: {
    index: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'category'
    },
    color: {
      type: String,
      default: 'gray'
    },
    catName: {
      type: String,
      default: ''
    },
    catId: {
      type: String,
      default: ''
    },
    catLocalId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      glueBoardLink: '',
      isPopUpActive: false,
      isMouseEnter: false,
      isContentEditable: false,
      isClicked: false,
      isMoving: false,
      isEditMode: false,
      categoryNameBackup: ''
    }
  },
  computed: {
    link() {
      return `/@${this.$store.state.auth.userInfo.nickname}/${this.catName}`
    },
    hexColor() {
      if (!this.color.startsWith('#')) {
        return '#' + this.color
      } else {
        return this.color
      }
    }
  },
  watch: {
    catName(next) {
      this.$refs.categoryName.innerHTML = next
      this.glueBoardLink = `/@${this.$store.state.auth.userInfo.nickname}/${next}`
    }
  },
  mounted() {
    if (this.type === 'temp') {
      this.$refs.categoryName.innerHTML = ''
      this.focusInput()
    } else {
      this.glueBoardLink = `/@${this.$store.state.auth.userInfo.nickname}/${this.catId}`
    }
  },
  methods: {
    categoryKeyDown() {
      if (this.isEditMode) {
        this.$emit('colorchange', this.$el)
      }
    },
    mousedown() {
      if (this.type === 'category') {
        this.$emit('movecat', this.$el)
      }
    },
    edit() {
      this.categoryNameBackup = this.catName
      this.isEditMode = true
      console.log('edit', this.catName)
      this.$refs.categoryName.innerHTML = this.catName
      this.$emit('colorchange', this.$el)
      this.focusInput()
    },
    handleMouseEnter(bool) {
      if (this.type === 'category') {
        this.isMouseEnter = bool
      }
    },
    activatePopUp() {
      this.$emit('popup')
    },
    handleClick() {
      if (this.type === 'add') {
        this.addCategory()
      }
    },
    handleCategoryNameClick() {},
    addCategory() {
      this.$emit('add')
    },
    /**
     * @returns {boolean}
     */
    validateDuplication() {
      const nameNodes = document.querySelectorAll(
        '.real-category .category-name'
      )

      if (!this.$refs.categoryName) {
        return
      }

      /** @type {string} */
      const categoryName = this.$refs.categoryName.textContent.trim()

      if (categoryName.length === 0) {
        this.$emit('remove', this.index)
        return false
      }

      this.$refs.categoryName.innerHTML = categoryName
      for (let i = 0; i < nameNodes.length; i += 1) {
        if (i === this.index) {
          continue
        }

        if (
          nameNodes[i].textContent.trim() &&
          nameNodes[i].textContent.trim() === categoryName
        ) {
          this.focusInput()
          return false
        }
      }

      return true
    },
    /**
     * Check and emit create event
     * when press enter or blur event occurs
     *
     * @param {KeyboardEvent} e
     */
    updateCategory(e) {
      console.log('update category')
      if (e) {
        e.preventDefault()
      }

      const categoryName = this.$refs.categoryName.textContent.trim()
      const isAvailable = this.validateDuplication()

      // When press enter or blur the input
      // on edit mode
      if (this.isEditMode) {
        this.blurInput()
        const newCategoryName = this.$refs.categoryName.textContent.trim()
        if (newCategoryName === '') {
          console.log('Category name is empty')
          this.$refs.categoryName.innerHTML = this.categoryNameBackup
          return
        } else {
          this.$emit('update', {
            name: newCategoryName
          })
        }

        if (isAvailable) {
          Axios({
            ...ApiUrl.glueBoard.update(this.catId),
            withCredentials: true,
            data: {
              name: this.$refs.categoryName.textContent.trim()
            }
          })
            .then(() => {
              console.log('Category name updated')
            })
            .catch(err => {
              console.error(err)
            })
        } else {
          if (e.key) {
            this.focusInput()
          } else {
            this.$refs.categoryName.innerHTML = this.categoryNameBackup
          }
          this.$el.classList.remove('unavailable')
          setTimeout(() => {
            this.$el.classList.add('unavailable')
            setTimeout(() => {
              this.$el.classList.remove('unavailable')
            }, 700)
          }, 0)
        }
        return
      }

      // Creation

      // No name duplication
      // No empty name

      if (isAvailable) {
        const payload = {
          categoryName,
          index: this.index
        }
        this.$emit('create', payload)
        this.isContentEditable = false
      } else {
        this.$el.classList.remove('unavailable')
        setTimeout(() => {
          this.$el.classList.add('unavailable')
          setTimeout(() => {
            this.$el.classList.remove('unavailable')
          }, 700)
        }, 0)
      }
    },
    removeCategory() {
      this.$emit('remove', this.index)
    },
    focusInput() {
      this.isContentEditable = true
      this.$nextTick(() => {
        this.$refs.categoryName.focus()
        this.placeCaretAtEnd(this.$refs.categoryName)
      })
    },
    blurInput() {
      this.isContentEditable = false
    },
    placeCaretAtEnd(el) {
      el.focus()
      if (
        typeof window.getSelection !== 'undefined' &&
        typeof document.createRange !== 'undefined'
      ) {
        const range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(false)
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      } else if (typeof document.body.createTextRange !== 'undefined') {
        const textRange = document.body.createTextRange()
        textRange.moveToElementText(el)
        textRange.collapse(false)
        textRange.select()
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-2px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(4px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-6px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(6px, 0, 0);
  }
}

.zoom-in-enter-active,
.zoom-in-leave-active {
  transition: transform 0.2s, opacity 0.2s;
  transform: scale(1);
  opacity: 1;
}
.zoom-in-enter,
.zoom-in-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.add-category {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 10rem;
  border-radius: 0.84rem;
  position: relative;

  &.ghost {
    opacity: 0 !important;
  }

  &.cloned {
    z-index: 99999;
    transition: box-shadow 0.3s ease;
    box-shadow: 0 0.5rem 2rem rgba(#000, 0.2);

    &.returning {
      transition: all 300ms ease;
      box-shadow: 0 0 0 transparent;
    }
  }

  &.unavailable {
    animation: shake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  .glueboard-link {
    pointer-events: none;
    position: absolute;
    z-index: 100;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  @keyframes jiggle {
    0% {
      -webkit-transform: rotate(-0.7deg);
    }
    50% {
      -webkit-transform: rotate(0.7deg);
    }
  }

  &.jiggle {
    animation: jiggle;
    animation-duration: 0.2s;
    animation-name: jiggle;
    animation-iteration-count: infinite;
    transform: rotate(-2deg);
  }

  .category-name,
  .category-name-input {
    font-weight: fw(6);
    color: #f8f6f6;
    line-height: lh(2);
    min-width: 100%;
    display: block;
    padding: s(6);
  }

  .category-name span {
    font-weight: fw(6);
    color: #f8f6f6;
    line-height: lh(2);
  }

  .category-name {
    word-break: break-word;
  }

  .category-name-input {
    text-align: center;
    font-size: 2.3rem;

    &.returning {
      transition: all 400ms ease;
    }
    width: 100%;
    font-weight: 700;
    line-height: 1.16em;
  }

  .plus-icon {
    $size: 2.3rem;
    width: $size;
    height: $size;
    background-image: url('~assets/images/plus.svg');
  }

  $btn-size: 2.2rem;

  .edit-btn,
  .remove-btn {
    background-color: #fff;
    border-radius: 50%;
    width: $btn-size;
    height: $btn-size;
    z-index: 101;
    top: -5%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0.4rem 1.2rem rgba(#000, 0.2);
  }

  .edit-btn {
    right: calc(-5% + #{$btn-size + 0.3rem});

    .edit-icon {
      $icon-size: 55%;
      width: $icon-size;
      height: $icon-size;
      $margin: 5%;
      margin-left: $margin;
      margin-bottom: $margin;
    }
  }

  .remove-btn {
    right: -5%;
    flex-direction: column;

    .icon-x {
      width: 55%;
    }
  }

  &.gray {
    background-image: linear-gradient(to bottom, #cfcfcf, #ccc8c8);
  }

  &.color1 {
    background-image: linear-gradient(to bottom, #e6696e, #e67a7d);
  }

  &.color2 {
    background-image: linear-gradient(to bottom, #e8765c, #e78470);
  }

  &.color3 {
    background-image: linear-gradient(to bottom, #dd8042, #dc8d5e);
  }

  &.color4 {
    background-image: linear-gradient(to bottom, #d69d2f, #cd8e27);
  }

  &.color5 {
    background-image: linear-gradient(to bottom, #6ca64e, #5f9943);
  }

  &.color6 {
    background-image: linear-gradient(to bottom, #5ba68f, #4b977f);
  }

  &.color7 {
    background-image: linear-gradient(to bottom, #629eb1, #5490a3);
  }

  &.color8 {
    background-image: linear-gradient(to bottom, #6c92c3, #5f84b9);
  }

  &.color9 {
    background-image: linear-gradient(to bottom, #737ec4, #656fb9);
  }

  &.color10 {
    background-image: linear-gradient(to bottom, #9177c0, #8268b4);
  }

  &.color11 {
    background-image: linear-gradient(to bottom, #c485c6, #b36cb6);
  }

  &.color12 {
    background-image: linear-gradient(to bottom, #dd7190, #d76784);
  }

  &.color13 {
    background-image: linear-gradient(to bottom, #87919d, #7a8490);
  }

  &.color14 {
    background-image: linear-gradient(to bottom, #8d928e, #7e8480);
  }

  &.color15 {
    background-image: linear-gradient(to bottom, #9c908b, #8f817d);
  }
}
</style>
