/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import gettext from './gettext'
import store from '@/store'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(store)
    .use(gettext)
}
