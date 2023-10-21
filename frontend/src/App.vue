<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <div>
      <label for="login">Логин</label>
      <input id="login" type="text" v-model="login">
    </div>
    <div>
      <label for="login">Пароль</label>
      <input id="password" type="password" v-model="password">
    </div>
    <div>
      <input id="create-new-user" type="checkbox" v-model="checkbox">
      <label for="create-new-user">Создать нового пользователя</label>
    </div>
    <button @click="onClick">Войти</button>
  </main>
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue'

import { ref, reactive } from 'vue'
import { signIn } from './api'

const login = ref('')
const password = ref('')
const checkbox = ref(false)

function onClick() {
  signIn(login.value, password.value, checkbox.value)
}

</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
