const firebaseConfig = require('./config/firebaseconfig');

module.exports = {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - webapp',
    title: 'webapp',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  // TODO: change to server for build
  target: 'server',

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  router: {
    middlewWare: {
      ssr: false
    },
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/infiniteLoading', ssr: false },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api',
    '@nuxtjs/pwa'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',[
      '@nuxtjs/firebase', {
        config: firebaseConfig,
        services: {
          auth: {
            ssr: true
          },
          storage: true
        },
        // onFirebaseHosting: true
      }
    ],
    '@nuxtjs/proxy'
  ],

  axios: {
    proxy: true,
    common: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
    },
    https: true
  },

  proxy: {
    '/postapi/': { target: 'https://postapi-v1-otuidiffzq-ue.a.run.app/', pathRewrite: {'^/postapi/': ''}, changeOrigin: true },
    '/userapi/': { target: 'https://userapi-otuidiffzq-uc.a.run.app/', pathRewrite: {'^/userapi/': ''}}
  },

  auth: {
    persistence: 'local', // default
    ssr: true, // default
    emulatorPort: 3000,
    emulatorHost: 'http://localhost',
  },

  pwa: {
    meta: false,
    icon: false,

    workbox: {
      importScripts: [
        '/firebase-auth-sw.js'
      ],
      dev: process.env.NODE_ENV === 'development',
    }
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#1976D2',
          accent: '#424242',
          secondary: '#FF8F00',
          info: '#26A69A ',
          warning: '#FFC107',
          error: '#DD2C0',
          success: '#00E676'
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: ['vuetify/es5/util/colors'],
    extractCss: true
  }
}
