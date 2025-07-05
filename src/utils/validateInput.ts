export function validateInput(input: HTMLInputElement): string {
  const validity = input.validity
  const dataset = input.dataset

  const error =
    (validity.tooShort && dataset.minLengthMessage) ||
    (validity.valueMissing && dataset.requiredMessage) ||
    (validity.typeMismatch && dataset.typeMismatchMessage) ||
    (validity.patternMismatch && dataset.patternMessage) ||
    (validity.tooLong && dataset.maxLengthMessage) ||
    ''

  input.setCustomValidity(error)
  return error
}
