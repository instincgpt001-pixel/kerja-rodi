<?php

use App\Models\Product; // Panggil Model Product
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Ambil semua produk dari database
Route::get('/products', function () {
    $products = Product::all();
    return response()->json($products);
});