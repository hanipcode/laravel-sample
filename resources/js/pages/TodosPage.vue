<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm">
            <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                <h1 class="text-xl font-semibold text-gray-800">Larto</h1>
                <div class="flex items-center gap-4">
                    <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
                    <button
                        @click="handleLogout"
                        class="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>

        <main class="max-w-3xl mx-auto px-4 py-8">
            <!-- Pomodoro Timer -->
            <PomodoroTimer class="mb-8" />

            <!-- Todo Section -->
            <div class="bg-white rounded-lg shadow">
                <div class="p-4 border-b border-gray-100">
                    <h2 class="text-lg font-medium text-gray-800">Tasks</h2>
                </div>

                <!-- Add Todo Form -->
                <form @submit.prevent="handleAddTodo" class="p-4 border-b border-gray-100">
                    <div class="flex gap-2">
                        <input
                            v-model="newTodoTitle"
                            type="text"
                            placeholder="Add a new task..."
                            class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            :disabled="!newTodoTitle.trim()"
                            class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </form>

                <!-- Todo List -->
                <div v-if="todoStore.loading" class="p-8 text-center text-gray-500">
                    Loading...
                </div>
                <ul v-else-if="todoStore.todos.length" class="divide-y divide-gray-100">
                    <li
                        v-for="todo in todoStore.todos"
                        :key="todo.id"
                        class="p-4 flex items-center gap-3 hover:bg-gray-50"
                    >
                        <input
                            type="checkbox"
                            :checked="todo.is_completed"
                            @change="todoStore.toggleTodo(todo)"
                            class="w-4 h-4 text-gray-800 rounded border-gray-300 focus:ring-gray-800"
                        />
                        <span
                            :class="[
                                'flex-1',
                                todo.is_completed ? 'text-gray-400 line-through' : 'text-gray-800'
                            ]"
                        >
                            {{ todo.title }}
                        </span>
                        <button
                            @click="todoStore.deleteTodo(todo)"
                            class="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </li>
                </ul>
                <div v-else class="p-8 text-center text-gray-500">
                    No tasks yet. Add one above!
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTodoStore } from '../stores/todos'
import { usePomodoroStore } from '../stores/pomodoro'
import PomodoroTimer from '../components/PomodoroTimer.vue'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()
const pomodoroStore = usePomodoroStore()

const newTodoTitle = ref('')

onMounted(() => {
    todoStore.fetchTodos()
    pomodoroStore.fetchLogs()
})

const handleAddTodo = async () => {
    if (!newTodoTitle.value.trim()) return
    const success = await todoStore.addTodo(newTodoTitle.value.trim())
    if (success) {
        newTodoTitle.value = ''
    }
}

const handleLogout = async () => {
    await authStore.logout()
    router.push({ name: 'login' })
}
</script>
