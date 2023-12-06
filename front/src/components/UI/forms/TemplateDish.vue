<template>
  <div
    class="container"
    :style="{ backgroundImage: `url(${props.dishImage})` }"
  >
    <div class="container_view">
      <h3>{{ props.textName }}</h3>
      <div class="container_view_description">
        <div>{{ props.textCompound }}</div>
        <br/>
        <div>{{ props.textDescription }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps([
  "dishImage",
  "textName",
  "textCompound",
  "textDescription",
]);
</script>

<style lang="scss" scoped>
.container {
  overflow: hidden;
  width: 300px;
  height: 400px;
  background-color: black;
  margin-bottom: 40px;
  margin-top: 40px;
  border-radius: 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  &_view {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 360px;
    padding: 10px;
    &_description {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
