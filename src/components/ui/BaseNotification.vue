<template>
  <transition name="slide-fade">
    <div
      v-if="modelValue"
      :class="['base-notification', `base-notification--${type}`]"
      :style="styleObject"
    >
      <slot name="icon">
        <component :is="iconComponent" class="base-notification__icon" />
      </slot>

      <div class="base-notification__message">
        <slot>{{ message }}</slot>
      </div>

      <slot name="close">
        <button class="base-notification__close" @click="model = false">
          <IconClose />
        </button>
      </slot>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
  import IconClose from '@/components/icons/IconClose.vue'
  import IconSuccess from '@/components/icons/IconSuccess.vue'
  import IconError from '@/components/icons/IconError.vue'
  import IconInfo from '@/components/icons/IconInfo.vue'
  import IconWarning from '@/components/icons/IconWarning.vue'

  const model = defineModel<boolean>()

  const props = defineProps({
    message: String,
    type: {
      type: String,
      default: 'info',
    },
    autoCloseDelay: {
      type: Number,
      default: 4000,
    },
  })

  //Отрисовываем иконку в зависимости от типа уведомления
  const iconMap = {
    success: IconSuccess,
    error: IconError,
    info: IconInfo,
    warning: IconWarning,
  }

  const iconComponent = computed(() => {
    return iconMap[props.type as keyof typeof iconMap] || IconInfo
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

  //Таймер для автоматического закрытия уведомления
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(model, (visible) => {
    if (visible) {
      clearTimeout(timeoutId!)
      timeoutId = setTimeout(() => {
        model.value = false
      }, props.autoCloseDelay)
    } else {
      clearTimeout(timeoutId!)
    }
  })

  onBeforeUnmount(() => {
    clearTimeout(timeoutId!)
  })
</script>

<style scoped lang="scss">
  .base-notification {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    border-radius: 8px;
    position: fixed;
    top: 20px;
    z-index: 9999;
    font-weight: 500;
    color: vars.$color-dark;
    background-color: vars.$color-ligth-gray;

    &__icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
    }

    &__message {
      flex-grow: 1;
    }
  }

  //Анимация
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
