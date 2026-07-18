<?php

namespace App\Http\Controllers;

use App\Models\Camp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CampController extends Controller
{
    public function getAll()
    {
        $camps = Camp::all();
        return response()->json([
            'success' => true,
            'camps' => $camps
        ]);
    }

    public function getOne($id)
    {
        $camp = Camp::findOrFail($id);

        if (!$camp) {
            return response()->json([
                'success' => false,
                'message' => 'Записът не е намерен'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'camp' => $camp
        ]);
    }

    public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
        ]);

        $camp = Camp::create($validated);

        return response()->json([
            'success' => true,
            'camp' => $camp
        ], 201);
    } catch (\Exception $e) {
        // Хващате грешките и ги записвате в логовете
        \Log::error('Error in store method: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
        ]);

        $camp = Camp::findOrFail($id);

        if (!$camp) {
            return response()->json([
                'success' => false,
                'message' => 'Записът не е намерен'
            ], 404);
        }

        $camp->update($validated);

        return response()->json([
            'success' => true,
            'camp' => $camp
        ]);
    }

    public function destroy($id)
    {
        $camp = Camp::findOrFail($id);

        if (!$camp) {
            return response()->json([
                'success' => false,
                'message' => 'Записът не е намерен'
            ], 404);
        }

        $camp->delete();

        return response()->json([
            'success' => true,
            'message' => 'Записът е изтрит успешно'
        ]);
    }
}
