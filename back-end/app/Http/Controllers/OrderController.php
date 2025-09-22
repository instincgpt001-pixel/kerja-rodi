<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Membuat pesanan baru (checkout).
     */
    public function store(Request $request)
    {
        $request->validate([
            'address_text' => 'required|string|max:1000',
            'item_ids' => 'required|array|min:1',
            'item_ids.*' => 'exists:cart_items,id',
        ]);

        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->firstOrFail();
        $itemsToCheckout = $cart->items()->whereIn('id', $request->item_ids)->with('product')->get();

        if ($itemsToCheckout->isEmpty()) {
            return response()->json(['message' => 'Tidak ada item yang dipilih untuk checkout.'], 400);
        }

        // Gunakan database transaction untuk memastikan konsistensi data
        return DB::transaction(function () use ($user, $request, $itemsToCheckout, $cart) {
            $total = 0;

            // Validasi stok dan hitung total
            foreach ($itemsToCheckout as $item) {
                if ($item->qty > $item->product->stock) {
                    // Batalkan transaksi jika stok tidak cukup
                    return response()->json(['message' => 'Stok untuk produk ' . $item->product->name . ' tidak mencukupi.'], 400);
                }
                $total += $item->product->price * $item->qty;
            }

            // 1. Buat record pesanan (Order)
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 'diproses', 
                'address_text' => $request->address_text,
            ]);

            // 2. Pindahkan item dari keranjang ke item pesanan (OrderItem)
            foreach ($itemsToCheckout as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'price' => $item->product->price, 
                    'qty' => $item->qty,
                    'subtotal' => $item->product->price * $item->qty,
                ]);

                // 3. Kurangi stok produk
                $item->product->decrement('stock', $item->qty);
            }

            // 4. Hapus item yang sudah di-checkout dari keranjang
            $cart->items()->whereIn('id', $request->item_ids)->delete();

            return response()->json($order->load('items.product'), 201);
        });
    }

    /**
     * Menampilkan riwayat pesanan pengguna.
     */
    public function index()
    {
        $user = Auth::user();
        $orders = Order::with('items.product')
                       ->where('user_id', $user->id)
                       ->latest() 
                       ->get();

        return response()->json($orders);
    }
}