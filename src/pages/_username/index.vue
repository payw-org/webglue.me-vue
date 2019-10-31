<template>
  <div>
    <div class="webglue-category">
      <Navigation />
      <transition-group class="grid-layout category-box" name="scale" tag="div">
        <div
          v-for="(block, i) in blocks"
          :key="block.id"
          class="grid-item-wrapper"
        >
          <CategoryBlock
            :cat-name="block.catName"
            :color="'color' + ((i % 15) + 1)"
            :type="block.type"
            :index="i"
            :is-edit-mode="isEditMode"
            @create="createBlock"
            @remove="removeBlock"
          />
        </div>

        <div
          v-if="!isEditMode"
          key="category-block-new"
          class="grid-item-wrapper"
        >
          <CategoryBlock type="add" @add="addBlock" />
        </div>
      </transition-group>
      <button class="mypage-btn">
        <a :href="profileLink" class="mypage-link" />
        <img src="~/assets/images/mypage.png" class="mypage-icon" />
      </button>
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
      isEditMode: false,
      profileLink: ''
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
  },
  methods: {
    addBlock() {
      const newBlock = {
        catName: '',
        type: 'temp',
        id: Math.random()
      }
      this.blocks.push(newBlock)
    },
    removeBlock(index) {
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
        this.blocks[payload.index].catName = payload.catName
        this.blocks[payload.index].type = 'category'
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
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
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
    display: none;
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
}
</style>
