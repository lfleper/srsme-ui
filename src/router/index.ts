import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Registration from '@/views/Registration.vue'
import Dashboard from '@/views/Dashboard.vue'
import { TokenService } from '@/services/TokenService'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      authPossible: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Registration
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'logout',
        component: () => import('@/views/Logout.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const tokenService = new TokenService()
  const isAuthenticated = tokenService.isAuthenticated()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({name: 'Home'})
    } else {
      next()
    }
  } else {
    if (isAuthenticated && to.matched.some(record => record.meta.authPossible)) {
      next({name: 'Dashboard'})
    } else {
      next()
    }
  }
})

export default router
