<template>
  <div>
    <div class="webglue-category">
      <div class="navi">
        <Navigation />
      </div>
      <div class="edit-box">
        <button
          class="edit-button"
          v-on:click="(e) => {isEditMode = !isEditMode }"
        >{{ editBtnText }}</button>
      </div>
      <div class="grid-layout category-box">
        <CategoryBlock
          v-for="(block, i) in blocks"
          :key="block.catName + i"
          :cat-name="block.catName"
          :color="'color' + ((i % 15) + 1)"
          :type="block.type"
          :index="i"
          @create="createBlock"
          @remove="removeBlock"
          :is-edit-mode="isEditMode"
        />
        <CategoryBlock type="add" @add="addBlock" v-if="!isEditMode" />
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '~/components/Navigation'
import CategoryBlock from '~/components/CategoryBlock'

export default {
  components: { Navigation, CategoryBlock },
  data() {
    return {
      blocks: [],
      isEditMode: false
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
  mounted() {},
  methods: {
    addBlock() {
      const newBlock = {
        catName: '',
        type: 'temp',
        color: 'red'
      }
      this.blocks.push(newBlock)
    },
    removeBlock(index) {
      console.log(index)
      this.blocks.splice(index, 1)
    },
    createBlock(payload) {
      if (payload.catName.trim().length === 0) {
        this.blocks.splice(payload.index)
      } else {
        this.blocks[payload.index].catName = payload.catName
        this.blocks[payload.index].type = 'category'
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.webglue-category {
  display: flex;
  flex-direction: column;
  align-items: center;

  .navi {
    width: 100vw;
  }

  .edit-box {
    width: 100vw;
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
}
</style>
