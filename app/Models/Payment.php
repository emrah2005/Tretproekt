<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'influencer_id',
        'amount',
        'status',
        'payment_method',
        'transaction_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function influencer()
    {
        return $this->belongsTo(User::class, 'influencer_id');
    }
}
