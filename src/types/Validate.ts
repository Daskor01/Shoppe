export interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  type?: 'email' | 'text' | 'password' | 'tel'
}

export interface ValidationMessages {
  requiredMessage?: string
  minLengthMessage?: string
  maxLengthMessage?: string
  patternMessage?: string
  typeMismatchMessage?: string
}

export interface ValidationConfig {
  rules: ValidationRules
  messages: ValidationMessages
}
