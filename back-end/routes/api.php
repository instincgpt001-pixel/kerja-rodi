// backend/routes/api.php
<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// TAMBAHKAN ROUTE DI BAWAH INI
Route::get('/products', function () {
    // Data bohongan untuk pengetesan
    $products = [
        ['id' => 1, 'name' => 'Kopi Robusta', 'price' => 25000],
        ['id' => 2, 'name' => 'Keripik Singkong', 'price' => 15000],
        ['id' => 3, 'name' => 'Sambal Bawang', 'price' => 20000],
    ];

    // Laravel akan otomatis mengubah array ini menjadi format JSON
    return response()->json($products);
});