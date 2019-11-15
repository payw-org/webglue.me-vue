/**
 * @type {Vue.ComponentOptions}
 */
const options = {
  beforeMount() {
    if (!this.$store.state.auth.isSignedIn) {
      location.replace('/')
      return
    }

    /** @type {string} */
    const userName = this.$route.params.username
    if (
      !userName ||
      userName.replace('@', '') !== this.$store.state.auth.userInfo.nickname
    ) {
      location.replace('/')
    }
  }
}

export default options
