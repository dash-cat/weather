<template>
  <div>
    <input
      v-model="search" class='search' placeholder="Введите город" @change="sendCity(search)">
  </div>
  <div :style="{'background-image': `url(${backgroundImage})`}" class="container">
    <div class="forecast" v-for="city in cities">
      <div class="favorite">
        <Button @click="addToFavorites(city.name)" :msg="'Добавить в избранное'"></Button>
        <Button @click="deleteCity(city.name)" :msg="'Удалить из избранного'"></Button>
        <Button @click="city.weather = showForecast(city.weather)" :msg="'Прогноз погоды на 5 дней'"></Button>
      </div>
      <div class="item" v-for="item in city.weather">
        <div class="city">{{ item.name }}</div>
        <div class="date">{{ new Date().toLocaleString("en-US", { hour12: false }) }}</div>
        <div>
          <div>
            <span>Температура: </span>{{ item.main.temp }} °C
          </div>
          <div>
            <div>
              <span>Скорость ветра: </span>{{ item.wind.speed }} м/с
            </div>
            <div>{{ item.weather[0].description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//@ts-check
import { getForecastForCity } from './api'
import Button from './components/Button.vue'
import { ref, onMounted } from 'vue'


/** @type {import('vue').Ref<any>} */



const cities = ref([])
const search = ref('')
const backgroundImage = ref('')


{
  (async () => {
    cities.value.push({name: 'Novosibirsk', weather: await getForecastForCity('Novosibirsk')})
  })()
}

function showForecast(weather) {
  return weather.slice(0, 5)
}

function addToFavorites(city) {
  const favoriteCities = localStorage.getItem("favoriteCities")
  if (!history) {
    localStorage.setItem("favoriteCities", JSON.stringify([city]));
    return;
  } else {
    const historyViews = JSON.parse(favoriteCities || '[]');
    if (historyViews.includes(city)) {
      return
    } else {
      historyViews.push(city)
      localStorage.setItem("favoriteCities", JSON.stringify(historyViews));
      console.log('historyViews', historyViews);
    }
  }
}

function deleteCity(city) {
  const favoriteCities = localStorage.getItem("favoriteCities")
  if (!history) {
    alert('Список избранных городов пуст')
    return;
  } else {
    const historyViews = JSON.parse(favoriteCities || '[]').slice();
    if (historyViews.includes(city)) {
      const filteredArray = historyViews.filter(element => city !== element)
      localStorage.setItem("favoriteCities", JSON.stringify(filteredArray));
    }
  }
}
/**
 * @returns {Promise<Object>}
 */
async function sendCity(city) {
  try {
    const weather = await getForecastForCity(city)
    cities.value.push({name: city, weather})
    // document.cookie = JSON.stringify(counter++) 
    // alert(document.cookie)
    // console.log(weather)
  } catch (error) {
    alert('Город не найден')
  }

  
  
}

function getCityOfLocalStorage() {
  const cities =  JSON.parse(localStorage.getItem("favoriteCities") || '[]')
  for(let i = 0; i < cities.length; i++) {
    sendCity(cities[i])
  }
}

onMounted(async() => {
  backgroundImage.value = await getPictures()
  getCityOfLocalStorage()
})

</script>

<script>
const keyPictures = '99bXOB5nLWQAFrPdJMHIa0cAESPAS82kzxFWus6fFZU'
export async function getPictures() {
  const pict = await(await fetch(`https://api.unsplash.com/photos/random?client_id=${keyPictures}`))
    .json()
  return pict.urls.full

}
</script>

<style scoped>
.forecast{
  display: flex;
  justify-content: space-evenly;
  margin: 30px;
  color: black;
  margin-right: 81px;
  gap:5px
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
  background: rgb(177 222 231 / 70%);
  border-radius: 6px;
  font-size: 12px;
}

.city {
  font-weight: 500;
  font-size: 15px;
}
</style>