<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getRandomCategories()
    {
        $categories = Category::inRandomOrder()->limit(5)->get();
        return response()->json($categories);
    }

    public function showProductsByCategory(Category $category)
    {
        $products = $category->products()->where('is_active', true)->get();
        return response()->json($products);
    }
}