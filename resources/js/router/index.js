import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../pages/LoginPage.vue'),
        meta: { guest: true }
    },
    {
        path: '/',
        name: 'todos',
        component: () => import('../pages/TodosPage.vue'),
        meta: { requiresAuth: true }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Try to fetch user if not loaded yet
    if (!authStore.user && !authStore.loading) {
        await authStore.fetchUser()
    }

    if (to.meta.requiresAuth && !authStore.user) {
        next({ name: 'login' })
    } else if (to.meta.guest && authStore.user) {
        next({ name: 'todos' })
    } else {
        next()
    }
})

export default router
