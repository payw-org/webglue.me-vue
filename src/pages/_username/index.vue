<template>
  <div>
    <div class="webglue-category">
      <Navigation class="navigation" />
      <ColorPicker v-if="isChangeColor" class="colorpicker" />
      <transition-group class="grid-layout category-box" name="scale" tag="div">
        <div
          v-for="(block, i) in blocks"
          :key="block.id"
          class="grid-item-wrapper"
        >
          <CategoryBlock
            :cat-name="block.catName"
            :color="block.color"
            :type="block.type"
            :index="i"
            :is-edit-mode="isEditMode"
            @create="createBlock"
            @remove="removeBlock"
            @colorchange="visibleColorPicker"
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

      .color-choose {
        width: 10%;
        display: inline-block;
        border-radius: 50%;
        margin: 0.8rem;
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
</style>
