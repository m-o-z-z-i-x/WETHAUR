## About the Project

This is a web application for viewing the current weather, hourly forecast, and 7-day forecast for a selected city. The project demonstrates working with Vue 3, Pinia, Vue Router, and Axios, integration with external APIs, responsive UI, skeleton loaders, and animations

> [!NOTE]
> Data source - Open-Meteo Forecast API. The forecast is requested separately: current/hourly weather and 7-day forecast.

## Demo

<img src="public/assets/webp/demo.webp">

## Technologies

- **Vue.js 3** - UI (Composition API)
- **Vite** - project build
- **Pinia** - state management
- **Vue Router** - routing
- **Axios** - HTTP client
- **Open-Meteo API** - forecast data

## Main Features

1. **City selection**
   - Quick selection from a list of popular cities
2. **Current and hourly weather**
   - Temperature, humidity, wind, status icons
   - Compact hourly forecast feed (3-hour step)
3. **7-day forecast**
   - Daily summary: max/min temperature, icon, and brief description
   - Switching between "Main" and "Week's weather" tabs

## Technical Features

- SPA on Vue 3 (Composition API)
- Routes: `/` (current and hourly), `/week` (7 days)
- Build with Vite, alias `@` for `src`
- Pinia store: separate requests for current/hourly and daily
- Centralized Axios client: 10s timeout, interceptors, error normalization
- Responsive layout, skeleton loaders, animations

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```