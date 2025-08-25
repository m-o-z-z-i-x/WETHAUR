<script setup>
  import { onMounted, computed } from "vue"
  import { useWeatherStore } from "@/stores/weather.js"
  import WeatherLayout from "@/layouts/WeatherLayout.vue"
  import PopularCities from "@/components/PopularCities.vue"
  import { formatDateFull, formatWeekday, describeCode, pickWeatherIcon } from "@/composables/useWeatherFormat.js"

  const weather = useWeatherStore()

  // первичная загрузка недельного прогноза и популярных городов
  onMounted(async () => {
    if (!weather.daily.length) await weather.fetchWeather()
    if (!Object.keys(weather.popularData).length) await weather.fetchPopularCities()
  })

  const cityName = computed(() => weather.selectedCity?.name || "")
  const todayStr = computed(() => weather.current?.time ? formatDateFull(weather.current.time) : "")
</script>

<template>
  <WeatherLayout>
    <header class="week__header">
      <h1 class="week__title">Погода в городе {{ cityName }}</h1>
      <p class="week__subtitle">{{ todayStr }}</p>
    </header>

    <div class="week__days">
      <div v-if="!weather.daily.length" class="week__day anim-up">
        <div class="week__weekday"><div class="sk-line skeleton" style="width:110px"></div></div>
        <div class="sk-circle skeleton"></div>

        <p class="week__tmax"><span class="sk-line skeleton" style="width:40px"></span></p>
        <p class="week__desc"><span class="sk-line skeleton" style="width:80px"></span></p>
      </div>

      <div v-for="d in weather.daily" :key="d.date" class="week__day anim-up">
        <div class="week__weekday">{{ formatWeekday(d.date) }}</div>

        <img :src="pickWeatherIcon(d.weatherCode, d.windMax)" :alt="describeCode(d.weatherCode, d.windMax)" width="50" height="50" />

        <p class="week__tmax">{{ Math.round(d.tempMax ?? 0) }}°</p>
      </div>
    </div>

    <PopularCities />
  </WeatherLayout>
</template>