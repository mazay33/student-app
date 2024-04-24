// import { defineNuxtModule } from '@nuxt/kit'
// import { resolve, join } from 'pathe'
// import type { Nuxt } from '@nuxt/schema'

// export default defineNuxtModule({
//   meta: {
//     name: 'auth-module',
//     configKey: 'authModule',
//   },

//   setup(options, nuxt: Nuxt) {
//     nuxt.hook('components:dirs', (dirs) => {
//       dirs.push({
//         path: resolve(join(__dirname, 'components')),
//       })
//     })
//     nuxt.hook('pages:extend', (pages) => {
//       pages.push(
//         {
//           name: 'auth',
//           path: '/auth/login',
//           file: resolve(join(__dirname, 'pages/auth/login.vue')),
//         },
//         {
//           name: 'registration',
//           path: '/auth/registration',
//           file: resolve(join(__dirname, 'pages/auth/registration.vue')),
//         },
//         {
//           name: 'profile',
//           path: '/profile',
//           file: resolve(join(__dirname, 'pages/profile.vue')),
//         }
//       )
//     })
//   },
// })
import { defineNuxtModule } from '@nuxt/kit';
import util from '../../../nuxt.modules';
util.dirname = __dirname;

export default defineNuxtModule({
  // Default configuration options for your module
  defaults: {},
  // register routes, components, autoimports
  hooks: util.hooks(),
  // set layouts, global plugins, middleware
  setup(options: any, nuxt: any) {
    util.setup(options, nuxt);
  },
});
