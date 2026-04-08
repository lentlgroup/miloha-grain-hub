<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class)->withTimestamps();
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function hasPermissionTo(string $permissionName): bool
    {
        return $this->permissions->contains('name', $permissionName);
    }

    public function syncPermissions(iterable $permissions): self
    {
        $resolvedPermissions = Permission::query()
            ->whereIn('name', collect($permissions)->flatten()->all())
            ->pluck('id');

        $this->permissions()->sync($resolvedPermissions);

        return $this->load('permissions');
    }
}
