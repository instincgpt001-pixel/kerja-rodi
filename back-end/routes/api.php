<?php


use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;


// Rute Otentikasi
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:web');
Route::middleware('auth:web')->get('/user', function (Request $request) {
    return $request->user();
});

// Rute Produk
Route::get('/products', function () {
    $products = Product::all();
    return response()->json($products);
});
Route::post('/products', [ProductController::class, 'store']);

// RUTE PENCARIAN PRODUK 
// 1. Rekomendasi 5 produk acak saat search bar diklik
Route::get('/products/recommendations', [ProductController::class, 'recommendations']);

// 2. Saran pencarian (live search) saat pengguna mengetik
Route::get('/products/search-suggestions', [ProductController::class, 'searchSuggestions']);

// 3. Pencarian penuh saat pengguna menekan Enter
Route::get('/products/search', [ProductController::class, 'search']);

//  RUTE KATEGORI
// 1. Mengambil 5 kategori acak untuk homepage
Route::get('/categories/random', [CategoryController::class, 'getRandomCategories']);

// 2. Menampilkan produk berdasarkan ID kategori
Route::get('/categories/{category}/products', [CategoryController::class, 'showProductsByCategory']);




