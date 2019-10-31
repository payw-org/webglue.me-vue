export const state = () => ({
  userInfo: {},
  isSignedIn: false
})

export const mutations = {
  setUser(state, data) {
    state.userInfo = data
  },
  setSignedIn(state, bool) {
    state.isSignedIn = bool
  }
}

export const actions = {
  signIn({ commit }, userInfo) {
    commit('setUser', userInfo)
    commit('setSignedIn', true)
  },
  clear({ commit }) {
    commit('setUser', undefined)
    commit('setSignedIn', false)
  }
}
