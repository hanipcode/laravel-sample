<template>
    <div class="bg-white rounded-lg shadow p-6">
        <div class="text-center">
            <h2 class="text-lg font-medium text-gray-800 mb-4">Pomodoro Timer</h2>
            
            <!-- Timer Display -->
            <div class="text-6xl font-mono font-bold text-gray-800 mb-6">
                {{ pomodoroStore.formattedTime }}
            </div>

            <!-- Controls -->
            <div class="flex justify-center gap-3 mb-4">
                <template v-if="!pomodoroStore.currentSession">
                    <button
                        @click="pomodoroStore.startPomodoro"
                        class="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                        Start
                    </button>
                </template>
                <template v-else>
                    <button
                        v-if="pomodoroStore.isRunning"
                        @click="pomodoroStore.pauseTimer"
                        class="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                        Pause
                    </button>
                    <button
                        v-else
                        @click="pomodoroStore.resumeTimer"
                        class="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                        Resume
                    </button>
                    <button
                        @click="pomodoroStore.completePomodoro"
                        class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        Complete
                    </button>
                    <button
                        @click="pomodoroStore.resetTimer"
                        class="px-6 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    >
                        Reset
                    </button>
                </template>
            </div>

            <!-- Stats -->
            <div class="text-sm text-gray-500">
                Completed today: {{ pomodoroStore.todayCompletedCount }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { usePomodoroStore } from '../stores/pomodoro'

const pomodoroStore = usePomodoroStore()
</script>
