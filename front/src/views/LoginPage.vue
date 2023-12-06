<template>
  <div class="container">
    <div class="container_auth">
      <div class="container_auth_header">{{ authHeader }}</div>
      <div class="container_auth_form">
        <InputEl label="Логин" type="email" v-model="login" />
      </div>
      <div class="container_auth_form">
        <InputEl label="Пароль" type="password" v-model="password" />
      </div>
      <div class="container_auth_form">
        <CheckBox
          msg="Создать нового пользователя*"
          type="checkbox"
          v-model="checked"
          @change="onCheckboxChange"
        />
      </div>
      <Button msg="Войти" class="container_auth_btn" @click="onClick"
      ></Button>
      <div class="description">{{ description }}</div>
    </div>
    <ErrorVue v-show="errorMassage" :msg="errorMassage"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { signIn } from "../api";
import InputEl from "../components/UI/input/InputEl.vue";
import Button from "../components/UI/button/ButtonElement.vue";
import CheckBox from "../components/UI/input/CheckBox.vue";
import ErrorVue from "../components/UI/forms/ErrorVue.vue"


const login = ref("");
const password = ref("");
const checked = ref(false); //регистрация true
const authHeader = ref("Вход");
const description = ref(
  "*После регистрации вам будет доступно добавление блюд в меню"
);
const errorMassage = ref('')

const onCheckboxChange = () => {
  checked.value = !checked.value;
  authHeader.value = checked.value ? "Регистрация" : "Вход";
};

async function onClick() {
  if (!login.value || !password.value) return;
  console.log("logi", login.value, password.value, checked.value);

  try {
    const errorHandler = await signIn(login.value, password.value, checked.value)
    if (errorHandler.type === 'error' ) {
      errorMassage.value = errorHandler.message
      setTimeout(() => {
        errorMassage.value = ''
      }, 1500);
      console.log('Неверный пароль!')
    }

  } catch (error) {
    console.log( error)
  }

}

</script>

<style lang="scss" scoped >
main {
  display: flex;
  width: 100%;
  justify-content: space-around;
}
.description {
  font-size: 12px;
  margin: 7px;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 100vh;
  &_auth {
    display: flex;
    width: 500px;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    color: azure;
    justify-content: center;
    border: 1px solid gray;
    border-radius: 20px;
    background: rgb(62 97 141 / 70%);
    height: 300px;
    &_header {
      margin-top: 30px;
      font-size: 20px;
    }
    &_form {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: space-evenly;
    }
    &_btn {
      border-radius: 17px;
      width: 378px;
    }
  }
}
</style>
