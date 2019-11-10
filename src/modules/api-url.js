const host = 'https://api.webglue.me'

export default {
  user: {
    signInUp: `${host}/v1/oauth2/google`,
    profile: `${host}/v1/me/profile`
  },
  mirror: `${host}/v1/mirroring/html`
}
