<template>
  <div id="app">
    <nav>
      <router-link v-for="route in router.getRoutes()" :key="route.path" :to="route.path">
        {{ route.name }} |
      </router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// No script needed for this simple layout
</script>

<style>
#app {
  margin-top: 60px;
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

nav {
  padding: 30px;
}

nav a {
  color: #2c3e50;
  font-weight: bold;
}

nav .router-link-exact-active {
  color: #42b983;
}
</style>
