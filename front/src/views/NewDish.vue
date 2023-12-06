<template>
  <div class="container">
    <TemplateDish
      :dishImage="dishImage"
      :textName="textName"
      :textCompound="textCompound"
      :textDescription="textDescription"
    />
    <div class="container_dish">
      <FormEl msg="Название блюда" v-model="textName" />
      <FormEl msg="Состав" area="true" v-model="textCompound" />
      <FormEl msg="Описание блюда" area="true" v-model="textDescription" />
      <div class="dish_container">
        <label>Загрузить фотографию блюда &nbsp;</label>
        <ImageUpload @upload="upload" />
      </div>
      <Button
        msg="Установить блюдо в меню"
        @click="saveDish(textName, textCompound, textDescription)"
      ></Button>
      <div class="container_hint">
        <span>Заполните все поля и подтвердите</span>
      </div>
    </div>
  </div>
</template>
<!-- необходимо сделать удаление данных после отправки формы (textName) -->
<script setup lang="ts">
import ImageUpload from "../components/UI/input/ImageUpload.vue";
import Button from "../components/UI/button/ButtonElement.vue";
import FormEl from "../components/UI/forms/FormEl.vue";
import TemplateDish from "../components/UI/forms/TemplateDish.vue";
import { sendDish } from "../api";
import { ref } from "vue";

const textName = ref("");
const textCompound = ref("");
const textDescription = ref("");
const dishImage = ref("");
const dish = ref({});

type Dish = {
  id: number;
  name: string;
  compound: string;
  description: string;
}

async function saveDish(
  name: string,
  compound: string,
  description: string
): Promise<void> {
  if (!name || !compound || !description) return;
  let dish: Dish = {
    id: Date.now(),
    name: name,
    compound: compound,
    description: description,
  };
  textName.value = "";
  textCompound.value = "";
  textDescription.value = "";
  dishImage.value = "";
  const dishes = await sendDish(dish.value);
  console.log("dish", dishes);
}

function upload(image: string) {
  dish.value.image = image;
  dishImage.value = image;
}
</script>

<style lang="scss">
.container {
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
  flex-direction: column;

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
