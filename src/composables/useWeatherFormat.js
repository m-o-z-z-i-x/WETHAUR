export const formatDateFull = (iso) => {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" }).format(d)
  } catch {
    return ""
  }
}

export const formatHour = (iso) => {
  try {
    return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso))
  } catch {
    return ""
  }
}

export const formatWeekday = (iso) => {
  try {
    return new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(new Date(iso))
  } catch {
    return ""
  }
}

export const partOfDay = (iso) => {
  try {
    const h = new Date(iso).getHours()

    if (h < 6) return "ночь"
    if (h < 12) return "утро"
    if (h < 18) return "день"

    return "вечер"
  } catch {
    return ""
  }
}

// Centralized, simplified weather mapping limited to available icons
// Categories: sun, cloud, rain, snow, fog, wind
import sunIcon from "@/assets/icons/sun.svg"
import cloudIcon from "@/assets/icons/cloud.svg"
import rainIcon from "@/assets/icons/rain.svg"
import snowIcon from "@/assets/icons/snow.svg"
import fogIcon from "@/assets/icons/fog.svg"
import windIcon from "@/assets/icons/wind.svg"

export const iconByCategory = {
  sun: sunIcon,
  cloud: cloudIcon,
  rain: rainIcon,
  snow: snowIcon,
  fog: fogIcon,
  wind: windIcon,
}

export const getWeatherCategory = (code, wind) => {
  if (code == null) return "cloud"

  if (typeof wind === "number" && wind >= 10) return "wind"

  // Open-Meteo weather codes simplified to available icon categories
  if ([45, 48].includes(code)) return "fog"
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow"
  if ([0].includes(code)) return "sun"
  if ([1, 2, 3].includes(code)) return "cloud"

  // Everything else (drizzle, rain, freezing rain, thunderstorm, mixed) -> rain
  return "rain"
}

export const pickWeatherIcon = (code, wind) => {
  const category = getWeatherCategory(code, wind)
  return iconByCategory[category]
}

export const describeCode = (code, wind) => {
  const category = getWeatherCategory(code, wind)

  if (category === "wind") return "ветренно"
  if (category === "sun") return "солнечно"
  if (category === "cloud") return "облачно"
  if (category === "fog") return "туман"
  if (category === "snow") return "снег"
  // category === "rain"
  return "дождь"
}