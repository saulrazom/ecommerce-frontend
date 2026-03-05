<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app-wrapper">
    <Navbar />

    <main class="layout-container">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f8f9fa;
}

.layout-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  flex: 1; /* Hace que el main tome el espacio disponible */
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Fuerza a que la página mida al menos el 100% del alto de la pantalla */
}
</style>
