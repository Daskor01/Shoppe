<template>
  <div class="star-rating" :class="{ readonly }">
    <IconStar
      v-for="i in 5"
      :key="i"
      :class="['star', { filled: i <= rating }]"
      @click="selectStar(i)"
    />
  </div>
</template>

<script setup lang="ts">
  import IconStar from '@/components/icons/IconStar.vue'

  const props = defineProps<{
    readonly?: boolean
  }>()

  const rating = defineModel<number>({
    default: 0,
    required: false,
  })

  const selectStar = (value: number) => {
    if (props.readonly) return
    rating.value = value
  }
</script>

<style scoped lang="scss">
  .star {
    cursor: pointer;
    transition: fill 0.2s ease;

    @media (max-width: vars.$breakpoints-m) {
      inline-size: 12px;
      block-size: 12px;
    }

    &.filled {
      fill: vars.$color-dark;
    }

    &:hover:not(.readonly *) {
      transform: scale(1.1);
    }
  }

  .star-rating {
    display: flex;
    gap: 10px;

    &.readonly .star {
      pointer-events: none;
      cursor: default;
    }
  }
</style>
