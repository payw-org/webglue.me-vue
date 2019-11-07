<template>
  <span>
    <svg
      v-if="mode === 'thick'"
      :style="x ? 'transform: rotate(45deg);' : ''"
      width="100%"
      height="100%"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0)">
        <path
          d="M128 -6.10352e-05C115.349 -6.10352e-05 105.092 10.2561 105.092 22.9076V105.092H22.9076C10.256 105.092 -0.00012207 115.348 -0.00012207 128C-0.00012207 140.652 10.256 150.908 22.9076 150.908H105.092V233.092C105.092 245.744 115.349 256 128 256C140.652 256 150.908 245.744 150.908 233.092V150.908H233.092C245.744 150.908 256 140.652 256 128C256 115.348 245.744 105.092 233.092 105.092H150.908V22.9076C150.908 10.2561 140.652 -6.10352e-05 128 -6.10352e-05Z"
          :fill="color"
        />
      </g>
    </svg>
    <svg
      v-else-if="mode === 'thin'"
      :style="x ? 'transform: rotate(45deg);' : ''"
      width="100%"
      height="100%"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0)">
        <rect x="111" width="34" height="256" rx="17" :fill="color" />
        <rect
          x="256"
          y="111"
          width="34"
          height="256"
          rx="17"
          transform="rotate(90 256 111)"
          :fill="color"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="256" height="256" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </span>
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
    },
    mode: {
      type: String,
      default: 'thick'
    }
  }
}
</script>
