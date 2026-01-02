import { defineStore } from 'pinia'
import axios from 'axios'

export const usePomodoroStore = defineStore('pomodoro', {
    state: () => ({
        currentSession: null,
        logs: [],
        timeRemaining: 25 * 60, // 25 minutes in seconds
        isRunning: false,
        intervalId: null,
    }),

    getters: {
        formattedTime: (state) => {
            const minutes = Math.floor(state.timeRemaining / 60)
            const seconds = state.timeRemaining % 60
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        },
        todayCompletedCount: (state) => {
            const today = new Date().toDateString()
            return state.logs.filter(log => {
                return log.completed_at && new Date(log.completed_at).toDateString() === today
            }).length
        },
    },

    actions: {
        async fetchLogs() {
            try {
                const response = await axios.get('/api/pomodoros')
                this.logs = response.data
            } catch (error) {
                console.error('Failed to fetch pomodoro logs:', error)
            }
        },

        async startPomodoro() {
            try {
                const response = await axios.post('/api/pomodoros/start', {
                    duration_minutes: 25,
                })
                this.currentSession = response.data
                this.timeRemaining = 25 * 60
                this.isRunning = true
                this.startTimer()
            } catch (error) {
                console.error('Failed to start pomodoro:', error)
            }
        },

        startTimer() {
            if (this.intervalId) {
                clearInterval(this.intervalId)
            }
            this.intervalId = setInterval(() => {
                if (this.timeRemaining > 0) {
                    this.timeRemaining--
                } else {
                    this.pauseTimer()
                }
            }, 1000)
        },

        pauseTimer() {
            this.isRunning = false
            if (this.intervalId) {
                clearInterval(this.intervalId)
                this.intervalId = null
            }
        },

        resumeTimer() {
            if (this.currentSession && this.timeRemaining > 0) {
                this.isRunning = true
                this.startTimer()
            }
        },

        async completePomodoro() {
            if (!this.currentSession) return

            try {
                const response = await axios.post(`/api/pomodoros/${this.currentSession.id}/complete`)
                this.logs.unshift(response.data)
                this.resetTimer()
            } catch (error) {
                console.error('Failed to complete pomodoro:', error)
            }
        },

        resetTimer() {
            this.pauseTimer()
            this.currentSession = null
            this.timeRemaining = 25 * 60
        },
    },
})
