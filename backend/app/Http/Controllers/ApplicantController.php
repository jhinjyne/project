<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use Illuminate\Http\JsonResponse;

class ApplicantController extends Controller
{
    public function index(): JsonResponse
    {
        $applicants = Applicant::all();
        return response()->json($applicants);
    }
}
