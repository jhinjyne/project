<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getAll()
    {
        return response()->json(Category::all());
    }

    // public function add(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255'
    //     ]);

    //     $category = Category::create([
    //         'name' => $request->name
    //     ]);

    //     return response()->json($category, 201);
    // }

    // public function show(Category $category)
    // {
    //     return response()->json($category);
    // }

    // public function update(Request $request, Category $category)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255'
    //     ]);

    //     $category->update([
    //         'name' => $request->name
    //     ]);

    //     return response()->json($category);
    // }

    // public function destroy(Category $category)
    // {
    //     $category->delete();

    //     return response()->json(null, 204);
    // }
}
