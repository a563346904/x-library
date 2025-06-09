<template>
  <div>Minimal Vue Example</div>
</template>

<script>
export default {
  setup() {
    // 只测试一个规则：vue/custom-event-name-casing
    const emit = defineEmits(['Update']);
  }
}

</script>
