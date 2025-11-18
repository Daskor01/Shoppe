<template>
  <div :class="{ open: modelValue }" class="slide-panel">
    <div class="slide-panel__backdrop" @click="close" />
    <div :class="['slide-panel__container', containerSideClass]" :style="containerStyle">
      <button v-if="props.showCloseButton !== false" class="slide-panel__close" @click="close">
        <IconClose />
      </button>
      <div class="slide-panel__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { watch, onUnmounted } from 'vue'
  import IconClose from '@/components/icons/IconClose.vue'
  import { DESKTOP_BREAKPOINT } from '@/constants/breakpoints'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { computed, ref, onMounted } from 'vue'

  const props = defineProps<{
    modelValue: boolean
    side?: 'left' | 'right'
    topOffset?: string
    showCloseButton?: boolean
    mobileOnly?: boolean
    width?: string
  }>()

  const emit = defineEmits(['update:modelValue'])

  function close() {
    emit('update:modelValue', false)
  }

  //Выбираем класс для контейнера в зависимости от стороны
  //Если side не указан, по умолчанию будет 'left'!
  const containerSideClass = computed(() =>
    props.side === 'right' ? 'slide-panel__container--right' : 'slide-panel__container--left',
  )

  //Вычисляем ширину контейнера
  const isMounted = ref(false)

  onMounted(() => {
    isMounted.value = true
  })

  const containerStyle = computed(() => {
    if (!isMounted.value) {
      return { maxInlineSize: '320px' }
    }

    let width = props.width ?? 320
    if (typeof width === 'number') {
      width = width + 'px'
    }

    return {
      maxInlineSize: width,
    }
  })

  // Блокировка прокрутки
  function disableBodyScroll() {
    document.body.style.overflow = 'hidden'
  }

  function enableBodyScroll() {
    document.body.style.overflow = ''
  }

  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal) disableBodyScroll()
      else enableBodyScroll()
    },
  )

  // Мобилка
  const { isBelow } = useBreakpoint(DESKTOP_BREAKPOINT)

  watch([isBelow, () => props.modelValue], ([below, opened]) => {
    if (props.mobileOnly && !below && opened) {
      close()
    }
  })

  onUnmounted(() => {
    enableBodyScroll()
  })
</script>

<style scoped lang="scss">
  .slide-panel {
    position: fixed;
    inset: 0;
    top: v-bind('props.topOffset || 0');
    z-index: 3000;
    pointer-events: none;

    &__backdrop {
      position: absolute;
      inset: 0;
      background: rgb(0 0 0 / 40%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &__container {
      position: absolute;
      inset-block-start: 0;
      display: flex;
      flex-direction: column;
      inline-size: 100%;
      max-inline-size: 320px;
      block-size: 100%;
      background: vars.$color-light;
      transform: translateX(-100%);
      transition: transform 0.3s ease;

      &--left {
        inset-inline-start: 0;
        border-inline-end: 1px solid vars.$color-gray;
        transform: translateX(-100%);
      }

      &--right {
        inset-inline-end: 0;
        border-inline-start: 1px solid vars.$color-gray;
        transform: translateX(100%);
      }
    }

    &__close {
      position: absolute;
      inset-block-start: 1rem;
      inset-inline-end: 1rem;
      font-size: 2rem;
      cursor: pointer;
      background: none;
      border: none;
    }

    &__content {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &.open {
      pointer-events: auto;

      .slide-panel__backdrop {
        opacity: 1;
      }

      .slide-panel__container {
        transform: translateX(0);
      }
    }
  }
</style>
