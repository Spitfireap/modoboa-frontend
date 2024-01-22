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

function samePassword(value, confirmation) {
  return value === confirmation
}

export default {
  required: (value) =>
    (value !== '' && value != null) || $gettext('Field is required'),
  email: (value) => validateEmail(value) || $gettext('Not a valid email'),
  minLength: (len) => (value) =>
    value.length > len ||
    $gettext('Minimum length is %{ length }', { length: len }),
  numericOrNull: (value) =>
    value == null ||
    value === '' ||
    validateNumeric(value) ||
    $gettext('Must be a numeric value or empty'),
  samePassword: (value, confirmation) =>
    samePassword(value, confirmation) || $gettext('Passwords mismatch'),
}
