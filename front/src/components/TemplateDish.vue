<template>
  <div
    class="container_template"
    :style="{ backgroundImage: `url(${dish.image})` }"
  >
    <div class="container_template_view" v-for="dish in allDish" :key="dish.id">
      <h3>{{ dish.name }}</h3>
      <div class="container_template_view_description">
        <span>{{ dish.compound }}</span
        ><br />
        <span>{{ dish.description }}</span>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss"></style>
