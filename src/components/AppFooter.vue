<template>
  <EmailNotification
    v-model="showNotification"
    :message="notificationMessage"
    :type="notificationType"
    :autoCloseDelay="3000"
  />

  <footer class="footer">
    <div class="footer__container">
      <nav class="footer__nav">
        <NuxtLink v-for="link in footerLinks" :key="link.path" :to="link.path" class="footer__link">
          {{ link.name }}
        </NuxtLink>
      </nav>

      <div class="footer__copyright">
        © 2021 Shelly.
        <template v-for="(link, index) in copyrightLinks" :key="link.name">
          <NuxtLink :to="link.path" class="footer__link">{{ link.name }}</NuxtLink>
          <span v-if="index < copyrightLinks.length - 1"> and </span>
        </template>
      </div>

      <form ref="form" class="footer__form" novalidate @submit.prevent="handleSubmit">
        <BaseInput
          v-model="email"
          :error="showErrors ? errors.email : ''"
          ref="emailInputRef"
          type="email"
          name="email"
          placeholder="Give an email, get the newsletter."
          class="footer__form-input"
          minlength="15"
          data-min-length-message="Минимум 15 символов"
          data-required-message="Введите email"
          data-type-mismatch-message="Некорректный email"
        />

        <button type="submit" class="footer__form-button">
          <IconArrowRight class="footer__icon" />
        </button>

        <div class="footer__form-consent-container">
          <input
            ref="consentCheckbox"
            type="checkbox"
            class="footer__form-consent-checkbox"
            required
            checked
          />
          <p class="footer__form-consent-text">i agree to the website’s terms and conditions</p>
        </div>
      </form>

      <div class="footer__socials">
        <p class="footer__socials-text">Follow us</p>
        <div class="footer__socials-separator"></div>
        <NuxtLink
          v-for="link in socialLinks"
          :key="link.name"
          :to="link.path"
          class="footer__socials-link"
        >
          <component :is="link.icon" />
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import BaseInput from '@/components/ui/BaseInput.vue'
  import EmailNotification from '@/components/ui/EmailNotification.vue'
  import { validateInput } from '@/utils/validateInput'
  import { copyrightLinks, footerLinks, socialLinks } from '@/config/navigation'

  type NotificationType = 'success' | 'error' | 'warning' | 'info'

  const form = ref<HTMLFormElement | null>(null)
  const emailInputRef = ref<InstanceType<typeof BaseInput> | null>(null)

  const email = ref('')
  const consentCheckbox = ref<HTMLInputElement | null>(null)
  const showErrors = ref(false)
  const errors = ref<Record<string, string>>({})

  const showNotification = ref(false)
  const notificationMessage = ref('')
  const notificationType = ref<NotificationType>('info')

  //Валидируем форму перед отправкой
  const validateForm = (): boolean => {
    const inputEl = emailInputRef.value?.$el?.querySelector('input')
    const error = validateInput(inputEl)
    errors.value.email = error

    if (error) {
      return false
    }

    if (!consentCheckbox.value?.checked) {
      showAlert('You must agree to the terms of use.', 'warning')
      return false
    }

    return true
  }

  //Получаем сохраненные email из localStorage
  const getStoredEmails = (): string[] => {
    const stored = localStorage.getItem('subscribedEmails') || '[]'
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }

  const isEmailNew = (emailValue: string, emails: string[]): boolean => {
    return !emails.includes(emailValue)
  }

  // Сохраняем email в localStorage
  const saveEmail = (emailValue: string, emails: string[]): void => {
    emails.push(emailValue)
    localStorage.setItem('subscribedEmails', JSON.stringify(emails))
  }

  const showAlert = (message: string, type: NotificationType = 'info') => {
    notificationMessage.value = message
    notificationType.value = type
    showNotification.value = true
  }

  const resetForm = () => {
    showErrors.value = false
    email.value = ''
    errors.value.email = ''
  }

  //Обработчик отправки формы
  const handleSubmit = () => {
    showErrors.value = true

    if (!validateForm()) return

    const emailValue = email.value.trim()
    const emails = getStoredEmails()

    if (isEmailNew(emailValue, emails)) {
      saveEmail(emailValue, emails)
      showAlert('Email sent!', 'success')
    } else {
      showAlert('This email has already been sent.', 'info')
    }

    resetForm()
  }
</script>

<style scoped lang="scss">
  .footer {
    inline-size: 100%;
    padding-block-start: 2rem;

    &__container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        'nav form'
        'copyright socials';
      row-gap: 50px;
    }

    &__nav {
      grid-area: nav;
      text-transform: uppercase;
      display: flex;
      column-gap: 40px;
    }

    &__link {
      color: vars.$color-gray;
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
      border-block-end: 2px solid vars.$color-gray;
      padding: 0;
      transition: 0.2s;
      position: relative;
      justify-self: end;
      min-inline-size: 288px;

      &:has(input:focus) {
        border-block-end-color: vars.$color-dark;
      }

      &-input {
        inline-size: 100%;
        grid-area: input;
        padding-block-start: 10px;
      }

      &-button {
        background-color: transparent;
        border: none;
        color: vars.$color-gray;
        cursor: pointer;
        transition: 0.3s;
        grid-area: button;

        &:hover {
          opacity: 0.5;
        }
      }

      &-consent-container {
        display: none;
      }

      &-consent-checkbox {
        border-color: vars.$color-gray;
        accent-color: vars.$color-gray;
      }
    }

    &__socials {
      grid-area: socials;
      display: flex;
      column-gap: 30px;
      list-style: none;
      align-items: center;
      justify-self: end;

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

    @media (max-width: vars.$breakpoints-l) {
      &__container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        grid-template-areas:
          'form'
          'nav'
          'socials'
          'copyright';
        row-gap: 50px;
      }

      &__form {
        justify-self: start;
      }

      &__soc1als {
        justify-self: start;
      }
    }

    @media (max-width: vars.$breakpoints-s) {
      font-size: 14px;

      &__nav {
        flex-direction: column;
        margin-block-start: 40px;
      }

      &__form {
        display: grid;
        grid-template-columns: 2fr;
        grid-template-areas:
          'input button'
          'consent .';

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
          background-color: vars.$color-dark;
        }
      }
    }
  }
</style>
