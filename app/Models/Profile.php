<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone',
        'location',
        'bio',
        'avatar',
        'social_platforms',
        'niches',
        'content_types',
        'collaboration_types',
        'pricing',
        'portfolio_url',
    ];

    protected $casts = [
        'social_platforms' => 'array',
        'niches' => 'array',
        'content_types' => 'array',
        'collaboration_types' => 'array',
        'pricing' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
