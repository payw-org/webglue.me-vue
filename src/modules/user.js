import Axios from 'axios'
import ApiUrl from '~/modules/api-url'

export default class User {
  static async getUserInfo() {
    let error
    const res = await Axios.get(ApiUrl.user.profile, {
      withCredentials: true
    }).catch(err => {
      error = err
    })

    if (error) {
      return undefined
    } else {
      return res.data
    }
  }
}
