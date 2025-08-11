<template>
  <aside class="shop-filters">
    <div class="shop-filters__search">
      <BaseInput
        v-model="filters.search"
        :debounce="200"
        :name="'shop-search'"
        placeholder="Search"
        class="shop-filters__search-input"
      />

      <button class="shop-filters__search-button">
        <IconSearch />
      </button>
    </div>

    <div class="shop-filters__container">
      <BaseSelect v-model="filters.sortBy" :options="sortOptions" placeholder="Sort By" />

      <BaseSelect v-model="filters.category" :options="categoryOptions" placeholder="Category" />

      <RangeSlider v-model="localPriceRange" :min="0" :max="200" :step="1" />

      <label class="shop-filters__toggle">
        On sale
        <BaseSwitch :modelValue="filters.inStock" @update:modelValue="update('inStock', $event)" />
      </label>

      <label class="shop-filters__toggle">
        In stock
        <BaseSwitch :modelValue="filters.inStock" @update:modelValue="update('inStock', $event)" />
      </label>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import IconSearch from '@/components/icons/IconSearch.vue'
  import BaseInput from '@/components/ui/BaseInput.vue'
  import RangeSlider from '@/components/ui/RangeSlider.vue'
  import BaseSwitch from '@/components/ui/BaseSwitch.vue'
  import type { Filters } from '@/types/Filters'
  import { ref, watch, computed } from 'vue'
  import { useDebouncedValue } from '@/composables/useDebouncedValue'

  const sortOptions = [
    { value: '', label: 'No sorting' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
  ]

  const categoryOptions = computed(() => [
    { value: '', label: 'All categories' },
    ...props.categories.map((c) => ({ value: c, label: c })),
  ])

  const props = defineProps<{
    filters: Filters
    categories: string[]
  }>()

  const emit = defineEmits(['update:filters'])

  const localPriceRange = ref<[number, number]>(props.filters.priceRange)
  const debouncedPriceRange = useDebouncedValue(localPriceRange, 300)

  watch(debouncedPriceRange, (newVal) => {
    emit('update:filters', {
      ...props.filters,
      priceRange: newVal,
    })
  })

  function update(key: keyof Filters, value: unknown) {
    emit('update:filters', {
      ...props.filters,
      [key]: value,
    })
  }
</script>

<style scoped lang="scss">
  .shop-filters {
    display: flex;
    flex-direction: column;
    gap: 40px;
    inline-size: 288px;
    background-color: vars.$color-light;

    &__search {
      position: relative;
      display: flex;
      gap: 0.5rem;
      border-block-end: 1px solid vars.$color-ligth-gray;

      &-input {
        width: 100%;
        padding-inline-end: 2rem;
      }

      &-button {
        cursor: pointer;
        background: transparent;
        border: none;
        transition: 0.3s;

        &:hover {
          opacity: 0.5;
        }
      }
    }

    &__container {
      display: flex;
      flex-direction: column;
      gap: 39px;
    }

    &__select-container {
      position: relative;
    }

    &__select {
      inline-size: 100%;
      padding: 12px 16px;
      font-size: 14px;
      appearance: none;
      cursor: pointer;
      border: 1px solid vars.$color-ligth-gray;
      border-radius: 4px;

      &-icon {
        position: absolute;
        top: 50%;
        right: 20px;
      }
    }

    &__toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
