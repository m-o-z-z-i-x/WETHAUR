<script setup>
  import { onMounted, computed } from "vue"
  import { useWeatherStore } from "@/stores/weather.js"
  import WeatherLayout from "@/layouts/WeatherLayout.vue"
  import PopularCities from "@/components/PopularCities.vue"
  import { formatDateFull, formatHour, partOfDay, describeCode, pickWeatherIcon } from "@/composables/useWeatherFormat.js"

  const weather = useWeatherStore()

  onMounted(async () => {
    if (!weather.current) await weather.fetchWeather()
    if (!Object.keys(weather.popularData).length) await weather.fetchPopularCities()
  })

  const cityName = computed(() => weather.selectedCity?.name || "")
  const todayStr = computed(() => weather.current?.time ? formatDateFull(weather.current.time) : "")
  const nextHours = computed(() => {
    if (!Array.isArray(weather.hourly) || !weather.current?.time) return []

    const currentDate = new Date(weather.current.time)
    const y = currentDate.getFullYear()
    const m = currentDate.getMonth()
    const d = currentDate.getDate()

    const today = weather.hourly.filter((h) => {
      const dt = new Date(h.time)
      return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d
    })

    return today.filter((h) => {
      const hour = new Date(h.time).getHours()
      return hour % 3 === 0 && hour <= 21
    })
  })
</script>

<template>
  <WeatherLayout>
    <div class="main">
      <div>
        <header class="main__header">
          <h1 class="main__title">Погода в городе {{ cityName }}</h1>
          <p class="main__date">{{ todayStr }}</p>
        </header>

        <div class="main__panel">
          <div class="main__panel-body">
            <div class="main__row">
              <div class="main__left">
                <div class="main__icon-wrap">
                  <img :src="pickWeatherIcon(weather.current?.weatherCode, weather.current?.wind)" :alt="describeCode(weather.current?.weatherCode, weather.current?.wind)" class="main__icon-cloud" />
                </div>

                <div class="main__temp">{{ Math.round(weather.current?.temperature ?? 0) }}°</div>

                <div class="main__right">
                  <div class="main__info capitalize">{{ describeCode(weather.current?.weatherCode, weather.current?.wind) }}</div>
                  <div class="main__info">Влажность: {{ weather.current?.humidity ?? "–" }} %</div>
                  <div class="main__info">Ветер: {{ weather.current?.wind ?? "–" }} м/с</div>
                </div>
              </div>

              <div class="hourly-compact anim-fade">
                <div v-if="!nextHours.length" class="hourly-compact__row">
                  <div class="time-wrap"><div class="sk-line skeleton" style="height:18px"></div><div class="sk-line skeleton" style="height:18px"></div></div>
                  <div class="hourly-compact__temp"><div class="sk-line-lg skeleton"></div></div>
                  <div class="hourly-compact__desc"><div class="sk-circle skeleton"></div><div class="sk-line skeleton" style="width:80px"></div></div>
                  <div class="hourly-compact__wind"><div class="sk-line skeleton"></div></div>
                  <div class="hourly-compact__hum"><div class="sk-line skeleton"></div></div>
                </div>

                <div v-for="h in nextHours" :key="h.time" class="hourly-compact__row">
                  <div class="time-wrap">
                    <div class="time-wrap__time">{{ formatHour(h.time) }}</div>
                    <div class="time-wrap__part">{{ partOfDay(h.time) }}</div>
                  </div>

                  <div class="hourly-compact__temp">{{ Math.round(h.temperature) }}°</div>

                  <div class="hourly-compact__desc">
                    <img :src="pickWeatherIcon(h.weatherCode, h.wind)" :alt="describeCode(h.weatherCode, h.wind)" width="42" height="42" />
                    <div class="hourly-compact__desc-text">{{ describeCode(h.weatherCode, h.wind) }}</div>
                  </div>

                  <div class="hourly-compact__wind">{{ Math.round(h.wind ?? 0) }} м/с</div>
                  <div class="hourly-compact__hum">{{ Math.round(h.humidity ?? 0) }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PopularCities />
      </div>

      <div class="main__spacer"></div>
    </div>
  </WeatherLayout>
</template>