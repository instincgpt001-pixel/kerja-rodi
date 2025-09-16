<?php


use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:web');


Route::middleware('auth:web')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/products', function () {
    $products = Product::all();
    return response()->json($products);
});


Route::post('/products', [ProductController::class, 'store']);
