import axios from "axios"

// создаем общий инстанс для внешних api
export const http = axios.create({
  timeout: 10000,
})

// объявляем перехватчик запросов
http.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// объявляем перехватчик ответов
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message
      || error?.message
      || "ошибка сети"

    return Promise.reject(new Error(message))
  }
)

export default http