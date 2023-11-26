import gettext from './gettext'

const { $gettext } = gettext

export default {
  install: (app) => {
    app.config.globalProperties.$yesno = (value) => {
      return value ? $gettext('yes') : $gettext('no')
    }
  },
}
