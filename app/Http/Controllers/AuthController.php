<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Determine user type
        $userType = $request->input('userType');
        
        // Base validation rules
        $rules = [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'userType' => 'required|in:influencer,brand',
        ];
        
        // Brand-specific validation
        if ($userType === 'brand') {
            $rules['companyName'] = 'required|string|max:255';
            $rules['industry'] = 'required|string|max:255';
            $rules['aboutCompany'] = 'required|string';
            $rules['location'] = 'required|string|max:255';
        }
        
        // Influencer-specific validation
        if ($userType === 'influencer') {
            $rules['fullName'] = 'required|string|max:255';
            $rules['bio'] = 'required|string';
            $rules['niche'] = 'required|string|max:255';
            $rules['location'] = 'required|string|max:255';
        }
        
        $rules['acceptTerms'] = 'required|boolean';
        
        $validated = $request->validate($rules);
        
        // Create user
        $user = User::create([
            'name' => $userType === 'brand' ? $validated['companyName'] : $validated['fullName'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'user_type' => $userType,
        ]);
        
        // Create profile with type-specific data
        $profileData = [
            'user_id' => $user->id,
            'type' => $userType,
        ];
        
        if ($userType === 'brand') {
            $profileData['bio'] = $validated['aboutCompany'] ?? null;
            $profileData['niche'] = $validated['industry'] ?? null;
        } else if ($userType === 'influencer') {
            $profileData['bio'] = $validated['bio'] ?? null;
            $profileData['niche'] = $validated['niche'] ?? null;
        }
        
        Profile::create($profileData);
        
        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'message' => 'Registration successful',
            'token' => $token,
            'user' => $user->load('profile'),
        ], 201);
    }
    
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        
        $user = User::where('email', $request->email)->first();
        
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }
        
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user->load('profile'),
        ]);
    }
    
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Logged out successfully']);
    }
}
