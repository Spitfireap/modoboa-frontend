import gettext from './gettext'

const { $gettext } = gettext

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateNumeric(value) {
  if (isNaN(value)) {
    return false
  }
  var x = parseFloat(value)
  return (x | 0) === x
}

export default {
  required: (value) =>
    (value !== '' && value != null) || $gettext('Field is required'),
  email: (value) => validateEmail(value) || $gettext('Not a valid email'),
  minLength: (len) => (value) =>
    value.length > len || $gettext('Minimum length is 6'),
  numericOrNull: (value) =>
    value === '' ||
    validateNumeric(value) ||
    $gettext('Must be a numeric value or empty'),
}
