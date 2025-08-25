import { defineStore } from "pinia"
import http from "@/services/http.js"

export const useWeatherStore = defineStore("weather", {
  state: () => ({
    selectedCity: {
      name: "Казань",
      latitude: 55.7887,
      longitude: 49.1221,
      country: "RU"
    },
    loading: false,
    error: "",
    current: null,
    hourly: [],
    daily: [],
    popularCities: [
      {
        name: "Москва",
        latitude: 55.75222,
        longitude: 37.61556
      },
      {
        name: "Новосибирск",
        latitude: 55.03442,
        longitude: 82.94339
      },
      {
        name: "Краснодар",
        latitude: 45.04484,
        longitude: 38.97603
      },
      {
        name: "Красноярск",
        latitude: 56.01839,
        longitude: 92.86717
      },
      {
        name: "Тула",
        latitude: 54.2048,
        longitude: 37.618
      }
    ],
    popularData: {}
  }),
  actions: {
    clearError() {
      this.error = ""
    },
    async selectCity(city) {
      if (!city) return
      if (city.latitude && city.longitude) {
        this.selectedCity = city
        await this.fetchWeather()
      }
    },
    async fetchWeather() {
      // получаем текущую/почасовую/недельную погоду раздельно, чтобы снизить шанс таймаута
      this.loading = true
      this.error = ""

      try {
        const { latitude, longitude } = this.selectedCity
        const currentUrl = new URL("https://api.open-meteo.com/v1/forecast")

        currentUrl.searchParams.set("latitude", String(latitude))
        currentUrl.searchParams.set("longitude", String(longitude))

        // запрашиваем текущие показатели и почасовые данные
        currentUrl.searchParams.set("current", [
          "temperature_2m",
          "relative_humidity_2m",
          "wind_speed_10m",
          "weather_code",
        ].join(","))

        currentUrl.searchParams.set("hourly", [
          "temperature_2m",
          "relative_humidity_2m",
          "wind_speed_10m",
          "weather_code",
        ].join(","))

        currentUrl.searchParams.set("timezone", "auto")

        const dailyUrl = new URL("https://api.open-meteo.com/v1/forecast")

        dailyUrl.searchParams.set("latitude", String(latitude))
        dailyUrl.searchParams.set("longitude", String(longitude))

        // daily: совместимые имена показателей
        dailyUrl.searchParams.set("daily", [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_probability_max",
          "wind_speed_10m_max",
        ].join(","))

        dailyUrl.searchParams.set("timezone", "auto")
        dailyUrl.searchParams.set("forecast_days", "7")

        const [currentRes, dailyRes] = await Promise.all([
          http.get(currentUrl.toString()),
          http.get(dailyUrl.toString()),
        ])

        const cdata = currentRes.data
        const ddata = dailyRes.data
        const currentData = cdata?.current
        let humidityNow = null

        if (Array.isArray(cdata?.hourly?.time)) {
          const timeList = cdata.hourly.time
          const hList = cdata.hourly.relative_humidity_2m
          const targetTime = currentData?.time

          if (targetTime && Array.isArray(hList)) {
            const idx = timeList.findIndex((t) => t === targetTime)
            if (idx >= 0) humidityNow = hList[idx] ?? null
          }
        }

        this.current = {
          temperature: currentData?.temperature_2m ?? null,
          humidity: currentData?.relative_humidity_2m ?? humidityNow,
          wind: currentData?.wind_speed_10m ?? null,
          weatherCode: currentData?.weather_code ?? null,
          time: currentData?.time ?? null,
        }

        const hourly = []
        const len = (cdata?.hourly?.time || []).length

        for (let i = 0; i < len; i += 1) {
          hourly.push({
            time: cdata.hourly.time[i],
            temperature: cdata.hourly.temperature_2m?.[i],
            humidity: cdata.hourly.relative_humidity_2m?.[i],
            wind: cdata.hourly.wind_speed_10m?.[i],
            weatherCode: cdata.hourly.weather_code?.[i],
          })
        }

        this.hourly = hourly

        const daily = []
        const dlen = (ddata?.daily?.time || []).length

        for (let i = 0; i < dlen; i += 1) {
          daily.push({
            date: ddata.daily.time[i],
            tempMax: ddata.daily.temperature_2m_max?.[i],
            tempMin: ddata.daily.temperature_2m_min?.[i],
            precipProb: ddata.daily.precipitation_probability_max?.[i],
            windMax: ddata.daily.wind_speed_10m_max?.[i],
            weatherCode: ddata.daily.weather_code?.[i],
          })
        }

        this.daily = daily
      } catch (e) {
        this.error = `Ошибка загрузки погоды: ${e?.message || "Неизвестная ошибка"}`
      } finally {
        this.loading = false
      }
    },
    async fetchPopularCities() {
      const results = {}
      const concurrency = 2

      for (let i = 0; i < this.popularCities.length; i += concurrency) {
        const chunk = this.popularCities.slice(i, i + concurrency)

        await Promise.all(chunk.map(async (city) => {
          try {
            const url = new URL("https://api.open-meteo.com/v1/forecast")

            url.searchParams.set("latitude", String(city.latitude))
            url.searchParams.set("longitude", String(city.longitude))

            url.searchParams.set("current", [
              "temperature_2m",
              "relative_humidity_2m",
              "wind_speed_10m",
              "weather_code",
            ].join(","))

            url.searchParams.set("hourly", ["relative_humidity_2m"].join(","))
            url.searchParams.set("timezone", "auto")

            const { data } = await http.get(url.toString())
            let humidity = data?.current?.relative_humidity_2m ?? null
            const t = data?.current?.time

            if (humidity == null && t && Array.isArray(data?.hourly?.time) && Array.isArray(data?.hourly?.relative_humidity_2m)) {
              const idx = data.hourly.time.findIndex((x) => x === t)
              if (idx >= 0) humidity = data.hourly.relative_humidity_2m[idx] ?? null
            }

            results[city.name] = {
              name: city.name,
              temperature: data?.current?.temperature_2m ?? null,
              humidity,
              wind: data?.current?.wind_speed_10m ?? null,
              weatherCode: data?.current?.weather_code ?? null,
            }
          } catch {
            // ...
          }
        }))
      }

      this.popularData = results
    }
  }
})

export default useWeatherStore