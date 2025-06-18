import { ref, onMounted, onBeforeUnmount } from "vue";
import { validateInput } from "../src/utils/validateInput";

export function useFormValidation(formRef: Ref<HTMLFormElement | null>) {
  const errors = ref<Record<string, string>>({});

  const handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    errors.value[input.name] = "";
  };

  const handleFocus = (e: Event) => {
    const input = e.target as HTMLInputElement;
    errors.value[input.name] = "";
  };

  const handleBlur = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const error = validateInput(input);
    errors.value[input.name] = error;
  };

  const validateAll = () => {
    const inputs =
      formRef.value?.querySelectorAll("input, textarea, select") || [];
    inputs.forEach((input) => {
      const el = input as HTMLInputElement;
      const error = validateInput(el);
      errors.value[el.name] = error;
    });

    return Object.values(errors.value).every((msg) => !msg);
  };

  onMounted(() => {
    const form = formRef.value;
    if (form) {
      form.addEventListener("input", handleInput, true);
      form.addEventListener("blur", handleBlur, true);
      form.addEventListener("focus", handleFocus, true);
    }
  });

  onBeforeUnmount(() => {
    const form = formRef.value;
    if (form) {
      form.removeEventListener("input", handleInput, true);
      form.removeEventListener("blur", handleBlur, true);
      form.removeEventListener("focus", handleFocus, true);
    }
  });

  return {
    errors,
    validateAll,
  };
}
