<template>
  <div>
    <h1>Home Page</h1>
    <p>Welcome to the Vite example with auto-routing!</p>
    <router-link to="/about">Go to About</router-link>
  </div>
</template>

<script setup>
import { definePageMeta } from '~virtual-macros';

console.log('Home page loaded');

definePageMeta({
  layout: 'default'
});
</script>
