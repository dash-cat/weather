<template>
  pogoda
</template>

<script setup>
//@ts-check
import { getForecastForCity } from './api'

getForecastForCity('Novosibirsk')
</script>