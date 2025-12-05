import { type ValidationRules, type ValidationMessages } from '@/types/Validate'

export function validateValue(
  value: string,
  rules: ValidationRules,
  messages: ValidationMessages,
): string {
  const { required, minLength, maxLength, pattern, type } = rules
  const {
    requiredMessage = 'Field is required',
    minLengthMessage = `Minimum length is ${minLength}`,
    maxLengthMessage = `Maximum length is ${maxLength}`,
    patternMessage = 'Invalid format',
    typeMismatchMessage = 'Invalid type',
  } = messages

  if (required && !value.trim()) {
    return requiredMessage
  }

  if (!required && !value.trim()) {
    return ''
  }

  if (minLength && value.length < minLength) {
    return minLengthMessage
  }

  if (maxLength && value.length > maxLength) {
    return maxLengthMessage
  }

  if (pattern && !pattern.test(value)) {
    return patternMessage
  }

  if (type === 'email' && !isValidEmail(value)) {
    return typeMismatchMessage
  }

  return ''
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
