<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $todos = $request->user()
            ->todos()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($todos);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $todo = $request->user()->todos()->create($validated);

        return response()->json($todo, 201);
    }

    public function update(Request $request, Todo $todo): JsonResponse
    {
        if ($todo->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'is_completed' => ['sometimes', 'boolean'],
        ]);

        $todo->update($validated);

        return response()->json($todo);
    }

    public function destroy(Request $request, Todo $todo): JsonResponse
    {
        if ($todo->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $todo->delete();

        return response()->json(['message' => 'Todo deleted']);
    }
}
