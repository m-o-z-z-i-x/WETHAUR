<script setup>
  import { computed, watch, onMounted, onUnmounted } from "vue"
  import { useRoute } from "vue-router"
  import { useWeatherStore } from "@/stores/weather.js"
  import CitySelect from "@/components/CitySelect.vue"
  import ErrorOverlay from "@/components/ErrorOverlay.vue"

  const route = useRoute()
  const weather = useWeatherStore()
  const isHome = computed(() => route.name === "home")
  const isWeek = computed(() => route.name === "week")
  let stopLoadingWatch = null

  const applyScrollLock = (locked) => {
    const prev = document.body.style.overflow

    if (locked) {
      if (!document.body.dataset.prevOverflow) {
        document.body.dataset.prevOverflow = prev
      }

      document.body.style.overflow = "hidden"
    } else {
      const prevSaved = document.body.dataset.prevOverflow || ""
      document.body.style.overflow = prevSaved

      delete document.body.dataset.prevOverflow
    }
  }

  onMounted(() => {
    applyScrollLock(weather.loading)
    stopLoadingWatch = watch(() => weather.loading, (v) => applyScrollLock(v))
  })

  onUnmounted(() => {
    if (stopLoadingWatch) stopLoadingWatch()

    const prevSaved = document.body.dataset.prevOverflow || ""
    document.body.style.overflow = prevSaved

    delete document.body.dataset.prevOverflow
  })
</script>

<template>
  <div class="container layout">
    <div class="layout__top">
      <ul class="tabs tabs__list">
        <li class="tabs__item">
          <RouterLink class="tabs__link" :class="{ active: isHome }" to="/">Главная</RouterLink>
        </li>
        <li class="tabs__item">
          <RouterLink class="tabs__link" :class="{ active: isWeek }" to="/week">Погода за неделю</RouterLink>
        </li>
      </ul>

      <div class="layout__actions">
        <CitySelect />
      </div>
    </div>

    <slot />

    <div v-if="weather.loading" class="loading-overlay">
      <div class="spinner" role="status" aria-label="загрузка"></div>
    </div>

    <ErrorOverlay
      v-if="weather.error"
      :message="weather.error"
      title="ошибка загрузки"
    />
  </div>
</template>