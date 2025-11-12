<template>
  <transition name="slide-fade">
    <div
      v-if="notification.visible"
      :class="['base-notification', `base-notification--${notification.type}`]"
      :style="styleObject"
    >
      <slot name="icon">
        <component :is="iconComponent" class="base-notification__icon" />
      </slot>

      <div class="base-notification__message">
        <slot>{{ notification.message }}</slot>
      </div>

      <button
        v-if="notification.button?.text"
        class="base-notification__button"
        @click="notification.button.handler"
      >
        {{ notification.button.text }}
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import IconSuccess from '@/components/icons/IconSuccess.vue'
  import IconError from '@/components/icons/IconError.vue'
  import IconInfo from '@/components/icons/IconInfo.vue'
  import IconWarning from '@/components/icons/IconWarning.vue'
  import type { NotificationProps } from '@/types/Notification'

  const props = defineProps<Props>()

  interface Props {
    notification: NotificationProps
  }

  //Отрисовываем иконку в зависимости от типа уведомления
  const iconMap = {
    success: IconSuccess,
    error: IconError,
    info: IconInfo,
    warning: IconWarning,
  }

  const iconComponent = computed(() => {
    return iconMap[props.notification.type || 'info']
  })

  //Вычисляем отступы для контейнера
  const leftPadding = ref(0)
  const rightPadding = ref(0)

  const styleObject = computed(() => ({
    left: `${leftPadding.value}px`,
    right: `${rightPadding.value}px`,
  }))

  onMounted(() => {
    const updatePadding = () => {
      const container = document.querySelector('.container')
      if (container) {
        const style = getComputedStyle(container)
        leftPadding.value = parseInt(style.paddingLeft)
        rightPadding.value = parseInt(style.paddingRight)
      }
    }

    updatePadding()
    window.addEventListener('resize', updatePadding)
  })
</script>

<style scoped lang="scss">
  .base-notification {
    position: fixed;
    top: 20px;
    z-index: 9999;
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 14px 20px;
    font-weight: 500;
    color: vars.$color-dark;
    background-color: vars.$color-ligth-gray;
    border-radius: 8px;

    &__icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
    }

    &__message {
      flex-grow: 1;
    }

    &__button {
      padding: 0;
      font-weight: bold;
      color: vars.$color-accent-light;
      text-transform: uppercase;
      cursor: pointer;
      background: none;
      border: none;
    }
  }

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.3s ease;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }
</style>
