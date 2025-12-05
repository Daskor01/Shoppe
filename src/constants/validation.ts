import type { ValidationConfig } from '@/types/Validate'

export const VALIDATION_CONFIGS = {
  email: {
    rules: {
      type: 'email' as const,
      required: true,
    },
    messages: {
      requiredMessage: 'Email is required',
      typeMismatchMessage: 'Please enter a valid email',
    },
  },

  password: {
    rules: {
      required: true,
      minLength: 6,
    },
    messages: {
      requiredMessage: 'Password is required',
      minLengthMessage: 'Password must be at least 6 characters',
      patternMessage: 'Password must contain letters and numbers',
    },
  },

  name: {
    rules: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Zа-яА-ЯёЁ0-9_\s-]+$/,
    },
    messages: {
      requiredMessage: 'Name is required',
      minLengthMessage: 'Name is too short',
      maxLengthMessage: 'Name is too long',
      patternMessage: 'Name can only contain letters, spaces and hyphens',
    },
  },
  message: {
    rules: {
      required: true,
      minLength: 10,
      maxLength: 1000,
    },
    messages: {
      requiredMessage: 'Enter the text of the review',
      minLengthMessage: 'Minimum of 10 characters',
      maxLengthMessage: 'Review is too long (maximum 1000 characters)',
    },
  },
} as const satisfies Record<string, ValidationConfig>
