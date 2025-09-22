<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Menampilkan isi keranjang belanja pengguna yang sedang login.
     */
    public function index()
    {
        $user = Auth::user();
        $cart = Cart::with('items.product')->where('user_id', $user->id)->first();

        if (!$cart) {
            return response()->json(['items' => []]);
        }

        return response()->json($cart);
    }

    /**
     * Menambahkan produk ke dalam keranjang.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        $product = Product::findOrFail($request->product_id);

        if ($request->qty > $product->stock) {
            return response()->json(['message' => 'Stok produk tidak mencukupi.'], 400);
        }

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            $newQty = $cartItem->qty + $request->qty;
            if ($newQty > $product->stock) {
                return response()->json(['message' => 'Stok produk tidak mencukupi untuk jumlah yang diminta.'], 400);
            }
            $cartItem->update(['qty' => $newQty]);
        } else {
            $cartItem = $cart->items()->create([
                'product_id' => $product->id,
                'qty' => $request->qty,
            ]);
        }

        return response()->json($cartItem->load('product'), 201);
    }

    /**
     * Mengubah jumlah item di keranjang.
     */
    public function update(Request $request, CartItem $item)
    {
        $request->validate([
            'qty' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart || !$cart->items->contains($item)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product = Product::findOrFail($item->product_id);

        if ($request->qty > $product->stock) {
            return response()->json(['message' => 'Stok produk tidak mencukupi.'], 400);
        }

        $item->update(['qty' => $request->qty]);

        return response()->json($item->load('product'));
    }

    /**
     * Menghapus item dari keranjang.
     */
    public function destroy(CartItem $item)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart || !$cart->items->contains($item)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item->delete();

        return response()->json(['message' => 'Item berhasil dihapus dari keranjang.']);
    }
}