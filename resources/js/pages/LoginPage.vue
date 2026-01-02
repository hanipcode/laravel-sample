<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div class="w-full max-w-sm">
            <div class="bg-white rounded-lg shadow p-6">
                <h1 class="text-2xl font-semibold text-gray-800 text-center mb-6">Larto</h1>
                
                <form @submit.prevent="handleLogin" class="space-y-4">
                    <div v-if="authStore.error" class="bg-red-50 text-red-600 text-sm p-3 rounded">
                        {{ authStore.error }}
                    </div>
                    
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            id="email"
                            v-model="email"
                            type="email"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                            placeholder="admin@larto.app"
                        />
                    </div>
                    
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            id="password"
                            v-model="password"
                            type="password"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                            placeholder="Enter password"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        :disabled="authStore.loading"
                        class="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
    const success = await authStore.login(email.value, password.value)
    if (success) {
        router.push({ name: 'todos' })
    }
}
</script>
