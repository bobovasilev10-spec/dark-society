<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
// use App\Mail\RegConfirmEmail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => "Невалидни данни",
            ]);
        }
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // TODO send email confirmation
        // Mail::to($request->email)->send(new RegConfirmEmail($user));
        return response()->json([
            "succsess" => true,
            "user" => $user
        ]);
    }
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (Auth::attempt($credentials)) {
            $user = User::where('email', $request->email)->first();

            return response()->json([
                "success" => true,
                "user" => $user,
            ]);
        }

        return response()->json([
            "success" => false,
            "message" => "Невалиден имейл адрес или парола",
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'success' => true,
            'message' => 'Logout successful',
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = auth()->user(); // Get the currently authenticated user

        $this->validate($request, [
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if (Hash::check($request->current_password, $user->password)) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Password updated successfully.',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Current password is incorrect.',
        ]);
    }
    //  Reset Password
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Send the password reset email
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Reset password email sent',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to send reset password email',
        ]);
    }

    public function checkResetToken(Request $request)
    {
        // Validate the token and email input
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|string|email|max:255',
        ]);

        // Find the user with the given email
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // User not found for the given email
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ]);
        }

        // Check if the token exists and is valid for the user
        if (Password::broker()->tokenExists($user, $request->token)) {
            return response()->json([
                'success' => true,
                'message' => 'Token is valid',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Token is invalid',
        ]);
    }

    public function setNewPassword(Request $request)
    {
        // Validate the token, email and password input
        $request->validate([
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Find the user with the given email
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // User not found for the given email
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ]);
        }

        // Set the new password
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully',
        ]);
    }

    public function userOrders()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ]);
        }
        $orders = Order::where('user_id', $user->id)
        ->with(['orderItems.product', 'econt_city', 'econt_office', 'econt_street'])
        ->get();
        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }
}
