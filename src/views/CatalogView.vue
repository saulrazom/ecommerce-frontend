<template>
  <section class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight text-[#2f4a34] sm:text-3xl">Catalog</h1>
      <p class="text-sm text-[#5a725f] sm:text-base">Explore our of products</p>
    </header>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="item in featured"
        :key="item.id"
        class="rounded-lg border border-[#d6e2cc] bg-[#fffdf7] p-4"
      >
        <h2 class="text-base font-medium text-[#2f4a34]">{{ item.name }}</h2>
        <p class="mt-2 text-sm text-[#617966]">{{ item.description }}</p>
        <p class="mt-4 text-sm font-semibold text-[#48624d]">${{ item.price }}</p>
        <div class="mt-4 flex items-center gap-2">
          <span class="text-xs text-[#617966]">Quantity</span>
          <button
            type="button"
            class="h-7 w-7 rounded-md border border-[#c5d7b8] text-[#4d6953] transition hover:bg-[#edf4e8]"
            @click="decreaseSelectedQty(item.id)"
          >
            -
          </button>
          <input
            v-model.number="selectedQty[item.id]"
            type="number"
            min="1"
            class="w-14 rounded-md border border-[#c5d7b8] bg-[#fffdf7] px-2 py-1 text-center text-sm text-[#2f4a34] focus:border-[#6f8b63] focus:outline-none"
            @blur="normalizeSelectedQty(item.id)"
          />
          <button
            type="button"
            class="h-7 w-7 rounded-md border border-[#c5d7b8] text-[#4d6953] transition hover:bg-[#edf4e8]"
            @click="increaseSelectedQty(item.id)"
          >
            +
          </button>
        </div>
        <button
          type="button"
          class="mt-4 w-full rounded-md bg-[#6f8b63] px-3 py-2 text-sm font-medium text-[#f8f5ee] transition hover:bg-[#5f7855]"
          @click="addProduct(item)"
        >
          Add to cart
        </button>
      </article>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useCartStore } from '@/stores/cart'

const featured = [
  { id: 1, name: 'Laptop Pro', description: 'Performance for demanding tasks', price: 24999 },
  { id: 2, name: 'AirPods Pro', description: 'Noise cancellation', price: 5999 },
  { id: 3, name: 'Apple Watch', description: 'Health and daily activity tracking', price: 8499 },
]

const cartStore = useCartStore()
const selectedQty = reactive(Object.fromEntries(featured.map((item) => [item.id, 1])))

const normalizeSelectedQty = (productId) => {
  const value = Number(selectedQty[productId])
  selectedQty[productId] = Number.isFinite(value) && value > 0 ? Math.trunc(value) : 1
}

const increaseSelectedQty = (productId) => {
  normalizeSelectedQty(productId)
  selectedQty[productId] += 1
}

const decreaseSelectedQty = (productId) => {
  normalizeSelectedQty(productId)
  selectedQty[productId] = Math.max(1, selectedQty[productId] - 1)
}

const addProduct = (product) => {
  normalizeSelectedQty(product.id)
  cartStore.addToCart(product, selectedQty[product.id])
  selectedQty[product.id] = 1
}
</script>
