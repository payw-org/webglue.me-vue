<template>
  <nav class="webglue-navigation">
    <div class="gn-menu-container">
      <div class="logo-container">
        <img
          src="~/assets/images/logo-simplified.svg"
          alt="logo"
          class="logo-img"
        />
      </div>
      <div v-if="$route.params.category">
        <button class="add-btn" @click="onClickAddBtn">
          <IconPlus class="add-icon" color="#ff176b" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import IconPlus from '~/components/icons/IconPlus.vue'

export default Vue.extend({
  components: { IconPlus },
  methods: {
    onClickAddBtn() {
      this.$store.commit('glueBoard/SET_URL_BAR_ACTIVE', true)
    }
  }
})
</script>

<style lang="scss">
@import '~/assets/scss/main';

$nav-height: 3.5rem;

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.webglue-navigation {
  display: flex;
  position: sticky;
  top: 0;
  width: 100%;
  min-width: 100%;
  height: $nav-height;
  // background-color: #f5f5f7;

  .gn-menu-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    // max-width: 50rem;
    margin: auto;
    padding: 0 1rem;

    .logo-container {
      display: flex;
      align-items: center;
      height: 100%;
      animation-name: rotation;
      animation-duration: 5s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;

      .logo-img {
        width: $nav-height * 0.6;
        height: auto;
      }

      .name {
        font-weight: 600;
        font-size: $nav-height * 0.45;
        margin-left: 0.5rem;
        user-select: none;
      }
    }

    .add-btn {
      width: $nav-height * 0.7;
      height: $nav-height * 0.7;
      background-color: #fff;
      border-radius: 0.4rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 200ms ease;

      &:hover {
        background-color: #f5f5f7;
      }

      &:active {
        background-color: #e8e8e8;
      }

      .add-icon {
        width: 55%;
      }
    }
  }
}
</style>
