<template>
  <div class="container">
    <div class="container_dish">
      <FormEl msg="Название блюда" v-model="textName" />
      <FormEl msg="Состав" area="true" v-model="textCompound" />
      <FormEl msg="Описание блюда" area="true" v-model="textDescription" />
      <div class="dish_container">
        <label>Загрузить фотографию блюда &nbsp;</label>
        <ImageUpload @upload="upload" />
      </div>
      <Button
        msg="Предпросмотр блюда"
        @click="saveDish(textName, textCompound, textDescription)"
      ></Button>
      <Button msg="Установить блюдо в меню" @click="sendToDb(allDish)"></Button>
      <div class="container_hint">
        <span>Заполните все поля и нажмите Предпросмотр</span>
      </div>
    </div>
  </div>
</template>
<!-- необходимо сделать удаление данных после отправки формы -->
<script setup>
import ImageUpload from "../components/UI/input/ImageUpload.vue";
import Button from "../components/UI/button/ButtonElement.vue";
import FormEl from "../components/UI/forms/FormEl.vue";
import { ref } from "vue";

const allDish = ref([]);
const dish = {};

function sendToDb(array) {
  if (!array.length) return;

  this.$store.commit("addDish", array);
  console.log(array);
}

function saveDish(name, compound, description) {
  if (!name || !compound || !description) return;
  dish.id = Date.now();
  dish.name = name;
  dish.compound = compound;
  dish.description = description;
  allDish.value.push(dish);
}

function upload(image) {
  console.log(image);
  dish.image = image;
}
</script>

<style lang="scss">
.container {
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
  flex-direction: column;
  &_template {
    width: 300px;
    height: 400px;
    background-color: currentColor;
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
  &_dish {
    gap: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &_hint {
    text-align: center;
    color: cadetblue;
  }
}
</style>
