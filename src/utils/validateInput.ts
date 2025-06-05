export function validateInput(input: HTMLInputElement): string {
  input.setCustomValidity(""); // Сбросить старую ошибку

  if (input.validity.valueMissing && input.dataset.requiredMessage) {
    return input.dataset.requiredMessage;
  }

  if (input.validity.typeMismatch && input.dataset.typeMismatchMessage) {
    return input.dataset.typeMismatchMessage;
  }

  if (input.validity.patternMismatch && input.dataset.patternMessage) {
    return input.dataset.patternMessage;
  }

  if (input.validity.tooShort && input.dataset.minLengthMessage) {
    return input.dataset.minLengthMessage;
  }

  if (input.validity.tooLong && input.dataset.maxLengthMessage) {
    return input.dataset.maxLengthMessage;
  }

  return "";
}
