<template>
  <section class="space-y-8 max-w-4xl mx-auto">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight text-[#2f4a34] sm:text-3xl">Checkout</h1>
      <p class="text-sm text-[#5a725f] sm:text-base">
        Review products before finalizing your order.
      </p>
    </header>

    <div
      v-if="cartItems.length === 0"
      class="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-[#c5d7b8] bg-[#fffdf7] p-6 text-center"
    >
      <div class="space-y-2">
        <p class="text-base font-medium text-[#48624d]">Your cart is empty</p>
        <p class="text-sm text-[#5a725f]">Add products from the Catalog to start shopping.</p>
        <router-link to="/" class="inline-block mt-4 text-[#6f8b63] font-bold underline"
          >Go to Catalog</router-link
        >
      </div>
    </div>

    <div v-else class="space-y-6">
      <div class="rounded-lg border border-[#d6e2cc] bg-[#fffdf7] p-4 space-y-3">
        <div
          v-for="product in cartItems"
          :key="product.id"
          class="flex flex-col gap-3 border-b border-[#e7eee1] pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="min-w-0">
            <p class="text-sm font-medium text-[#2f4a34]">{{ product.name }}</p>
            <p class="text-sm text-[#617966]">{{ product.formattedPrice }} each</p>
          </div>
          <div class="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              class="h-7 w-7 rounded-md border border-[#c5d7b8] text-[#4d6953] transition hover:bg-[#edf4e8]"
              @click="cartStore.decreaseQty(product.id)"
            >
              -
            </button>
            <span class="w-8 text-center text-sm font-medium text-[#2f4a34]">{{
              product.qty
            }}</span>
            <button
              type="button"
              class="h-7 w-7 rounded-md border border-[#c5d7b8] text-[#4d6953] transition hover:bg-[#edf4e8]"
              @click="cartStore.increaseQty(product.id)"
            >
              +
            </button>
          </div>
          <div class="flex items-center gap-3 self-start sm:self-center">
            <p class="text-sm font-semibold text-[#2f4a34]">{{ product.formattedLineTotal }}</p>
            <button
              type="button"
              class="text-xs font-medium text-[#7a4d4d] transition hover:text-[#5f3535]"
              @click="cartStore.removeFromCart(product.id)"
            >
              Remove
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between border-t border-[#dfe8d7] pt-4 text-base">
          <span class="text-[#5a725f] font-medium">Order Total</span>
          <span class="font-bold text-[#2f4a34] text-lg">{{ formattedTotal }}</span>
        </div>
      </div>

      <button
        type="button"
        @click="handleCheckout"
        :disabled="isProcessing"
        class="w-full rounded-md bg-[#6f8b63] px-6 py-3 text-base font-bold text-[#f8f5ee] transition hover:bg-[#5f7855] shadow-lg shadow-[#6f8b63]/20 disabled:opacity-50 flex justify-center items-center gap-3"
      >
        <span
          v-if="isProcessing"
          class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
        ></span>
        {{ isProcessing ? 'Processing Order...' : 'Confirm and Pay' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()
const { cartItems, formattedTotal } = storeToRefs(cartStore)

const isProcessing = ref(false)

// Lógica para enviar la orden al microservicio (CHECKOUT)
const handleCheckout = async () => {
  if (cartItems.value.length === 0) return

  isProcessing.value = true

  // Estructura de datos para el microservicio de órdenes
  const orderData = {
    items: cartItems.value.map((item) => ({
      productId: item.id,
      name: item.name,
      quantity: item.qty,
      price: item.price,
    })),
    // Calculamos el total numérico (sin formato de texto)
    total: cartItems.value.reduce((acc, item) => acc + item.price * item.qty, 0),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_ORDERS_API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) throw new Error('Failed to place order')

    const result = await response.json()
    console.log('Order created successfully:', result)

    // ÉXITO: Limpiar carrito y redirigir
    alert('Order placed successfully! 🎉')

    // Aquí usamos un patch para limpiar los items del store de Pinia
    cartStore.$patch({ cartItems: [] })

    // Redirigir a la página de órdenes
    router.push('/orders')
  } catch (error) {
    console.error('Checkout error:', error)
    alert('Error processing your order. Please try again later.')
  } finally {
    isProcessing.value = false
  }
}
</script>
