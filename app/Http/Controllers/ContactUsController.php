<?php

namespace App\Http\Controllers;

use App\Models\ContactUs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactUsController extends Controller
{
    // Взимане на всички записи
    public function getAll()
    {
        $contacts = ContactUs::all();
        return response()->json([
            'success' => true,
            'contacts' => $contacts
        ]);
    }

    // Взимане на един запис по id
    public function getOne($id)
    {
        $contact = ContactUs::findOrFail($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Записът не е намерен'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'contact' => $contact
        ]);
    }

    // Създаване на нов запис
    public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'subject' => 'required|string',
        ]);

        $contact = ContactUs::create($validated);

        return response()->json([
            'success' => true,
            'contact' => $contact
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

    // Обновяване на съществуващ запис
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'subject' => 'required|string',
        ]);

        $contact = ContactUs::findOrFail($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Записът не е намерен'
            ], 404);
        }

        $contact->update($validated);

        return response()->json([
            'success' => true,
            'contact' => $contact
        ]);
    }

    // Изтриване на запис
    public function destroy($id)
    {
        $contact = ContactUs::findOrFail($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Записът не е намерен'
            ], 404);
        }

        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Записът е изтрит успешно'
        ]);
    }
}
