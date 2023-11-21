
// Simple bus to handle global events like sending notifications to the user

const state = () => ({
  notification: {},
  notificationColor: '',
  imapSettings: true,
})

const getters = {
  notification: state => state.notification,
  imapSettings: state => state.imapSettings
}

const mutations = {
  changeNotification(state, { notification, notificationColor}) {
    state.notification = notification
    state.notificationColor = notificationColor
  },
  changeImapSettings(state, status) {
    state.imapSettings = status
  }
}

const actions = {
  showNotification ({ rootState }, options) {
      if (rootState.auth.isAuthenticated) {
        this.notification = options.msg
        this.notificationColor = (options.type) ? options.type : 'success'
        this.snackbar = true
      }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
