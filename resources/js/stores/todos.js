import { defineStore } from 'pinia'
import axios from 'axios'

export const useTodoStore = defineStore('todos', {
    state: () => ({
        todos: [],
        loading: false,
        error: null,
    }),

    getters: {
        completedTodos: (state) => state.todos.filter(t => t.is_completed),
        pendingTodos: (state) => state.todos.filter(t => !t.is_completed),
    },

    actions: {
        async fetchTodos() {
            this.loading = true
            try {
                const response = await axios.get('/api/todos')
                this.todos = response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch todos'
            } finally {
                this.loading = false
            }
        },

        async addTodo(title) {
            try {
                const response = await axios.post('/api/todos', { title })
                this.todos.unshift(response.data)
                return true
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to add todo'
                return false
            }
        },

        async toggleTodo(todo) {
            try {
                const response = await axios.put(`/api/todos/${todo.id}`, {
                    is_completed: !todo.is_completed,
                })
                const index = this.todos.findIndex(t => t.id === todo.id)
                if (index !== -1) {
                    this.todos[index] = response.data
                }
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to update todo'
            }
        },

        async deleteTodo(todo) {
            try {
                await axios.delete(`/api/todos/${todo.id}`)
                this.todos = this.todos.filter(t => t.id !== todo.id)
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to delete todo'
            }
        },
    },
})
