<template>
  <XLayout>
    <router-view />
  </XLayout>
</template>

<script setup>
import { XLayout } from '~virtual-layouts-export';
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
