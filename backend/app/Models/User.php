<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    public function permissions(): Collection
    {
        return $this->roles
            ->loadMissing('permissions')
            ->pluck('permissions')
            ->flatten()
            ->unique('id')
            ->values();
    }

    public function assignRole(string ...$roleNames): self
    {
        $roles = Role::query()
            ->whereIn('name', $roleNames)
            ->pluck('id');

        $this->roles()->syncWithoutDetaching($roles);

        return $this->load('roles.permissions');
    }

    public function syncRoles(iterable $roleNames): self
    {
        $roles = Role::query()
            ->whereIn('name', collect($roleNames)->flatten()->all())
            ->pluck('id');

        $this->roles()->sync($roles);

        return $this->load('roles.permissions');
    }

    public function hasRole(string $roleName): bool
    {
        return $this->roles->contains('name', $roleName);
    }

    public function hasAnyRole(iterable $roleNames): bool
    {
        return collect($roleNames)
            ->flatten()
            ->contains(fn (string $roleName) => $this->hasRole($roleName));
    }

    public function hasPermissionTo(string $permissionName): bool
    {
        return $this->permissions()->contains('name', $permissionName);
    }

    public function hasAnyPermission(iterable $permissionNames): bool
    {
        return collect($permissionNames)
            ->flatten()
            ->contains(fn (string $permissionName) => $this->hasPermissionTo($permissionName));
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
