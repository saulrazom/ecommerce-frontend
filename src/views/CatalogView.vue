<template>
  <section class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight text-[#2f4a34] sm:text-3xl">Catalog</h1>
      <p class="text-sm text-[#5a725f] sm:text-base">Explore our of products</p>
    </header>

    <div v-if="loading" class="flex justify-center py-12">
      <p class="text-sm text-[#5a725f]">Loading products...</p>
    </div>

    <div v-else-if="error" class="rounded-lg border border-[#f1c7c7] bg-[#fff5f5] p-4">
      <p class="text-sm font-medium text-[#7a4d4d]">Could not load products.</p>
      <p class="mt-1 text-sm text-[#7a4d4d]">{{ error }}</p>
    </div>

    <div
      v-else-if="products.length === 0"
      class="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-[#c5d7b8] bg-[#fffdf7] p-6 text-center"
    >
      <div class="space-y-2">
        <p class="text-base font-medium text-[#48624d]">No products found</p>
        <p class="text-sm text-[#5a725f]">Try changing your filters or seed the database.</p>
      </div>
    </div>

    <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="item in products"
        :key="item.productId"
        class="rounded-lg border border-[#d6e2cc] bg-[#fffdf7] p-4"
      >
        <div class="mb-3 overflow-hidden rounded-md border border-[#e7eee1] bg-[#f2f7ef]">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.name"
            class="h-40 w-full object-cover"
            loading="lazy"
            @error="item.imageUrl = null"
          />
          <div v-else class="flex h-40 w-full items-center justify-center bg-gradient-to-br from-[#f2f7ef] to-[#fffdf7]">
            <p class="text-xs font-medium uppercase tracking-wide text-[#5a725f]">No image</p>
          </div>
        </div>

        <h2 class="text-base font-medium text-[#2f4a34]">{{ item.name }}</h2>
        <p class="mt-2 text-sm text-[#617966]">{{ item.description }}</p>
        <p class="mt-4 text-sm font-semibold text-[#48624d]">${{ item.price }}</p>
        <div class="mt-4 flex items-center gap-2">
          <span class="text-xs text-[#617966]">Quantity</span>
          <button
            type="button"
            class="h-7 w-7 rounded-md border border-[#c5d7b8] text-[#4d6953] transition hover:bg-[#edf4e8]"
            @click="decreaseSelectedQty(item.productId)"
          >
            -
          </button>
          <input
            v-model.number="selectedQty[item.productId]"
            type="number"
            min="1"
            class="w-14 rounded-md border border-[#c5d7b8] bg-[#fffdf7] px-2 py-1 text-center text-sm text-[#2f4a34] focus:border-[#6f8b63] focus:outline-none"
            @blur="normalizeSelectedQty(item.productId)"
          />
          <button
            type="button"
            class="h-7 w-7 rounded-md border border-[#c5d7b8] text-[#4d6953] transition hover:bg-[#edf4e8]"
            @click="increaseSelectedQty(item.productId)"
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
import { onMounted, reactive, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import api from '@/services/api'

const products = ref([])
const loading = ref(false)
const error = ref(null)

const cartStore = useCartStore()

// Will be populated once products load
const selectedQty = reactive({})

const ensureSelectedQty = (productId) => {
  if (selectedQty[productId] === undefined) selectedQty[productId] = 1
}

onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    const res = await api.get('/products')
    products.value = Array.isArray(res.data) ? res.data : []

    // initialize quantities for all products
    for (const p of products.value) {
      if (p?.productId) ensureSelectedQty(p.productId)
    }
  } catch (err) {
    error.value = err?.response?.data?.error || err?.message || 'Unknown error'
    products.value = []
  } finally {
    loading.value = false
  }
})

const normalizeSelectedQty = (productId) => {
  ensureSelectedQty(productId)
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
  // NOTE: cart store still uses `id` today. We'll migrate it to `productId` in the next step.
  // For now we keep behavior, but use productId as our key.
  normalizeSelectedQty(product.productId)
  cartStore.addToCart(product, selectedQty[product.productId])
  selectedQty[product.productId] = 1
}
</script>
