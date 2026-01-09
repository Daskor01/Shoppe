<template>
  <main>
    <h1 class="visually-hidden">Shoppe Store</h1>
    <Carousel />
    <ProductList />
  </main>
</template>

<script setup lang="ts">
  import ProductList from '@/components/ui/product/ProductList.vue'
  import Carousel from '@/components/ui/home/Carousel.vue'

  useHead({
    title: 'Shoppe | Clothing Store',
    meta: [
      { name: 'description', content: 'Explore our carefully curated collection of clothing.' },
    ],
  })
</script>
