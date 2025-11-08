<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function index()
    {
        $campaigns = Campaign::with('brand')->where('status', 'active')->latest()->get();
        return response()->json($campaigns);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'budget' => 'required|numeric|min:0',
            'category' => 'required|string',
            'brief' => 'nullable|string',
        ]);

        $campaign = Campaign::create([
            'brand_id' => auth()->
