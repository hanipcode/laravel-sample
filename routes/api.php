<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PomodoroController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

// Public routes (with web middleware for session support)
Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Todos
    Route::get('/todos', [TodoController::class, 'index']);
    Route::post('/todos', [TodoController::class, 'store']);
    Route::put('/todos/{todo}', [TodoController::class, 'update']);
    Route::delete('/todos/{todo}', [TodoController::class, 'destroy']);

    // Pomodoros
    Route::get('/pomodoros', [PomodoroController::class, 'index']);
    Route::post('/pomodoros/start', [PomodoroController::class, 'start']);
    Route::post('/pomodoros/{pomodoro}/complete', [PomodoroController::class, 'complete']);
});
