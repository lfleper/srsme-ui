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
    redirect: '/dashboard/documents',
    component: Dashboard,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'logout',
        component: () => import('@/views/Logout.vue')
      },
      {
        path: 'documents',
        component: () => import('@/views/dashboard/DocumentOverview.vue')
      },
      {
        path: 'account',
        component: () => import('@/views/dashboard/AccountSettings.vue')
      },
      {
        path: 'editor/:id',
        name: 'Editor',
        component: () => import('@/views/dashboard/DocumentEditor.vue'),
        children: [
          {
            path: 'chapter/:chapterId',
            name: 'Chapter',
            component: () => import('@/components/Editor.vue')
          }
        ]
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
