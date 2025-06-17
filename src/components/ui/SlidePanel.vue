<template>
  <div class="slide-panel" :class="{ open: modelValue }">
    <div class="slide-panel__backdrop" @click="close"></div>
    <div class="slide-panel__container">
      <button class="slide-panel__close" @click="close">
        <IconClose />
      </button>
      <div class="slide-panel__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onUnmounted, onMounted } from "vue";
import IconClose from "~/components/icons/IconClose.vue";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);

function close() {
  emit("update:modelValue", false);
}

function disableBodyScroll() {
  document.body.style.overflow = "hidden";
}

function enableBodyScroll() {
  document.body.style.overflow = "";
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) disableBodyScroll();
    else enableBodyScroll();
  },
);

onUnmounted(() => {
  enableBodyScroll();
  window.removeEventListener("resize", handleResize);
});

//resize обработчик
function handleResize() {
  if (window.innerWidth >= 1280 && props.modelValue) {
    close();
  }
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});
</script>

<style scoped lang="scss">
.slide-panel {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &__container {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    width: 100%;
    max-inline-size: 400px;
    block-size: 100%;
    background: #fff;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  &__close {
    position: absolute;
    inset-block-start: 1rem;
    inset-inline-end: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
  }

  &__content {
    padding: 1rem;
    overflow-y: auto;
    flex: 1;
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