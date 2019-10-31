<template>
  <div class="add-category" :class="[color]" @click="handleClick">
    <a v-if="type === 'category'" :href="link" class="category-link" />
    <div v-if="type === 'add'" class="plus-icon" />
    <div v-else>
      <h1
        ref="categoryName"
        class="category-name"
        :contenteditable="type === 'temp' ? 'true' : 'false'"
        @click="handleCategoryNameClick"
        @blur="createCategory"
        @keypress.enter="createCategory"
      />
    </div>
    <button v-if="isMouseEnter" class="edit-btn" @click="edit" />
    <button v-if="isMouseEnter" class="remove-btn" @click="removeCategory" />
  </div>
</template>

<script>
export default {
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
    }
  },
  computed: {
    link() {
      return `/@${this.$store.state.auth.userInfo.nickname}/${this.catName}`
    }
  },
  watch: {
    catName(next) {
      this.$refs.categoryName.innerHTML = next
    }
  },
  mounted() {
    if (this.type === 'temp') {
      this.focusInput()
    }
  },
  methods: {
    edit() {
      this.$emit('colorchange')
      this.focusInput()
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
    createCategory() {
      const payload = {
        catName: this.$refs.categoryName.textContent.trim(),
        index: this.index
      }
      this.$emit('create', payload)
    },
    removeCategory() {
      this.$emit('remove', this.index)
    },
    focusInput() {
      this.$refs.categoryName.focus()
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.add-category {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 10rem;
  border-radius: 0.84rem;
  position: relative;

  .category-link {
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
    color: #f8f6f6;
    line-height: lh(2);
    min-width: 100%;
    display: block;
    padding: s(6);
  }

  .category-name {
    word-break: break-word;
  }

  .category-name-input {
    text-align: center;
    background-color: transparent;
    font-size: 2.3rem;
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

  .edit-btn {
    background-color: #ff94cf;
    position: absolute;
    right: 7%;
    top: -2.5%;
    width: 8%;
    border-radius: 80%;
    z-index: 101;
    &::before {
      content: '';
      display: block;
      padding-top: 100%;
    }
  }

  .remove-btn {
    position: absolute;
    right: -3%;
    top: -2.5%;
    width: 8%;
    background-color: #ff94cf;
    border-radius: 80%;
    z-index: 101;
    &::before {
      content: '';
      display: block;
      padding-top: 100%;
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
