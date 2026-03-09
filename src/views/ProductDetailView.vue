<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-8">
    <button
      @click="router.back()"
      class="mb-8 flex items-center gap-2 text-sm font-medium text-[#5a725f] hover:text-[#2f4a34] transition"
    >
      <span class="text-lg">←</span> Back to Catalog
    </button>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div
        class="w-12 h-12 border-4 border-[#c5d7b8] border-t-[#6f8b63] rounded-full animate-spin"
      ></div>
      <p class="text-[#5a725f]">Loading product information...</p>
    </div>

    <div
      v-else-if="product"
      class="grid gap-8 lg:grid-cols-2 bg-[#fffdf7] border border-[#d6e2cc] rounded-2xl p-6 sm:p-10 shadow-sm"
    >
      <div
        class="aspect-square bg-[#edf4e8] rounded-xl flex flex-col items-center justify-center text-[#617966] border border-[#c5d7b8]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-20 w-20 opacity-20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span class="mt-4 text-sm font-medium">Product Image Placeholder</span>
      </div>

      <div class="flex flex-col justify-between space-y-6">
        <div class="space-y-4">
          <span
            class="inline-block px-3 py-1 rounded-full bg-[#edf4e8] text-[#48624d] text-xs font-bold uppercase tracking-widest"
          >
            {{ product.category || 'General' }}
          </span>
          <h1 class="text-3xl sm:text-4xl font-bold text-[#2f4a34] leading-tight">
            {{ product.name }}
          </h1>
          <p class="text-2xl font-semibold text-[#48624d]">${{ product.price }}</p>

          <div class="pt-4 border-t border-[#d6e2cc]">
            <h3 class="text-sm font-bold text-[#2f4a34] uppercase mb-2">Description</h3>
            <p class="text-[#617966] leading-relaxed text-base">
              {{ product.description }}
            </p>
          </div>
        </div>

        <div class="space-y-4 pt-6">
          <div class="flex items-center gap-4">
            <span class="text-sm font-medium text-[#2f4a34]">Quantity:</span>
            <div class="flex items-center border border-[#c5d7b8] rounded-md bg-white">
              <button
                @click="qty > 1 ? qty-- : null"
                class="px-3 py-1 text-[#4d6953] hover:bg-[#edf4e8]"
              >
                -
              </button>
              <span class="px-4 py-1 text-sm font-bold text-[#2f4a34] border-x border-[#c5d7b8]">{{
                qty
              }}</span>
              <button @click="qty++" class="px-3 py-1 text-[#4d6953] hover:bg-[#edf4e8]">+</button>
            </div>
          </div>

          <button
            @click="addToCart"
            class="w-full bg-[#6f8b63] hover:bg-[#5f7855] text-[#f8f5ee] font-bold py-4 rounded-xl transition shadow-lg shadow-[#6f8b63]/20 flex items-center justify-center gap-2"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-20 bg-[#fffdf7] border border-dashed border-[#d6e2cc] rounded-2xl"
    >
      <p class="text-[#617966] mb-4">We couldn't find the product you're looking for.</p>
      <router-link to="/" class="text-[#6f8b63] font-bold underline"
        >Go back to Catalog</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

// Recibimos el ID desde la URL
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const qty = ref(1)

// 1. Obtener el detalle desde la API
const fetchProductDetail = async () => {
  try {
    loading.value = true
    const response = await fetch(`${import.meta.env.VITE_PRODUCTS_API_URL}/products/${props.id}`)

    if (!response.ok) throw new Error('Product not found')

    product.value = await response.json()
  } catch (error) {
    console.error('Error fetching detail, loading mock data...', error)
    // Datos de prueba por si la API falla
    product.value = {
      id: props.id,
      name: 'Premium Product Detail',
      description:
        'This is a high-quality product description. It explains all the features and benefits of this item in a way that makes customers want to buy it immediately.',
      price: 2499,
      category: 'Premium',
    }
  } finally {
    loading.value = false
  }
}

// 2. Agregar al carrito usando el store de Pinia
const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value, qty.value)
    alert(`Added ${qty.value} ${product.value.name}(s) to cart!`)
    router.push('/cart') // Opcional: Redirigir al carrito
  }
}

onMounted(fetchProductDetail)
</script>
