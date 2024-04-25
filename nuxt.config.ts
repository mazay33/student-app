import pkg from './package.json'

export default defineNuxtConfig({
  srcDir: 'src',
  alias: {
    '~': `${__dirname}/src/`,
    '@': `${__dirname}/src/`,
    '~~': `${__dirname}/`,
    '@@': `${__dirname}/`,
    assets: `${__dirname}/src/assets/`,
    public: `${__dirname}/src/public/`,
  },
  devtools: true,
  ssr: false,
  runtimeConfig: {
    public: {
      APP_VERSION: pkg.version,
      APP_NAME: pkg.name,
      api: '',
      // APP_MODE: process.env?.NODE_ENV,
    },
  },
  modules: [
    'nuxt-primevue',
    '@formkit/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/content',
    '@vueuse/nuxt',
    '~/modules/auth/module',
    '~/modules/profile/module',
  ],
  content: {
    highlight: {
      theme: 'one-dark-pro',
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue'],
    },
    // Options
  },
  i18n: {
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    locales: [
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'de', file: 'de.json', name: 'German' },
    ],
    vueI18n: './vue-i18n.options.ts',
  },
  primevue: {
    components: {
      exclude: ['Chart'],
    },
    options: {
      ripple: true,
    },
  },
  css: [
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    '@sfxcode/formkit-primevue/dist/sass/formkit-primevue.scss',
  ],
  build: {
    transpile: ['nuxt', 'primevue', 'formkit-primevue'],
  },
  sourcemap: {
    client: false,
    server: true,
  },
  nitro: {
    // routeRules: {
    // 	'/': {
    // 		proxy:`${import.meta.env.VITE_API_URL}`

    // 	},
    // },
    // devProxy: {
    // 	'/api': {
    // 		target: '',
    // 		changeOrigin: true,
    // 		prependPath: true,
    // 	},
    // },
    minify: true,
    compressPublicAssets: true,
  },
})
