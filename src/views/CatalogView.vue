<template>
  <section class="space-y-8">
    <header class="space-y-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-[#2f4a34] sm:text-3xl">Catalog</h1>
          <p class="text-sm text-[#5a725f] sm:text-base">Explore our collection of products</p>
        </div>

        <div class="relative w-full sm:w-72">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-md border border-[#c5d7b8] bg-[#fffdf7] px-4 py-2 text-sm text-[#2f4a34] focus:border-[#6f8b63] focus:outline-none"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-4">
        <select
          v-model="selectedCategory"
          class="rounded-md border border-[#c5d7b8] bg-[#fffdf7] px-3 py-2 text-sm text-[#2f4a34] focus:outline-none"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <input
          v-model.number="maxPrice"
          type="number"
          placeholder="Max Price"
          class="rounded-md border border-[#c5d7b8] bg-[#fffdf7] px-3 py-2 text-sm text-[#2f4a34] w-32 focus:outline-none"
        />
      </div>
    </header>

    <div v-if="loading" class="flex justify-center py-20">
      <p class="text-[#5a725f] animate-pulse">Loading products from API...</p>
    </div>

    <div v-else>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in paginatedProducts"
          :key="item.id"
          class="rounded-lg border border-[#d6e2cc] bg-[#fffdf7] p-4 flex flex-col transition hover:shadow-md"
        >
          <h2
            class="text-base font-medium text-[#2f4a34] cursor-pointer hover:text-[#6f8b63] transition"
            @click="goToDetail(item.id)"
          >
            {{ item.name }}
          </h2>

          <p class="mt-2 text-sm text-[#617966] flex-grow">{{ item.description }}</p>
          <p class="mt-4 text-sm font-semibold text-[#48624d]">${{ item.price }}</p>

          <div class="mt-4 flex items-center gap-2">
            <span class="text-xs text-[#617966]">Qty</span>
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

      <div v-if="filteredProducts.length === 0" class="py-10 text-center text-[#617966]">
        No products found matching your criteria.
      </div>

      <div v-if="totalPages > 1" class="mt-10 flex justify-center items-center gap-4">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="px-4 py-2 rounded-md border border-[#c5d7b8] text-[#4d6953] disabled:opacity-30 hover:bg-[#edf4e8] transition"
        >
          Previous
        </button>

        <span class="text-sm text-[#2f4a34] font-medium"
          >Page {{ currentPage }} of {{ totalPages }}</span
        >

        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="px-4 py-2 rounded-md border border-[#c5d7b8] text-[#4d6953] disabled:opacity-30 hover:bg-[#edf4e8] transition"
        >
          Next
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

// Navegación y Store
const router = useRouter()
const cartStore = useCartStore()

// Estados para la API y Búsqueda
const products = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const maxPrice = ref(null)
const selectedQty = reactive({})

// Configuración de Paginación
const currentPage = ref(1)
const itemsPerPage = 6

// 1. Obtener productos de la API
const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await fetch(`${import.meta.env.VITE_PRODUCTS_API_URL}/products`)
    const data = await response.json()
    products.value = data
    data.forEach((item) => {
      selectedQty[item.id] = 1
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    // Datos mock en caso de error para que no se vea vacío el catálogo
    products.value = [
      {
        id: 1,
        name: 'Laptop Pro',
        description: 'Performance for demanding tasks',
        price: 24999,
        category: 'Electronics',
      },
      {
        id: 2,
        name: 'AirPods Pro',
        description: 'Noise cancellation',
        price: 5999,
        category: 'Audio',
      },
      {
        id: 3,
        name: 'Apple Watch',
        description: 'Health tracking',
        price: 8499,
        category: 'Electronics',
      },
      {
        id: 4,
        name: 'iPad Air',
        description: 'Powerful and thin',
        price: 14999,
        category: 'Electronics',
      },
      {
        id: 5,
        name: 'Magic Mouse',
        description: 'Multi-touch surface',
        price: 1999,
        category: 'Accessories',
      },
      {
        id: 6,
        name: 'Case iPhone',
        description: 'Silicone protection',
        price: 999,
        category: 'Accessories',
      },
      {
        id: 7,
        name: 'Mac Mini',
        description: 'Desktop power',
        price: 12999,
        category: 'Electronics',
      },
    ]
    products.value.forEach((item) => {
      selectedQty[item.id] = 1
    })
  } finally {
    loading.value = false
  }
}

// 2. Extraer categorías únicas de los productos
const categories = computed(() => {
  const cats = products.value.map((p) => p.category).filter(Boolean)
  return [...new Set(cats)]
})

// 3. Lógica de Filtrado (Búsqueda + Categoría + Precio)
const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value
      ? product.category === selectedCategory.value
      : true
    const matchesPrice = maxPrice.value ? product.price <= maxPrice.value : true

    return matchesSearch && matchesCategory && matchesPrice
  })
})

// 4. Lógica de Paginación
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage) || 1
})

// Resetear página cuando cambien los filtros
watch([searchQuery, selectedCategory, maxPrice], () => {
  currentPage.value = 1
})

const goToDetail = (id) => {
  router.push({ name: 'product-detail', params: { id } })
}

onMounted(fetchProducts)

// --- Lógica de Cantidades y Carrito ---
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
