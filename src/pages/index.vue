<template>
  <div class="home">
    <div class="g-signin2" data-onsuccess="onSignIn"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  head() {
    return {
      title: 'webglue',
      script: [
        {
          src: 'https://apis.google.com/js/platform.js',
          async: true,
          defer: true
        }
      ],
      meta: [
        {
          name: 'google-signin-client_id',
          content:
            '560957305620-o5ki7i71ds1iv4uaefrumpeanefep8g7.apps.googleusercontent.com.apps.googleusercontent.com'
        }
      ]
    }
  }
})
</script>
