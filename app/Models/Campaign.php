<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'title',
        'description',
        'brief',
        'budget',
        'currency',
        'category',
        'start_date',
        'end_date',
        'status',
        'target_influencers',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'budget' => 'decimal:2',
    ];

    public function brand()
    {
        return $this->belongsTo(User::class, 'brand_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
