<template>
  <div class="add-category" :class="color" @click="handleClick">
    <div v-if="type === 'add'" class="plus-icon" />
    <div v-else>
      <input
        v-if="type === 'temp'"
        v-model="catNameInputValue"
        type="text"
        class="category-name-input"
        @blur="createCategory"
        @keypress.enter="createCategory"
      />
      <h1 v-else class="category-name">{{ catName }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catNameInputValue: ''
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
    }
  },
  methods: {
    handleClick() {
      if (this.type === 'add') {
        this.addCategory()
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
    }
  },
  mounted() {
    if (this.type === 'temp') {
      this.$el.querySelector('.category-name-input').focus()
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
