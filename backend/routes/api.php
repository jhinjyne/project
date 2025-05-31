<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\CategoryController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/applicants', [ApplicantController::class, 'index']);

Route::middleware('auth:sanctum')->post('/applicants', [ApplicantController::class, 'store']);

Route::get('/categories', [CategoryController::class, 'index']);

