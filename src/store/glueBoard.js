export const state = () => ({
  isURLBarActive: false,
  url: ''
})

export const mutations = {
  SET_URL_BAR_ACTIVE(state, bool) {
    if (!bool) {
      state.url = ''
    }

    state.isURLBarActive = bool
  },
  SET_URL(state, url) {
    state.url = url
  }
}

export const actions = {}
