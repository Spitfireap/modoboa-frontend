import Cookies from 'js-cookie'

import repository from '@/api/repository'
import account from '@/api/account'
import auth from '@/api/auth'


function setupAxios (token) {
  repository.defaults.headers.common.Authorization = `Bearer ${token}`
  repository.defaults.headers.post['Content-Type'] = 'application/json'
}

const state = () => ({
  authUser: {},
  isAuthenticated: false
})

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  authUser: state => state.authUser
}

const mutations = {
  SET_AUTH_USER (state, { authUser, isAuthenticated }) {
    state.authUser = authUser
    state.isAuthenticated = isAuthenticated
  },
  LOGOUT_USER (state) {
    state.authUser = null
    state.isAuthenticated = false
  }
}

const actions = {
  fetchUser ({ commit }) {
    return account.getMe().then(resp => {
      commit('SET_AUTH_USER', { authUser: resp.data, isAuthenticated: true })
    })
  },
  initialize ({ dispatch }) {
    const token = Cookies.get('token')
    if (!token) {
      return
    }
    setupAxios(token)
    return dispatch('fetchUser')
  },
  async login ({ dispatch }, payload) {
    try {
      const resp = await auth.requestToken(payload)
      const cookiesAttributes = { sameSite: 'strict' }
      if (payload.rememberMe) {
        cookiesAttributes.expires = 90
      }
      const cookie = Cookies.withAttributes(cookiesAttributes)

      cookie.set('token', resp.data.access)
      cookie.set('refreshToken', resp.data.refresh)
      dispatch('initialize')
    } catch (err) {
      throw err
    }
  },
  async logout ({ commit }) {
    delete repository.defaults.headers.common.Authorization
    Cookies.remove('token')
    Cookies.remove('refreshToken')
    commit('LOGOUT_USER')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
