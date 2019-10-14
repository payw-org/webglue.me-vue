<template>
  <div id="app" :class="$store.state.app.mode">
    <nuxt />
  </div>
</template>

<style lang="scss">
@import '~/assets/scss/globalstyle';

#app {
  min-height: 100vh;
  background-color: #fff;
  transition: transform 300ms cubic-bezier(0.76, 0.06, 0.19, 0.99);

  &.layered {
    transform: scale(0.9);
  }
}
</style>
