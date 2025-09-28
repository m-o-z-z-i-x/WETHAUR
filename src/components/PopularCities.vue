<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from "vue"
  import { useWeatherStore } from "@/stores/weather.js"
  import { describeCode, pickWeatherIcon } from "@/composables/useWeatherFormat.js"

  const weather = useWeatherStore()
  const isMobile = ref(false)
  let mql = null

  const updateIsMobile = () => {
    isMobile.value = !!mql?.matches
  }

  onMounted(() => {
    mql = window.matchMedia("(max-width: 576px)")

    updateIsMobile()
    mql.addEventListener("change", updateIsMobile)
  })

  onBeforeUnmount(() => {
    mql?.removeEventListener("change", updateIsMobile)
  })

  const slides = computed(() => {
    const list = Array.isArray(weather.popularCities) ? weather.popularCities : []
    const result = []

    for (let i = 0; i < list.length; i += 2) {
      result.push(list.slice(i, i + 2))
    }

    return result
  })
</script>

<template>
  <section class="popular">
    <div class="popular__header">
      <h2 class="popular__title">Weather in popular cities</h2>

      <button type="button" class="icon-button">
        <img src="@/assets/icons/info.svg" alt="info">
      </button>
    </div>

    <div class="popular__cities" v-show="!isMobile">
      <div v-for="c in weather.popularCities" :key="c.name" class="popular__col">
        <div v-if="!weather.popularData[c.name]" class="w-card w-card--theme anim-up popular__card">
          <div class="popular__card-body">
            <div class="popular__card-header">
              <div class="sk-line-lg skeleton" style="width:120px"></div>
              <div class="sk-line skeleton" style="width:80px"></div>
            </div>

            <div class="sk-circle skeleton"></div>
            <div class="sk-line-lg skeleton" style="width:80px"></div>
            <div class="sk-line skeleton" style="width:120px"></div>
          </div>
        </div>

        <div v-else class="w-card w-card--theme anim-up popular__card" role="button" @click="weather.selectCity(c)">
          <div class="popular__card-body">
            <div class="popular__card-header">
              <h3 class="popular__city">{{ c.name }}</h3>
              <p class="popular__desc">{{ describeCode(weather.popularData[c.name]?.weatherCode, weather.popularData[c.name]?.wind) }}</p>
            </div>

            <img :src="pickWeatherIcon(weather.popularData[c.name]?.weatherCode, weather.popularData[c.name]?.wind)" :alt="describeCode(weather.popularData[c.name]?.weatherCode, weather.popularData[c.name]?.wind)" width="60" height="60" />

            <p class="popular__temp">{{ Math.round(weather.popularData[c.name]?.temperature ?? 0) }}°</p>
            <p class="popular__extra">humidity: {{ weather.popularData[c.name]?.humidity ?? "–" }}%</p>
          </div>
        </div>
      </div>
    </div>

    <div class="popular__slider" v-show="isMobile">
      <div v-for="(pair, i) in slides" :key="i" class="popular__slide">
        <div v-for="c in pair" :key="c.name" class="popular__col">
          <div v-if="!weather.popularData[c.name]" class="w-card w-card--theme anim-up popular__card">
            <div class="popular__card-body">
              <div class="popular__card-header">
                <div class="sk-line-lg skeleton" style="width:120px"></div>
                <div class="sk-line skeleton" style="width:80px"></div>
              </div>

              <div class="sk-circle skeleton"></div>
              <div class="sk-line-lg skeleton" style="width:80px"></div>
              <div class="sk-line skeleton" style="width:120px"></div>
            </div>
          </div>

          <div v-else class="w-card w-card--theme anim-up popular__card" role="button" @click="weather.selectCity(c)">
            <div class="popular__card-body">
              <div class="popular__card-header">
                <h3 class="popular__city">{{ c.name }}</h3>
                <p class="popular__desc">{{ describeCode(weather.popularData[c.name]?.weatherCode, weather.popularData[c.name]?.wind) }}</p>
              </div>

              <img :src="pickWeatherIcon(weather.popularData[c.name]?.weatherCode, weather.popularData[c.name]?.wind)" :alt="describeCode(weather.popularData[c.name]?.weatherCode, weather.popularData[c.name]?.wind)" width="60" height="60" />

              <p class="popular__temp">{{ Math.round(weather.popularData[c.name]?.temperature ?? 0) }}°</p>
              <p class="popular__extra">humidity: {{ weather.popularData[c.name]?.humidity ?? "–" }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>