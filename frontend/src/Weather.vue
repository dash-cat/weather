<template>
  <div class="auth">
    <a href="/login.html">Войти</a>
  </div>
  <div class="search-container">
    <input
      v-model="search" class='search' placeholder="Введите город" @change="sendCity(search)">
  </div>
  <div :style="{'background-image': `url(${backgroundImage})`}" class="container">
    <div class="forecast" v-for="city in cities">
      <div class="favorite">
        <Button v-show="!isFavorite(city.name)" @click="addToFavorites(city.name)" :msg="'Добавить в избранное'"></Button>
        <Button v-show="isFavorite(city.name)" @click="deleteCity(city.name)" :msg="'Удалить из избранного'"></Button>
        <Button @click="city.weather = showForecast(city.weather)" :msg="'Прогноз погоды на 5 дней'"></Button>
      </div>
      <div class="item" v-for="item in city.weather">
        <div class="city">{{ item.name }}</div>
        <div class="date">{{ new Date().getMonth() + 1 }}/{{ new Date().getDate() }}</div>
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
import { ref, onMounted, nextTick} from 'vue'


/** @type {import('vue').Ref<any>} */



const cities = ref([])
const search = ref('')
const backgroundImage = ref('')


{
  setTimeout(() => (async () => {
    cities.value.push({name: 'Novosibirsk', weather: await getForecastForCity('Novosibirsk')})
  })(), 100)
  
}

function showForecast(weather) {
  return weather.slice(0, 5)
}

function isFavorite(city) {
  let isHasValue = false
  const allFavoriteCities = JSON.parse(localStorage.getItem("favoriteCities") || '[]')
  for (let i = 0; i < allFavoriteCities.length; i++) {
    if (allFavoriteCities[i] === city) {
      isHasValue = true
    }
  }
  return isHasValue
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
  if (!city.length) return
  try {
    const weather = await getForecastForCity(city)
    cities.value.push({name: city, weather})
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
const KEY_PICTURES = '99bXOB5nLWQAFrPdJMHIa0cAESPAS82kzxFWus6fFZU'

export async function getPictures() {
  const pict = await(await fetch(`https://api.unsplash.com/photos/random?client_id=${KEY_PICTURES}`))
    .json()
  return pict.urls.full

}
</script>

<style scoped>
.auth {
  position: absolute;
  width: 150px;
  height: 60px;
  background: aqua;
  color: #000;
  border-radius: 15px;
  text-align: center;
  z-index: 1;
  right: 0;
  cursor: pointer;
  margin: 5px;
}

a {
  text-decoration: none;
  color: white;
  transition: .4s;
  font-size: 30px;
}
.forecast{
  display: flex;
  margin: 30px;
  color: black;
  margin-right: 81px;
  gap:5px
}

.search {
  width: 232px;
  position: fixed;
  bottom: 40px;
  right: 35%;
  text-align: center;
}
.item {
  width: 100%;
  height: 170px;
  border: 1px solid gray;
  background: rgb(177 222 231 / 70%);
  border-radius: 6px;
  font-size: 12px;
}
.search-container {
  display: flex;
}

.city {
  font-weight: 500;
  font-size: 15px;
}
</style>