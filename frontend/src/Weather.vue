<template>
  <div :style="{'background-image': `url(${backgroundImage})`}" class="container">
    <div class="forecast">
      <div class="item" v-for="item in weatherArray">
        {{ item.weather[0].main }} Город
        <div>
          <div>
            Температура
          </div>
          <div>
            <div>Ветер</div>
            <div>Остадки</div>
          </div>
        </div>
      </div>
      <div>
        <input
        v-model="search" placeholder="Введите город" @change="sendCity()">
      </div>
    </div>
  </div>
</template>

<script setup>
//@ts-check
import { getForecastForCity } from './api'
import { ref, onMounted } from 'vue'

/** @type {import('vue').Ref<any>} */
const weatherArray = ref([])
const search = ref('')
const backgroundImage = ref('')

{
  (async () => {
    weatherArray.value = await getForecastForCity('Novosibirsk')
  })()
}
/**
 * @returns {Promise<Object>}
 */
async function sendCity() {
  weatherArray.value = await getForecastForCity(search.value)
}

const keyPictures = '99bXOB5nLWQAFrPdJMHIa0cAESPAS82kzxFWus6fFZU'

async function getPictures() {
  const pict = await(await fetch(`https://api.unsplash.com/photos/random?client_id=${keyPictures}`))
    .json()
  return pict.urls.full

}
onMounted(async() => {
  const pict = await getPictures()
  console.log('pict',pict)
  backgroundImage.value = pict
})

</script>

<style scoped>
.forecast{
  display: flex;
  justify-content: space-evenly;
}

.item {
  width: 100%;
  height: 170px;
  border: 1px solid gray;
}

.container {
  height: 100vh;
  width: 100vw;
  background-size: cover;
}
</style>