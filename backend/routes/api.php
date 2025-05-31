<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\CategoryController;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/applicants', [ApplicantController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'getAll']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());
    Route::get('/applicants/{id}', [ApplicantController::class, 'showApplicant']);
    Route::post('/applicants', [ApplicantController::class, 'add']);
    Route::put('/applicants/get/{id}', [ApplicantController::class, 'update']);
    Route::delete('/applicants/{id}', [ApplicantController::class, 'destroy']);
    Route::post('/applicants/delete-multiple', [ApplicantController::class, 'destroyMultiple']);
});