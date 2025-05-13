const firebaseConfig = require('./config/firebaseconfig');
const { followersapi, itemsapi, postapi, userapi } = require('./config/apiconfig');

module.exports = {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s',
    title: 'Pubcoasters',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'msapplication-TileColor', content: '#da532c' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', size: '16x16', href: '/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', size: '32x32', href: '/favicon-32x32.png' },
      { rel: 'apple-touch-icon',  size: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }
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
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
    },
    https: true
  },

  proxy: {
    '/postapi/': {
      target: postapi,
      pathRewrite: {'^/postapi/': ''},
      changeOrigin: true,
      onProxyReq: function log (proxyReq, req, res) {
        if (!req.body || !Object.keys(req.body).length) {
          return;
        }

        const contentType = proxyReq.getHeader('Content-Type')
        const writeBody = (bodyData) => {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
        if (contentType.includes('application/json') || contentType.includes('application/x-www-form-urlencoded')) {
          writeBody(JSON.stringify(req.body));
        }
      }
     },
    '/userapi/': {
      target: userapi,
      pathRewrite: {'^/userapi/': ''},
      changeOrigin: true,
      onProxyReq: function log (proxyReq, req, res) {
        if (!req.body || !Object.keys(req.body).length) {
          return;
        }

        const contentType = proxyReq.getHeader('Content-Type')
        const writeBody = (bodyData) => {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
        if (contentType.includes('application/json') || contentType.includes('application/x-www-form-urlencoded')) {
          writeBody(JSON.stringify(req.body));
        }
      }
    },
    '/itemsapi/': {
      target: itemsapi,
      pathRewrite: {'^/itemsapi/': ''},
      changeOrigin: true,
      onProxyReq: function log (proxyReq, req, res) {
        if (!req.body || !Object.keys(req.body).length) {
          return;
        }

        const contentType = proxyReq.getHeader('Content-Type')
        const writeBody = (bodyData) => {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
        if (contentType.includes('application/json') || contentType.includes('application/x-www-form-urlencoded')) {
          writeBody(JSON.stringify(req.body));
        }
      }
    },
    '/busyapi/': {
      target: busyapi,
      pathRewrite: {'^/busyapi/': ''},
      changeOrigin: true,
      onProxyReq: function log (proxyReq, req, res) {
        if (!req.body || !Object.keys(req.body).length) {
          return;
        }

        const contentType = proxyReq.getHeader('Content-Type')
        const writeBody = (bodyData) => {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
        if (contentType.includes('application/json') || contentType.includes('application/x-www-form-urlencoded')) {
          writeBody(JSON.stringify(req.body));
        }
      }
    },
    '/followersapi/': {
      target: followersapi,
      pathRewrite: {'^/followersapi/': ''},
      changeOrigin: true,
      onProxyReq: function log (proxyReq, req, res) {
        if (!req.body || !Object.keys(req.body).length) {
          return;
        }

        const contentType = proxyReq.getHeader('Content-Type')
        const writeBody = (bodyData) => {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
        if (contentType.includes('application/json') || contentType.includes('application/x-www-form-urlencoded')) {
          writeBody(JSON.stringify(req.body));
        }
      }
    }
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
    },
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          // TODO: maybe look at a way to fix this another time
          // primary: '#E5393',
          // accent: '#2196F',
          // secondary: '#FF8F00',
          // info: '#FF8F00 ',
          // warning: '#FFC107',
          // error: '#D5000',
          // success: '#4CAF'
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
