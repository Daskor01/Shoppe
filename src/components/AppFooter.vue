<template>
  <footer class="footer">
    <div class="footer__container">
      <nav class="footer__nav">
        <NuxtLink to="/" class="footer__link">Contact</NuxtLink>
        <NuxtLink to="/" class="footer__link">Terms Of Services</NuxtLink>
        <NuxtLink to="/" class="footer__link">Shipping And Returns</NuxtLink>
      </nav>

      <div class="footer__copyright">
        © 2021 Shelly.
        <NuxtLink to="/" class="footer__link">Terms of use</NuxtLink> and
        <NuxtLink to="/" class="footer__link">Privacy policy</NuxtLink>
      </div>

      <form
        class="footer__form"
        ref="form"
        @submit.prevent="handleSubmit"
        novalidate
      >
        <BaseInput
          type="email"
          name="email"
          placeholder="Give an email, get the newsletter."
          class="footer__form-input"
          v-model="email"
          minlength="10"
          data-min-length-message="Минимум 3 символа"
          data-required-message="Введите email"
          data-type-mismatch-message="Некорректный email"
        />
        <p class="footer__form-error" v-if="errors.email">{{ errors.email }}</p>
        <button type="submit" class="footer__form-button">
          <IconArrowRight class="footer__icon" />
        </button>
        <div class="footer__form-consent-container">
          <input
            type="checkbox"
            class="footer__form-consent-checkbox"
            required
            checked
          />
          <p class="footer__form-consent-text">
            i agree to the website’s terms and conditions
          </p>
        </div>
      </form>

      <div class="footer__soc1als">
        <p class="footer__soc1als-text">Follow us</p>
        <div class="footer__soc1als-separator"></div>
        <NuxtLink to="/" class="footer__soc1als-link">
          <IconFacebook />
        </NuxtLink>
        <NuxtLink to="/" class="footer__soc1als-link">
          <IconInstagram />
        </NuxtLink>
        <NuxtLink to="/" class="footer__soc1als-link">
          <IconTwitter />
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import BaseInput from "./ui/BaseInput.vue";
import { ref } from "vue";
import { useFormValidation } from "../composables/useFormValidation";

const email = ref("");
const showErrors = ref(false);

const form = ref<HTMLFormElement | null>(null);
const { errors, validateAll } = useFormValidation(form);

const handleSubmit = () => {
  const emailValue = email.value.trim();

  if (!validateAll()) return;

  if (!emailValue) return;

  const stored = localStorage.getItem("subscribedEmails") || "[]";
  const emails: string[] = stored ? JSON.parse(stored) : [];

  if (!emails.includes(emailValue)) {
    emails.push(emailValue);
    localStorage.setItem("subscribedEmails", JSON.stringify(emails));
    alert("Email сохранён!");
  } else {
    alert("Этот email уже добавлен.");
  }

  showErrors.value = false;
  email.value = "";
};
</script>

<style scoped lang="scss">
@use "@/assets/scss/variables";

.footer {
  inline-size: 100%;
  padding-block: 12.5rem 2rem;

  &__container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "nav form"
      "copyright socials";
    row-gap: 50px;
  }

  &__nav {
    grid-area: nav;
    text-transform: uppercase;
    display: flex;
    column-gap: 40px;
  }

  &__link {
    color: $color-gray;
    line-height: 169%;
    text-decoration: none;
    transition: 0.5s;

    &:hover {
      opacity: 0.5;
    }
  }

  &__copyright {
    grid-area: copyright;
  }

  &__form {
    grid-area: form;
    display: flex;
    align-items: center;
    max-block-size: 40px;
    max-inline-size: 396px;
    border-block-end: 2px solid $color-gray;
    padding: 0;
    transition: 0.2s;
    position: relative;

    &:has(input:focus) {
      border-block-end-color: $color-dark;
    }

    &-input {
      grid-area: input;
      padding-block-start: 10px;
    }

    &-button {
      background-color: transparent;
      border: none;
      color: $color-gray;
      cursor: pointer;
      transition: 0.3s;
      grid-area: button;

      &:hover {
        opacity: 0.5;
      }
    }

    &-error {
      color: red;
      position: absolute;
      bottom: -35px;
      font-size: 14px;
    }

    &-consent-container {
      display: none;
    }

    &-consent-checkbox {
      border-color: $color-gray;
      accent-color: $color-gray;
    }
  }

  &__soc1als {
    grid-area: socials;
    display: flex;
    column-gap: 30px;
    list-style: none;
    align-items: center;

    &-text {
      display: none;
    }

    &-separator {
      display: none;
    }

    &-link {
      transition: 0.3s;
      &:hover {
        opacity: 0.5;
      }
    }
  }

  @media (max-width: $breakpoints-l) {
    &__container {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      grid-template-areas:
        "form"
        "nav"
        "socials"
        "copyright";
      row-gap: 50px;
    }
  }

  @media (max-width: $breakpoints-s) {
    font-size: 14px;

    &__nav {
      flex-direction: column;
      margin-block-start: 40px;
    }

    &__form {
      display: grid;
      grid-template-columns: 2fr;
      grid-template-areas:
        "input button"
        "consent .";

      &-input {
        font-size: 14px;
      }

      &-consent-container {
        display: flex;
        grid-area: consent;
        align-items: center;
        margin-block-start: 10px;
      }

      &-consent-text {
        font-size: 12px;
      }

      &-error {
        bottom: 15px;
        font-size: 12px;
      }
    }

    &__soc1als {
      column-gap: 16px;

      &-text {
        display: block;
      }

      &-separator {
        display: block;
        block-size: 1px;
        inline-size: 47px;
        background-color: $color-dark;
      }
    }
  }
}
</style>
