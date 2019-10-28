import Axios from 'axios'
import ApiUrl from '~/modules/api-url'

export default async (context) => {
  const { store } = context

  if (process.client) {
    const res = await Axios({
      method: 'get',
      url: ApiUrl.user.profile,
      withCredentials: true
    }).catch((err) => {
      if (err.response.status === 401) {
        console.log('no user')
        store.commit('app/setSignedIn', false)
      }
    })
    if (res && res.data) {
      console.log('yes user')
      store.commit('app/setUser', res.data)
      store.commit('app/setSignedIn', true)
    }
  }
}
