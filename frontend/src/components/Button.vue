<script setup>
defineProps({
  msg: {
    type: String,
  }
})
</script>

<template>
   <button class="btn">{{ msg }}</button>
</template>

<style scoped>
.btn {
  width: 100px;
  color: black;
  background-color: #0ff;
  border-radius: 10px;
  opacity: 0.8;
}
</style>
