
export default {
  required: value => !!value || 'Field is required',
  email: value => (validateEmail(value)) || 'Not a valid email',
  minLength: len => value => (value.length > len) || 'Minimum length is 6'
}
