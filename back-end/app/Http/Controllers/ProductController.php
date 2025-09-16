<?php


namespace App\Http\Controllers;


use App\Models\Product;
use Illuminate\Http\Request;


class ProductController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
        ]);


        $imageName = time().'.'.$request->image->extension();


        $request->image->storeAs('public/products', $imageName);


        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'stock' => $request->stock,
            'category_id' => $request->category_id,
            'image' => $imageName, 
        ]);


        return response()->json($product, 201);
    }
}
