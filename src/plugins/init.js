import Axios from 'axios'
import ApiUrl from '~/modules/api-url'

export default async context => {
  const { store } = context
  let error

  if (process.client) {
    const res = await Axios({
      method: 'get',
      url: ApiUrl.user.profile,
      withCredentials: true
    }).catch(err => {
      error = err
    })

    // Error occurs
    if (error) {
      // Handle network error
      if (!error.response) {
        console.error('[webglue] ❌ Network Error!', error)
        return
      }

      // Sign in failed(no sign in information)
      if (error.response && error.response.status === 401) {
        store.dispatch('auth/clear')

        // Redirect to home
        if (window.location.pathname !== '/') {
          window.location.replace('/')
        }
      }
    }

    if (res && res.data) {
      const userInfo = res.data
      store.dispatch('auth/signIn', userInfo)
    }
  }
}
