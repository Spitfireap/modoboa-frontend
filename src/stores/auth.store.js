import Cookies from 'js-cookie'

import { defineStore } from 'pinia'
import { ref } from 'vue'

import repository from '@/api/repository'
import account from '@/api/account'
import auth from '@/api/auth'


function setupAxios (token) {
  repository.defaults.headers.common.Authorization = `Bearer ${token}`
  repository.defaults.headers.post['Content-Type'] = 'application/json'
}


export const useAuthStore = defineStore('auth', () => {
  const authUser = ref({})
  const isAuthenticated = ref(false)

  function fetchUser() {
    return account.getMe().then(resp => {
      authUser.value = resp.data
      isAuthenticated.value = true
    })
  }
  function initialize() {
    const token = Cookies.get('token')
    if (!token) {
      return
    }
    setupAxios(token)
    return fetchUser().value
  }
  async function login(payload) {
    const resp = await auth.requestToken(payload)
    const cookiesAttributes = { sameSite: 'strict' }
    if (payload.rememberMe) {
      cookiesAttributes.expires = 90
    }
    const cookie = Cookies.withAttributes(cookiesAttributes)

    cookie.set('token', resp.data.access)
    cookie.set('refreshToken', resp.data.refresh)
    initialize()
  }
  async function $reset() {
    delete repository.defaults.headers.common.Authorization
    Cookies.remove('token')
    Cookies.remove('refreshToken')
    authUser.value = {}
    isAuthenticated.value = false
  }
})
