<?php

namespace App\Models;

use App\Enums\MembershipTier;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'user_id',
        'address',
        'latitude',
        'longitude',
        'membership_tier',
        'points',
        'total_spent',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'membership_tier' => MembershipTier::class,
            'points' => 'integer',
            'total_spent' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function addPoints(int $points): void
    {
        $this->increment('points', $points);
    }

    public function usePoints(int $points): bool
    {
        if ($this->points < $points) {
            return false;
        }

        $this->decrement('points', $points);
        return true;
    }
}
