<!-- <template>
  <div class="home">
    <h1>Мои рецепты</h1>
    <button>Добавить новый рецепт</button>
    <div class="recipes">
    </div>
    <div class="popup">
      <div class="popup__content">
        <h2>Добавить новый рецепт</h2>
        <form @submit.prevent="">
          <div class="popup__content__group">
          <label>Название рецепта</label>
          <input type="text"/>
        </div>

        <div class="popup__content__group">
          <label>Описание блюда</label>
          <textarea type="text"></textarea>
        </div>

        <div class="popup__content__group">
          <label>Ингридиенты</label>
          <div class="ingridient">
            <input type="text"/>
          </div>
         <button type="button">Добавить ингридиенты</button>
        </div>

        <div class="popup__content__group">
          <label>Описание как готовить</label>
          <div class="method">
          <textarea></textarea>
        </div>
          <button type="button">Добавить этап готовки</button>
        </div>
        <button type="submit">Добавить созданный рецепт</button>
        <button type="button">Закрыть</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  components: {
  }
})
export default class HomeView extends Vue {}

</script>

<style lang="scss" scoped>
.home{
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 32px;
}

.recipes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

</style> -->
<template>
  <div>
    <div class="auth">
      <a href="/login">Войти</a>
    </div>
    <div class="home">
    <h1>Меню</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
// import { useStore } from 'vuex'
// import Button from '../components/UI/button/ButtonElement.vue'

</script>

<style lang="scss">
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
.home {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 32px;
}

.recipes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.recipes .card {
  padding: 1rem;
  border-radius: 5px;
  margin: 1rem;
  background-color: #081c33;
}

.recipes .card h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.recipes .card p {
  font-size: 1.125rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.add-recipe-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-recipe-popup .popup-content {
  background-color: #081c33;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 768px;
}

.popup-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.popup-content .group {
  margin-bottom: 1rem;
}

.popup-content .group label {
  display: block;
  margin-bottom: 0.5rem;
}

.popup-content .group input,
.popup-content .group textarea {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.popup-content .group textarea {
  height: 100px;
  resize: none;
}

.popup-content button[type="submit"] {
  margin-right: 1rem;
}
</style>
