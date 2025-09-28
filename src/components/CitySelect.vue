<script setup>
  import { ref, onMounted, onUnmounted } from "vue"
  import { useWeatherStore } from "@/stores/weather.js"

  const weather = useWeatherStore()
  const open = ref(false)

  const onPick = async (place) => {
    open.value = false
    await weather.selectCity(place)
  }

  const root = ref(null)

  const onDocClick = (e) => {
    if (!root.value) return
    if (!root.value.contains(e.target)) open.value = false
  }

  onMounted(() => document.addEventListener("click", onDocClick))
  onUnmounted(() => document.removeEventListener("click", onDocClick))
</script>

<template>
  <div class="city-select" ref="root">
    <button class="city-select__button" type="button" :aria-expanded="open ? 'true' : 'false'" @click="open = !open" :class="{ 'city-select__caret--up': open }">
      <span>{{ weather.selectedCity?.name }}</span>
      <img class="city-select__caret-icon" src="@/assets/icons/arrow-down.svg" alt="arrow" />
    </button>

    <div class="city-select__menu anim-up" v-show="open">
      <div class="city-select__options">
        <button v-for="c in weather.popularCities" :key="`pop-${c.name}`" type="button" class="city-select__option" @click="onPick(c)">
          {{ c.name }}
        </button>
      </div>
    </div>
  </div>
</template>