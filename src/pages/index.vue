<template>
  <div class="home">
    <div class="g-signin2" data-onsuccess="onSignIn" />
    <button @click="googleLogin">
      <a href="https://api.dev-hch.webglue.me/v1/oauth2/google">Google Login</a>
    </button>
  </div>
</template>

<script>
export default {
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
}
</script>
