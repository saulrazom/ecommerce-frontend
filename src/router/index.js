import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/CatalogView.vue'
import CartView from '../views/CartView.vue'
import OrdersView from '../views/OrdersView.vue'
// 1. Importa la vista de detalle (tienes que crear este archivo en src/views/)
import ProductDetailView from '../views/ProductDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/cart', name: 'cart', component: CartView },
    { path: '/orders', name: 'orders', component: OrdersView },
    // 2. Agrega esta ruta dinámica para el detalle
    {
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetailView,
      props: true, // Esto permite que el ID llegue como prop al componente
    },
  ],
})

export default router
