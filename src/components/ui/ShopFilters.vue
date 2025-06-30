<template>
  <aside class="shop-filters">
    <div class="shop-filters__search">
      <BaseInput
        :modelValue="filters.search"
        placeholder="Search"
        class="shop-filters__search-input"
        @update:modelValue="update('search', $event)"
      />

      <button class="shop-filters__search-button">
        <IconSearch />
      </button>
    </div>

    <div class="shop-filters__container">
      <div class="shop-filters__select-container">
        <select
          :value="filters.category"
          class="shop-filters__select"
          @change="handleChange('category', $event)"
        >
          <option value="" disabled selected hidden>Category</option>
          <option value="">All categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <IconBaseArrowDown class="shop-filters__select-icon" />
      </div>

      <div class="shop-filters__select-container">
        <select
          class="shop-filters__select"
          :value="filters.sortBy"
          @change="handleChange('sortBy', $event)"
        >
          <option value="" disabled selected hidden>Sort By</option>
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <IconBaseArrowDown class="shop-filters__select-icon" />
      </div>

      <RangeSlider
        :modelValue="filters.priceRange"
        @update:modelValue="update('priceRange', $event)"
        :min="0"
        :max="200"
        :step="1"
      />

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

  const sortOptions = [
    { value: '', label: 'No sorting' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
  ]

  const props = defineProps<{
    filters: Filters
    categories: string[]
  }>()

  const emit = defineEmits(['update:filters'])

  function handleChange(key: keyof Filters, event: Event) {
    const target = event.target as HTMLSelectElement | null
    if (target) {
      update(key, target.value)
    }
  }

  function update(key: keyof Filters, value: any) {
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
    background-color: $color-light;

    &__search {
      position: relative;
      display: flex;
      gap: 0.5rem;
      border-block-end: 1px solid $color-ligth-gray;

      &-input {
        width: 100%;
        padding-inline-end: 2rem;
      }

      &-button {
        background: transparent;
        border: none;
        transition: 0.3s;
        cursor: pointer;

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
      border: 1px solid $color-ligth-gray;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      appearance: none;

      &-icon {
        position: absolute;
        top: 50%;
        right: 20px;
      }
    }

    &__toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
