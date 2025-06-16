<template>
  <section v-if="product" class="product-page">
    <div class="product-page__gallery">
      <div class="product-page__thumbnails">
        <img
          v-for="(img, index) in productImages"
          :key="index"
          :src="img"
          :class="{ active: index === activeIndex }"
          @click="activeIndex = index"
        />
      </div>

      <div class="product-page__main-image">
        <img :src="productImages[activeIndex]" alt="Main product" />
      </div>
    </div>

    <div class="product-page__info">
      <h1 class="product-title">{{ product.title }}</h1>
      <p class="product-price">${{ product.price }}</p>

      <div class="product-rating">★★★★★</div>

      <p class="product-description">{{ product.description }}</p>

      <div class="product-actions">
        <div class="quantity-selector">
          <button @click="decrease">-</button>
          <span>{{ quantity }}</span>
          <button @click="increase">+</button>
        </div>
        <button class="add-to-cart" @click="addToCart">Add to Cart</button>
      </div>

      <div class="product-meta">
        <p><strong>SKU:</strong> 12</p>
        <p><strong>Category:</strong> {{ product.category }}</p>
      </div>

      <button class="product-like" @click="toggleFavorite">
        <IconLike />
      </button>

      <div class="product-socials">
        <IconMail />
        <IconFacebook />
        <IconInstagram />
        <IconTwitter />
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useCartStore } from '~/stores/useCartStore'
import { useFavoritesStore } from '~/stores/useFavoriteStore'

const route = useRoute()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()

const product = ref<any>(null)
const quantity = ref(1)
const activeIndex = ref(0)
const productImages = ref<string[]>([])

const increase = () => quantity.value++
const decrease = () => quantity.value = Math.max(1, quantity.value - 1)

const addToCart = () => {
  cartStore.addToCart(product.value)
}

const toggleFavorite = () => {
  favoritesStore.toggle(product.value)
}

onMounted(async () => {
  const res = await fetch(`https://fakestoreapi.com/products/${route.params.id}`)
  product.value = await res.json()
  productImages.value = [product.value.image, product.value.image, product.value.image, product.value.image]
})
</script>

<style scoped lang="scss">
  .product-page {
  display: flex;
  gap: 2rem;
  margin-block-start: 2rem;

  &__gallery {
    display: flex;
    gap: 1rem;
  }

  &__thumbnails {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    img {
      inline-size: 60px;
      block-size: 60px;
      object-fit: cover;
      border: 2px solid transparent;
      cursor: pointer;

      &.active {
        border-color: black;
      }
    }
  }

  &__main-image img {
    inline-size: 400px;
    object-fit: cover;
  }

  &__info {
    flex: 1;

    .product-title {
      font-size: 24px;
      margin-block-end: 10px;
    }

    .product-price {
      font-weight: bold;
      font-size: 18px;
    }

    .product-description {
      margin-block-start: 1rem;
      line-height: 1.6;
    }

    .product-actions {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;

      .add-to-cart {
        padding: 0.5rem 1rem;
        background-color: black;
        color: white;
        border: none;
        cursor: pointer;
      }
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      button {
        inline-size: 30px;
        block-size: 30px;
        font-size: 18px;
      }
    }

    .product-meta {
      margin-block-start: 1rem;
    }

    .product-socials {
      display: flex;
      gap: 1rem;
      margin-block-start: 1rem;

      svg {
        cursor: pointer;
      }
    }
  }
}
</style>
