import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
    },

    actions: {
        async fetchUser() {
            this.loading = true
            try {
                const response = await axios.get('/api/user')
                this.user = response.data
            } catch (error) {
                this.user = null
            } finally {
                this.loading = false
            }
        },

        async login(email, password) {
            this.loading = true
            this.error = null
            try {
                await axios.get('/sanctum/csrf-cookie')
                const response = await axios.post('/api/login', { email, password })
                this.user = response.data.user
                return true
            } catch (error) {
                this.error = error.response?.data?.message || 'Login failed'
                return false
            } finally {
                this.loading = false
            }
        },

        async logout() {
            try {
                await axios.post('/api/logout')
            } finally {
                this.user = null
            }
        },
    },
})
