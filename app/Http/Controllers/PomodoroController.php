<?php

namespace App\Http\Controllers;

use App\Models\PomodoroLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PomodoroController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $logs = $request->user()
            ->pomodoroLogs()
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json($logs);
    }

    public function start(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'duration_minutes' => ['sometimes', 'integer', 'min:1', 'max:60'],
        ]);

        $log = $request->user()->pomodoroLogs()->create([
            'duration_minutes' => $validated['duration_minutes'] ?? 25,
            'started_at' => now(),
        ]);

        return response()->json($log, 201);
    }

    public function complete(Request $request, PomodoroLog $pomodoro): JsonResponse
    {
        if ($pomodoro->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($pomodoro->completed_at) {
            return response()->json(['message' => 'Pomodoro already completed'], 400);
        }

        $pomodoro->update([
            'completed_at' => now(),
        ]);

        return response()->json($pomodoro);
    }
}
