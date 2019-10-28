export const state = () => ({
  user: {},
  isSignedIn: false
})

export const mutations = {
  setUser(state, data) {
    state.user = data
  },
  setSignedIn(state, bool) {
    state.isSignedIn = bool
  }
}
