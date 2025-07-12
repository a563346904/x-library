<template>
  <div>
    <h1>Test With Import</h1>
    <p>This page imports definePageMeta from virtual module</p>
  </div>
</template>

<script setup>
import { definePageMeta } from '~virtual-macros';

console.log('Test with import loaded');

definePageMeta({
  layout: 'default'
});
</script>
