export const state = () => ({
  isURLBarActive: false,
  isWebViewActive: false,
  url: '',
  /** @type {'idle' | 'dragging'} */
  mode: 'idle'
})

export const mutations = {
  setUrlBarActive(state, bool) {
    if (!bool) {
      state.url = ''
    }

    state.isURLBarActive = bool
  },
  setUrl(state, url) {
    state.url = url
  },
  setWebviewActive(state, bool) {
    state.isWebViewActive = bool
  },
  setMode(state, newMode) {
    state.mode = newMode
  }
}

export const actions = {}
