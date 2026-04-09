<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Permission::query()->withCount('roles')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:permissions,name'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $permission = Permission::query()->create($validated);
        $permission->loadCount('roles');
        return response()->json(['data' => $permission], 201);
    }

    public function show(Permission $permission): JsonResponse
    {
        $permission->loadCount('roles');
        return response()->json(['data' => $permission]);
    }

    public function update(Request $request, Permission $permission): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:100', 'unique:permissions,name,' . $permission->id],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $permission->update($validated);
        $permission->loadCount('roles');
        return response()->json(['data' => $permission->fresh()]);
    }

    public function destroy(Permission $permission): JsonResponse
    {
        $permission->delete();
        return response()->json(['message' => 'Deleted.']);
    }
}
