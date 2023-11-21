/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import gettext from './gettext'
import pinia from '@/stores'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(pinia)
    .use(router)
    .use(gettext)
}
