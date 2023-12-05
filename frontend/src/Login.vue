<template>
  <header>
  </header>
  <main>
    <div :style="{'background-image': `url(${backgroundImage})`}" class="container">
      <div class="auth">
        <div class="header">{{ checkbox ? 'Регистрация' : 'Вход' }}</div>
        <div class="input-auth">
          <label for="login">Логин</label>
          <input id="login" type="text" v-model="login">
        </div>
        <div class="input-auth">
          <label for="login">Пароль</label>
          <input id="password" type="password" v-model="password">
        </div>
        <div class="input-auth">
          <input id="create-new-user" type="checkbox" v-model="checkbox">
          <label for="create-new-user">Создать нового пользователя</label>
        </div>
        <button  class="btn" @click="onClick">Войти</button>
        <div class="description">{{ description }}</div>
      </div>
    </div>
  </main>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { signIn } from './api'
import { getPictures } from './Weather.vue'

const login = ref('')
const password = ref('')
const checkbox = ref(false)
const backgroundImage = ref('')

function onClick() {
  signIn(login.value, password.value, checkbox.value)
}

onMounted(async() => {
  backgroundImage.value = await getPictures()
  getCityOfLocalStorage()
})

</script>

<style scoped>
.header {
  margin: 5px;
  font-size: 20px;
}
main {
    display: flex;
    width: 100%;
    justify-content: space-around;
}
.description {
  margin: 12px;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.auth {
  height: 300px;
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
}

.input-auth {
  width: 100%;
  gap: 20px;
  display: flex;
  justify-content: center;
  height: 27px;
  border-radius: 5px;
}

.btn {
  background-color: cornflowerblue;
  width: 200px;
  height: 30px;
  border-radius: 20px;
  color: beige;
}
</style>
