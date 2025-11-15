<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Get user profile
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $profile = $user->profile;

        return response()->json([
            'user' => $user,
            'profile' => $profile,
        ], 200);
    }

    /**
     * Update user profile
     */
    public function update(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|nullable',
            'company' => 'sometimes|string|nullable',
            'bio' => 'sometimes|string|nullable',
            'niche' => 'sometimes|string|nullable',
            'profile_picture' => 'sometimes|string|nullable',
            'website' => 'sometimes|url|nullable',
            'social_media_links' => 'sometimes|json|nullable',
            'engagement_rate' => 'sometimes|numeric|min:0|max:100|nullable',
        ]);

        // Update user fields
        $user->update($request->only(['name', 'email', 'phone', 'company']));

        // Update or create profile
        $profile = $user->profile ?? $user->profile()->create(['type' => $user->user_type]);
        $profile->update($request->only([
            'bio', 'niche', 'profile_picture', 'website', 'social_media_links', 'engagement_rate'
        ]));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->refresh(),
            'profile' => $profile->refresh(),
        ], 200);
    }

    /**
     * Delete user profile
     */
    public function destroy(Request $request)
    {
        $user = $request->user();
        $user->delete();

        return response()->json([
            'message' => 'Profile deleted successfully',
        ], 200);
    }
}
