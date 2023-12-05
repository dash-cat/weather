<template>
  <button class="btn">{{ props.msg }}</button>
</template>

<script setup>
const props = defineProps(['msg'])
</script>

<style scoped>
.btn {
  width: auto;
  color: black;
  background-color: #0ff;
  border-radius: 10px;
  opacity: 0.8;
  height: auto-fit;
}
</style>
