<template>
    <div class="container">
      <h1>{{ props.msg }} </h1>
    </div>
</template>

<script setup>
const props = defineProps(['msg'])
</script>

<style scoped lang="scss">
.container {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgb(255, 42, 0);
    height: 67px;
    width: 400px;
    background: white;
    justify-content: space-around;
    font-size: 10px;
}
</style>