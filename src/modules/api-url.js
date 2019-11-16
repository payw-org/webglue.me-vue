const host = 'https://api.webglue.me'

export default {
  user: {
    signInUp: `${host}/v1/oauth2/google`,
    profile: `${host}/v1/me/profile`
  },
  /**
   * @param {string} url
   */
  mirror(url) {
    return `${host}/v1/mirroring/html?url=${url}`
  },
  glueBoard: {
    list: {
      method: 'get',
      url: `${host}/v1/me/glueboards`
    },
    create: {
      method: 'post',
      url: `${host}/v1/me/glueboards`
    },
    items(glueBoardId) {
      return {
        method: 'get',
        url: `${host}/v1/me/glueboards/${glueBoardId}`
      }
    },
    update(glueBoardId) {
      return {
        method: 'patch',
        url: `${host}/v1/me/glueboards/${glueBoardId}`
      }
    },
    delete(glueBoardId) {
      return {
        method: 'delete',
        url: `${host}/v1/me/glueboards/${glueBoardId}`
      }
    }
  },
  fragment: {
    list(glueBoardId) {
      return {
        method: 'get',
        url: `${host}/v1/me/glueboards/${glueBoardId}/fragments`
      }
    },
    create(glueBoardId) {
      return {
        method: 'post',
        url: `${host}/v1/me/glueboards/${glueBoardId}/fragments`
      }
    },
    get(glueBoardId, fragmentId) {
      return {
        method: 'get',
        url: `${host}/v1/me/glueboards/${glueBoardId}/fragments/${fragmentId}`
      }
    },
    update(glueBoardId, fragmentId) {
      return {
        method: 'patch',
        url: `${host}/v1/me/glueboards/${glueBoardId}/fragments/${fragmentId}`
      }
    },
    delete(glueBoardId, fragmentId) {
      return {
        method: 'delete',
        url: `${host}/v1/me/glueboards/${glueBoardId}/fragments/${fragmentId}`
      }
    }
  }
}
