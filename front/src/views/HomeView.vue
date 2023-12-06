<template>
  <div>
    <div class="auth">
      <a href="/login">Войти</a>
    </div>
    <h1 class="menu">Меню</h1>
    <div class="home">
      <div v-for="dish in menu" :key="dish.id">
        <TemplateDish
          :dishImage="dish.image"
          :textName="dish.name"
          :textCompound="dish.compound"
          :textDescription="dish.description"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TemplateDish from "../components/UI/forms/TemplateDish.vue";
import { getmenu } from "../api";
import { ref, onMounted } from "vue";


const menu = ref<{ id: number; name: string; compound: string; description: string; image: string; }[]>([]);


onMounted(async (): Promise<void> => {
  menu.value = await getmenu();
});

</script>

<style lang="scss" scoped>
.auth {
  height: 50px;
  background-color: darkslateblue;
  width: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid gray;
  border-radius: 20px;
  margin: 30px;
}
.menu {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.home {
  padding: 1rem;
  display: grid;
  flex-direction: column;
  align-items: center;
  display: grid;
  justify-items: center;
  gap: 10px;
  grid-template-columns: 330px auto 33%;
  justify-content: center;
}
</style>
