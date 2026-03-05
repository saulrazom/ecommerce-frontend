<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar">
    <div class="logo">
      <h2>🛍️ E-Commerce Team 3</h2>
    </div>

    <div class="links">
      <RouterLink to="/">Catálogo</RouterLink>
      <RouterLink to="/cart">Carrito</RouterLink>
      <RouterLink to="/orders">Mis Órdenes</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.links a {
  color: #42b983;
  text-decoration: none;
  margin-left: 1.5rem;
  font-weight: bold;
  font-size: 1.1rem;
}

.links a:hover {
  color: white;
}
</style>
