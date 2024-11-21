import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import CheckinDetail from '../views/CheckinDetail.vue'
import PianoCheckin from '../views/PianoCheckin.vue'
import RunningCheckin from '../views/RunningCheckin.vue'
import BibleCheckin from '../views/BibleCheckin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/checkin-detail',
      name: 'CheckinDetail',
      component: CheckinDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/piano-checkin',
      name: 'PianoCheckin',
      component: PianoCheckin,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/running-checkin',
      name: 'RunningCheckin',
      component: RunningCheckin,
      meta: { requiresAuth: true }
    },
    {
      path: '/bible-checkin',
      name: 'BibleCheckin',
      component: BibleCheckin,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn()) {
    next('/login')
  } else {
    next()
  }
})

export default router
