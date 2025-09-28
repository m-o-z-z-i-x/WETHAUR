import axios from "axios"

// create a common instance for external apis
export const http = axios.create({
  timeout: 10000,
})

// declare a request interceptor
http.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// declare a response interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message
      || error?.message
      || "network error"

    return Promise.reject(new Error(message))
  }
)

export default http