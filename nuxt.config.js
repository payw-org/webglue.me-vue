export default {
  // Custom global id of html dom
  globalName: 'webglue',

  // Single Page Application mode
  mode: 'spa',

  // Global head
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Source directory
  srcDir: 'src/',

  // Router config
  router: {
    // Custom link class names
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link'
  },

  // Custom build path name
  build: {
    publicPath: '/dist/'
  },

  // Build modules
  buildModules: ['@nuxtjs/eslint-module']
}
