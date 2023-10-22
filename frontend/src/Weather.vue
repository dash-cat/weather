<template>
  <div>
    <input
      v-model="search" class='search' placeholder="Введите город" @change="sendCity()">
  </div>
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
const keyPictures = '99bXOB5nLWQAFrPdJMHIa0cAESPAS82kzxFWus6fFZU'
const API_VISUALCROSSING_KEY = 'MNRJMCUCWFDGV6DP3G4R6FRZM'
const searchHistory = []


{
  (async () => {
    weatherArray.value = await getForecastForCity('Novosibirsk')
  })()
}

/**
* @param {String} [city]
*/
function addItemForHistory(city) {
  const history = searchHistory.push(city)
  localStorage.setItem("SearchHistory", JSON.stringify(history));
}

/**
 * @returns {Promise<Object>}
 */
async function sendCity() {
  weatherArray.value = await getForecastForCity(search.value)
  if (!localStorage.searchHistory) {
    addItemForHistory(search.value)
  } else {
    const historyViews = localStorage.getItem("SearchHistory");
    const array = JSON.parse(`${historyViews}`).push(search.value)
    addItemForHistory(array)
    console.log('array', array)
  }
}


async function getPictures() {
  const pict = await(await fetch(`https://api.unsplash.com/photos/random?client_id=${keyPictures}`))
    .json()
  return pict.urls.full

}
 
async function getForecastOnWeekForCity() {
  const pict = await(await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date1]/[date2]?key=${API_VISUALCROSSING_KEY}`))
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

.search {
  width: 232px;
  position: absolute;
  bottom: 40px;
  right: 33%;
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