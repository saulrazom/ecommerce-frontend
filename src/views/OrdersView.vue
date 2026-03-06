<template>
  <section class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight text-[#2f4a34] sm:text-3xl">My orders</h1>
      <p class="text-sm text-[#5a725f] sm:text-base">Track your recent purchases.</p>
    </header>

    <div class="overflow-hidden rounded-lg border border-[#d6e2cc] bg-[#fffdf7]">
      <div class="grid grid-cols-3 bg-[#f2f7ef] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#5a725f] sm:text-sm">
        <span>Order</span>
        <span>Date</span>
        <span class="text-right">Status</span>
      </div>

      <div
        v-for="order in orders"
        :key="order.id"
        class="grid grid-cols-3 items-center border-t border-[#e7eee1] px-4 py-3 text-sm"
      >
        <span class="font-medium text-[#2f4a34]">#{{ order.id }}</span>
        <span class="text-[#617966]">{{ order.date }}</span>
        <span class="text-right">
          <span class="rounded-md px-2 py-1 text-xs font-medium" :class="order.badgeClass">{{ order.status }}</span>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
const orders = [
  { id: 'A-1024', date: '2026-03-01', status: 'Delivered', badgeClass: 'bg-[#e6efe0] text-[#47604b]' },
  { id: 'A-1025', date: '2026-03-03', status: 'In transit', badgeClass: 'bg-[#e6efe0] text-[#47604b]' },
  { id: 'A-1026', date: '2026-03-04', status: 'Processing', badgeClass: 'bg-[#e6efe0] text-[#47604b]' },
]
</script>
