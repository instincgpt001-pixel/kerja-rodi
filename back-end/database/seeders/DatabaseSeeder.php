<?php


namespace Database\Seeders;


use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat User Admin & Pengguna
        User::create([
            'name' => 'Admin Toko',
            'email' => 'admin@umkm.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);
        $budi = User::create([
            'name' => 'Budi Pengguna',
            'email' => 'budi@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'pengguna',
        ]);


        // 2. Buat Kategori Produk
        $makanan = Category::create(['name' => 'Makanan Ringan']);
        $minuman = Category::create(['name' => 'Minuman']);


        // 3. Buat Produk
        $keripik = Product::create([
            'name' => 'Keripik Kentang Original', 'price' => 18000, 'stock' => 150,
            'category_id' => $makanan->id, 'image' => 'keripik-kentang.jpg'
        ]);
        $kopi = Product::create([
            'name' => 'Kopi Susu Gula Aren 1L', 'price' => 75000, 'stock' => 50,
            'category_id' => $minuman->id, 'image' => 'kopi-susu.jpg'
        ]);


        // 4. Buat Skenario Keranjang Belanja untuk Budi
        $keranjangBudi = Cart::create(['user_id' => $budi->id]);
        CartItem::create([
            'cart_id' => $keranjangBudi->id, 'product_id' => $keripik->id, 'qty' => 2,
        ]);
        CartItem::create([
            'cart_id' => $keranjangBudi->id, 'product_id' => $kopi->id, 'qty' => 1,
        ]);


        // 5. Buat Skenario Pesanan untuk Budi
        $subtotalKeripik = $keripik->price * 2;
        $subtotalKopi = $kopi->price * 1;
        $totalPesanan = $subtotalKeripik + $subtotalKopi;


        $pesananBudi = Order::create([
            'user_id' => $budi->id,
            'total' => $totalPesanan,
            'status' => 'diproses',
            'address_text' => 'Jl. Pahlawan No. 123, Semarang',
        ]);


        OrderItem::create([
            'order_id' => $pesananBudi->id, 'product_id' => $keripik->id, 'price' => $keripik->price,
            'qty' => 2, 'subtotal' => $subtotalKeripik,
        ]);
        OrderItem::create([
            'order_id' => $pesananBudi->id, 'product_id' => $kopi->id, 'price' => $kopi->price,
            'qty' => 1, 'subtotal' => $subtotalKopi,
        ]);
    }
}
