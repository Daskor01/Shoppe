<template>
  <div 
    :class="{ open: modelValue }" 
    class="slide-panel"
    :aria-hidden="!modelValue"
  >
    <div 
      class="slide-panel__backdrop" 
      aria-hidden="true" 
      @click="close" 
    />
    
    <div 
      ref="panelRef"
      :class="['slide-panel__container', containerSideClass]"
      role="dialog"
      :aria-modal="true"
      :aria-label="props.ariaLabel || 'Side panel'"
      tabindex="-1"
    >
      <button 
        v-if="props.showCloseButton !== false" 
        class="slide-panel__close" 
        aria-label="Close panel"
        @click="close"
      >
        <IconClose aria-hidden="true" />
      </button>

      <div class="slide-panel__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import type { SlidePanelProps } from '@/types/SlidePanel'

const props = defineProps<SlidePanelProps>()

const emit = defineEmits(['update:modelValue'])
const panelRef = ref<HTMLElement | null>(null)

function close() {
  emit('update:modelValue', false)
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    setTimeout(() => panelRef.value?.focus(), 100)
  } else {
    document.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  if (props.modelValue) document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})

const containerSideClass = computed(() =>
  props.side === 'right' ? 'slide-panel__container--right' : 'slide-panel__container--left'
)

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
      block-size: 100%;
      max-inline-size: 500px;
      background: vars.$color-light;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      
      @media (max-width: vars.$breakpoints-l) {
        max-inline-size: 320px;
      }

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
