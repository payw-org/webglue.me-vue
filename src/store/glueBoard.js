export const state = () => ({
  isURLBarActive: false,
  isWebViewActive: false,
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
  },
  SET_WEBVIEW_ACTIVE(state, bool) {
    state.isWebViewActive = bool
  }
}

export const actions = {}
