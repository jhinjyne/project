<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Models\ApplicantComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicantController extends Controller
{
    public function show(): JsonResponse
    {
        $applicants = Applicant::with('applicant_comments.category')->get();
        return response()->json($applicants);
    }

    public function showApplicant($id)
    {
        $applicant = Applicant::with('applicant_comments')->find($id);
        if (!$applicant) {
            return response()->json(['message' => 'Applicant not found'], 404);
        }
        return response()->json($applicant);
    }

    public function add(Request $request)
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

    public function update(Request $request, $id)
    {
        $applicant = Applicant::find($id);
        if (!$applicant) {
            return response()->json(['message' => 'Applicant not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'required|email|max:255',
            'address' => 'nullable|string',
        ]);

        $applicant->update($validated);

        return response()->json(['message' => 'Applicant updated successfully', 'applicant' => $applicant]);
    }

    public function destroy($id)
    {
        Applicant::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input('ids');
        Applicant::whereIn('id', $ids)->delete();
        return response()->json(['message' => 'Applicants deleted']);
    }

    public function updateComment(Request $request, $id)
    {
        $validated = $request->validate([
            'comment' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $comment = ApplicantComment::findOrFail($id);
        $comment->update($validated);

        return response()->json(['message' => 'Comment updated successfully', 'comment' => $comment]);
    }

    public function addComment(Request $request)
    {
        $validated = $request->validate([
            'applicant_id' => 'required|exists:applicants,id',
            'comment' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $comment = ApplicantComment::create($validated);

        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment]);
    }

    public function destroyComment($id)
    {
        $comment = ApplicantComment::find($id);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
    
    public function storeComment(Request $request)
    {
        $data = $request->validate([
            'applicant_id' => 'required|integer|exists:applicants,id',
            'comment' => 'required|string',
            'category_id' => 'required|integer|exists:categories,id',
        ]);

        $comment = ApplicantComment::create($data);

        return response()->json($comment, 201);
    }





}
