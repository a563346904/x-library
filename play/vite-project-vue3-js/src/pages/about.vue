<template>
  <div>
    <h1>About Page</h1>
    <p>This is the about page using Vite auto-routing!</p>
    <router-link to="/">Back to Home</router-link>
  </div>
</template>

<script setup>
console.log('About page loaded');
definePageMeta({
  layout: 'admin'
});
</script>
