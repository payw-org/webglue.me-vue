<template>
  <div class="add-category" :class="[color, { 'jiggle': isEditMode }]" @click="handleClick">
    <div v-if="type === 'add'" class="plus-icon" />
    <div v-else>
      <input
        v-if="type === 'temp' || isCatNameEditMode"
        v-model="catNameInputValue"
        @input="categoryName"
        type="text"
        class="category-name-input"
        @blur="createCategory"
        @keypress.enter="createCategory"
      />
      <h1 v-else class="category-name" @click="handleCategoryNameClick">{{ catName }}</h1>
    </div>
    <button @click="removeCategory" v-if="type !== 'add' && isEditMode" class="delete-btn">
      <IconPlus x class="delete-icon" />
    </button>
  </div>
</template>

<script>
import IconPlus from '~/components/icons/IconPlus'

export default {
  components: { IconPlus },
  data() {
    return {
      catNameInputValue: '',
      isCatNameEditMode: false
    }
  },
  props: {
    index: {
      type: Number
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
    isEditMode: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    editTodo(todo) {
      this.editedTodo = todo
    },
    categoryName(e) {
      this.maxLength(e, 10)
    },
    maxLength(e, len) {
      const val = e.target.value
      if (val.length > len) {
        this.catNameInputValue = val.slice(0, 10)
      }
    },
    handleClick() {
      if (this.type === 'add') {
        this.addCategory()
      }
    },
    handleCategoryNameClick() {
      if (this.isEditMode) {
        console.log('edit category name')
        this.isCatNameEditMode = true
        this.$nextTick(() => {
          this.focusInput()
        })
      }
    },
    addCategory() {
      this.$emit('add')
    },
    createCategory() {
      const payload = {
        catName: this.catNameInputValue,
        index: this.index,
        color: 'red'
      }
      this.$emit('create', payload)
    },
    removeCategory() {
      this.$emit('remove', this.index)
    },
    focusInput() {
      this.$el.querySelector('.category-name-input').focus()
    }
  },
  mounted() {
    if (this.type === 'temp') {
      this.focusInput()
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
  height: 8rem;
  border-radius: 0.84rem;

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
  }

  .category-name {
    word-break: break-all;
    margin: s(6);
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

  .delete-btn {
    position: absolute;
    right: -0.7rem;
    top: -0.7rem;
    width: 2rem;
    height: 2rem;
    background-color: #c5c3c3ad;
    border-radius: 50px;

    .delete-icon {
      width: 50%;
      height: 50%;
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
