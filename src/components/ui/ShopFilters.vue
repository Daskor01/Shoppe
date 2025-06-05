<template>
  <aside class="shop-filters">
    <div class="shop-filters__search">
      <BaseInput
        placeholder="Search"
        class="shop-filters__search-input"
        v-model="filters.search"
      />
      <button class="shop-filters__search-button" @click="applyFilters">
        <IconSearch />
      </button>
    </div>

    <div class="shop-filters__container">
      <select class="shop-filters__select" v-model="filters.category">
        <option value="">Category</option>
        <option
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>

      <select class="shop-filters__select" v-model="filters.sortBy">
        <option value="">Sort By</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A-Z</option>
      </select>

      <RangeSlider
        v-model="filters.priceRange"
        :min="0"
        :max="200"
        :step="1"
        @apply="applyFilters"
      />

      <label class="shop-filters__toggle">
        On sale
        <BaseSwitch v-model="filters.onSale" />
      </label>

      <label class="shop-filters__toggle">
        In stock
        <BaseSwitch v-model="filters.inStock" />
      </label>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch, onMounted } from "vue";
import IconSearch from "@/components/icons/IconSearch.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import RangeSlider from "@/components/ui/RangeSlider.vue";
import type { Filters } from "@/types/Filters";
import { useRoute, useRouter } from "vue-router";
import BaseSwitch from "@/components/ui/BaseSwitch.vue";
import { useProductsStore } from "@/stores/useProductsStore";

const route = useRoute();
const router = useRouter();
const emit = defineEmits(["update:filters"]);
const store = useProductsStore();

const filters = ref<Filters>({
  search: "",
  category: "",
  sortBy: "",
  priceRange: [0, 200],
  onSale: false,
  inStock: false,
});

const categories = ["jewelery", "electronics", "clothing"];

onMounted(() => {
  const query = route.query;

  filters.value = {
    search: (query.search as string) || "",
    category: (query.category as string) || "",
    sortBy: (query.sortBy as string) || "",
    priceRange: query.priceRange
      ? ((query.priceRange as string).split(",").map(Number) as [
          number,
          number,
        ])
      : [0, 200],
    onSale: query.onSale === "true",
    inStock: query.inStock === "true",
  };

  if (filters.value.category) {
    fetchCategory(filters.value.category);
  } else {
    store.fetchAllProducts();
  }

  applyFilters();
});

//Делаем запрос при выборе категории
watch(
  () => filters.value.category,
  (newCategory) => {
    if (newCategory) {
      fetchCategory(newCategory);
    } else {
      store.fetchAllProducts();
    }
    applyFilters();
  },
);

//Следим за локальными фильтрами
watch(
  filters,
  () => {
    updateQuery();
    applyFilters();
  },
  { deep: true },
);

async function fetchCategory(category: string) {
  await store.fetchProductsByCategory(category);
}

//Обновление query строки
function updateQuery() {
  const query: Record<string, any> = {
    ...route.query,
    search: filters.value.search || undefined,
    category: filters.value.category || undefined,
    sortBy: filters.value.sortBy || undefined,
    priceRange: filters.value.priceRange.join(","),
    onSale: filters.value.onSale ? "true" : undefined,
    inStock: filters.value.inStock ? "true" : undefined,
  };

  router.replace({ query });
}

// Передаём наружу все фильтры
function applyFilters() {
  emit("update:filters", { ...filters.value });
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

  &__select {
    padding: 12px 16px;
    border: 1px solid $color-ligth-gray;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }

  &__toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
