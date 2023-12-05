<template>
  <header>
  </header>
    <main>
      <div class="container">
        <div class="auth">
         <div class="auth__header">{{ checkbox ? 'Регистрация' : 'Вход' }}</div>
         <div class="auth__form">
            <div class="auth__input">
            <label for="login">Логин&nbsp;&nbsp;&nbsp;</label>
            <input id="login" type="text" v-model="login">
            </div>
            <div class="auth__input">
              <label for="auth__input__password">Пароль&nbsp;</label>
              <input id="auth__input__password" type="password" v-model="password">
            </div>
            <div class="auth__input">
              <input id="auth__input__login" type="checkbox" v-model="checkbox">&nbsp;
              <label for="auth__input__login">Создать нового пользователя*</label>
            </div>
          </div>
        <button class="auth__btn" @click="onClick">Войти</button>
        <div class="description">{{ description }}</div>
      </div>
    </div>
  </main>
</template>

<script setup>

import { ref } from 'vue'
import { signIn } from '../api'

const login = ref('')
const password = ref('')
const checkbox = ref(false)
const description = '*После регистрации вам будет доступно добавление блюд в меню'

function onClick () {
  signIn(login.value, password.value, checkbox.value)
}
</script>

<style scoped lang="scss">
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
}
.auth {
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
  .auth__header {
    margin-top: 30px;
    font-size: 20px;
  }
  .auth__form {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: space-evenly;
  }
  .auth__btn {
    border-radius: 17px;
    width: 378px;
  }
}

</style>
