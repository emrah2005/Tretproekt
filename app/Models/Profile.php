<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'bio',
        'avatar_url',
        'phone',
        'location',
        'niche',
        'dna_vector',
        'metrics',
        'followers',
        'engagement_rate',
    ];

    protected $casts = [
        'dna_vector' => 'array',
        'metrics' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
