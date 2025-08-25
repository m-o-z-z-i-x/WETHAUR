import { createRouter, createWebHistory } from "vue-router"

const MainView = () => import("@/views/MainView.vue")
const WeekView = () => import("@/views/WeekView.vue")

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainView
    },
    {
      path: "/week",
      name: "week",
      component: WeekView
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/"
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router