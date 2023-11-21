import { createStore, createLogger } from 'vuex'
import auth from './modules/auth'
import bus from './modules/bus'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    auth,
    bus
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
