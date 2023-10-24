<template>
  <header>
  </header>
  <main>
    <div :style="{'background-image': `url(${backgroundImage})`}" class="container">
      <div class="auth">
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
        <button @click="onClick">Войти</button>
        <div class="description">{{ description }}</div>
      </div>
    </div>
  </main>
</template>

<script setup>

import { ref, reactive, onMounted } from 'vue'
import { signIn } from './api'
import { getPictures } from './Weather.vue'

const login = ref('')
const password = ref('')
const checkbox = ref(false)
const backgroundImage = ref('')
const description = 'После бесплатной успешной регистрации, вам будет доступен неограниченный доступ к приложению'

function onClick() {
  signIn(login.value, password.value, checkbox.value)
}

onMounted(async() => {
  backgroundImage.value = await getPictures()
  getCityOfLocalStorage()
})

</script>

<style scoped>
header {
  line-height: 1.5;
}
main {
    display: flex;
    width: 100%;
    justify-content: space-around;
}
.description {

}

.container {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.auth {
  height: 266px;
  display: flex;
  width: 500px;
  flex-direction: column;
  align-items: center;
  gap: 15px;
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
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
