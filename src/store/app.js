export const state = () => ({
  mode: 'default' // 'layered'
})

export const mutations = {
  SET_MODE(state, newMode) {
    state.mode = newMode
  }
}
