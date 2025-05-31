<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Models\ApplicantComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicantController extends Controller
{
    public function index(): JsonResponse
    {
        $applicants = Applicant::with('applicant_comments.category')->get();
        return response()->json($applicants);
    }

   public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'address' => 'required|string',
            'comments' => 'array',
            'comments.*.text' => 'required|string',
            'comments.*.category_id' => 'required|exists:categories,id',
        ]);

        if (Applicant::where('email', $request->email)->exists()) {
            return response()->json(['error' => 'Email already taken.'], 422);
        }

        $applicant = Applicant::create($request->only(['name', 'email', 'phone', 'address']));

        foreach ($request->comments as $commentData) {
            $applicant->applicant_comments()->create([
                'comment' => $commentData['text'],
                'category_id' => $commentData['category_id'],
            ]);
        }
        return response()->json($applicant->load('applicant_comments'), 201);
    }


}
