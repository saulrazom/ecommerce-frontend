<template>
  <section class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight text-[#2f4a34] sm:text-3xl">Cart</h1>
      <p class="text-sm text-[#5a725f] sm:text-base">Review products before checkout.</p>
    </header>

    <div
      v-if="cartItems.length === 0"
      class="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-[#c5d7b8] bg-[#fffdf7] p-6 text-center"
    >
      <div class="space-y-2">
        <p class="text-base font-medium text-[#48624d]">Your cart is empty</p>
        <p class="text-sm text-[#5a725f]">Add products from the Catalog to start shopping.</p>
      </div>
    </div>

    <div v-else class="space-y-3 rounded-lg border border-[#d6e2cc] bg-[#fffdf7] p-4">
      <div
        v-for="product in cartItems"
        :key="product.productId"
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
            @click="cartStore.decreaseQty(product.productId)"
          >
            -
          </button>
          <span class="w-8 text-center text-sm font-medium text-[#2f4a34]">{{ product.qty }}</span>
          <button
            type="button"
            class="h-7 w-7 rounded-md border border-[#c5d7b8] text-[#4d6953] transition hover:bg-[#edf4e8]"
            @click="cartStore.increaseQty(product.productId)"
          >
            +
          </button>
        </div>
        <div class="flex items-center gap-3 self-start sm:self-center">
          <p class="text-sm font-semibold text-[#2f4a34]">{{ product.formattedLineTotal }}</p>
          <button
            type="button"
            class="text-xs font-medium text-[#7a4d4d] transition hover:text-[#5f3535]"
            @click="cartStore.removeFromCart(product.productId)"
          >
            Remove
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-[#dfe8d7] pt-4 text-sm">
        <span class="text-[#5a725f]">Total</span>
        <span class="font-semibold text-[#2f4a34]">{{ formattedTotal }}</span>
      </div>

      <button
        type="button"
        class="w-full rounded-md bg-[#6f8b63] px-4 py-2 text-sm font-medium text-[#f8f5ee] transition hover:bg-[#5f7855]"
      >
        Proceed to checkout
      </button>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const { cartItems, formattedTotal } = storeToRefs(cartStore)
</script>
