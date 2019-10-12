<template>
  <svg
    :style="x ? 'transform: rotate(45deg);' : ''"
    width="100%"
    height="100%"
    viewBox="0 0 29 29"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve"
    style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"
  >
    <path
      d="M11.6,11.6l0,-8.7c0,-1.601 1.299,-2.9 2.9,-2.9c1.601,0 2.9,1.299 2.9,2.9l0,8.7l8.7,0c1.601,0 2.9,1.299 2.9,2.9c0,1.601 -1.299,2.9 -2.9,2.9l-8.7,0l0,8.7c0,1.601 -1.299,2.9 -2.9,2.9c-1.601,0 -2.9,-1.299 -2.9,-2.9l0,-8.7l-8.7,0c-1.601,0 -2.9,-1.299 -2.9,-2.9c0,-1.601 1.299,-2.9 2.9,-2.9l8.7,0Z"
      :style="`fill:${color};`"
    />
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#222222'
    },
    x: {
      type: Boolean,
      default: false
    }
  }
}
</script>
