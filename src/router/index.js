import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

import { useAuthStore } from 'src/stores/auth'

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Global Navigation Guard
  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    // 1. Ensure Auth is initialized
    if (!authStore.user && !authStore.loading) {
        await authStore.initialize()
    }

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const allowedRoles = to.meta.roles || []

    // 2. Not Logged In -> Redirect to Login
    if (requiresAuth && !authStore.user) {
        next('/login')
        return
    }

    // 3. Logged In -> Check Roles
    if (requiresAuth && authStore.user) {
        const userRole = authStore.profile?.role
        
        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
            // Unauthorized -> Send them to their respective home
            if (userRole === 'student') next('/student')
            else if (userRole === 'teacher') next('/teacher')
            else next('/dashboard')
            return
        }
    }

    // 4. Redirect logged in users away from Login/Register
    if (authStore.user && (to.path === '/login' || to.path === '/register')) {
        const userRole = authStore.profile?.role
        if (userRole === 'student') next('/student')
        else if (userRole === 'teacher') next('/teacher')
        else next('/dashboard')
        return
    }

    next()
  })

  return Router
})
