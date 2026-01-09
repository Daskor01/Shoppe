<template>
  <aside class="shop-filters" role="search" aria-label="Filters">
    <div class="shop-filters__search">
      <BaseInput
        :modelValue="filters.search"
        :debounce="200"
        class="shop-filters__search-input"
        name="shop-search"
        placeholder="Search"
        aria-label="Search items in shop"
        @update:modelValue="update('search', $event)"
      />

      <button class="shop-filters__search-button" type="button" aria-label="Submit search">
        <IconSearch aria-hidden="true" />
      </button>
    </div>

    <div class="shop-filters__container">
      <fieldset class="shop-filters__section" style=" padding: 0; margin: 0;border: none">
        <legend class="visually-hidden">Filter and Sort Options</legend>

        <BaseSelect
          :modelValue="filters.sortBy"
          :options="SORT_OPTIONS"
          placeholder="Sort By"
          @update:modelValue="update('sortBy', $event)"
        />

        <BaseSelect
          :modelValue="filters.category"
          :options="categoryOptions"
          placeholder="Category"
          @update:modelValue="update('category', $event)"
        />

        <BaseRangeSlider
          v-model="localPriceRange"
          :min="0"
          :max="200"
          :step="1"
          aria-label="Price range"
        />

        <label class="shop-filters__toggle">
          <span>On sale</span>
          <BaseSwitch
            :modelValue="filters.onSale"
            aria-label="Toggle on sale items"
            @update:modelValue="update('onSale', $event)"
          />
        </label>

        <label class="shop-filters__toggle">
          <span>In stock</span>
          <BaseSwitch
            :modelValue="filters.inStock"
            aria-label="Toggle in stock items"
            @update:modelValue="update('inStock', $event)"
          />
        </label>
      </fieldset>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import IconSearch from '@/components/icons/IconSearch.vue'
  import BaseInput from '@/components/ui/base/BaseInput.vue'
  import BaseRangeSlider from '@/components/ui/base/BaseRangeSlider.vue'
  import BaseSwitch from '@/components/ui/base/BaseSwitch.vue'
  import type { Filters } from '@/types/Filters'
  import { useDebouncedValue } from '@/composables/useDebouncedValue'

  const SORT_OPTIONS = [
    { value: '', label: 'No sorting' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
  ]

  const props = defineProps<{
    filters: Filters
    categories: string[]
  }>()

  const emit = defineEmits<{
    (e: 'update:filters', value: Filters): void
  }>()

  const categoryOptions = computed(() => [
    { value: '', label: 'All categories' },
    ...props.categories.map((c) => ({ value: c, label: c })),
  ])

  const localPriceRange = ref<[number, number]>([...props.filters.priceRange])
  const debouncedPriceRange = useDebouncedValue(localPriceRange, 300)

  const update = (key: keyof Filters, value: unknown) => {
    if (props.filters[key] === value) return

    emit('update:filters', {
      ...props.filters,
      [key]: value,
    })
  }

  watch(debouncedPriceRange, (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(props.filters.priceRange)) {
      update('priceRange', newVal)
    }
  })
</script>

<style scoped lang="scss">
  .shop-filters {
    display: flex;
    flex-direction: column;
    gap: 40px;
    inline-size: 262px;
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

    &__section {
      display: flex;
      flex-direction: column;
      gap: 20px;
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
