<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Http\Requests\StoreProdukRequest;
use App\Http\Requests\UpdateProdukRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProdukController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Produk::query();
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('nama', 'like', '%' . $searchTerm . '%')
                    ->orWhere('kategori', 'like', '%' . $searchTerm . '%')
                    ->orWhere('harga', 'like', '%' . $searchTerm . '%');
            });
        }

        $query->orderBy('nama');

        $totalProduks = $query->count();
        $produks = $query->paginate(10);

        $page = $request->input('page');


        return Inertia::render('Produk/Index', [
            'produks' => $produks,
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
            'pageTerm' => $page,
            'totalProduks' => $totalProduks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProdukRequest $request)
    {
        try {
            $produk = new Produk();
            $produk->nama = $request['nama'];
            $produk->kategori = $request['kategori'];
            $produk->harga = $request['harga'];
            $produk->save();

            return redirect()->route('produk.index')->with('message', sprintf(
                "Produk dengan nama %s berhasil dibuat!",
                $request['nama']
            ));
        } catch (\Exception $e) {
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Produk $produk, $id)
    {
        try {
            $ProdukData = Produk::where('id', $id)
                ->orderByDesc('id')
                ->first();

            if (!$ProdukData) {
                return response()->json(['message' => 'Produk not found.'], 404);
            }

            return response()->json($ProdukData);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Produk $produk)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProdukRequest $request, Produk $produk)
    {
        try {
            $produk->nama = $request->nama;
            $produk->kategori = $request->kategori;
            $produk->harga = $request->harga;
            $produk->save();

            return redirect()->route('produk.index')->with('message', sprintf(
                "Produk dengan nama %s berhasil diupdate!",
                $request->nama
            ));
        } catch (\Exception $e) {
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat mengupdate data: ' . $e->getMessage()]);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Produk $produk)
    {
        $produk->delete();
        $namaProduk = $produk->nama;

        return redirect()->back()->with('message', sprintf("Produk dengan nama %s berhasil dihapus!", $namaProduk));
    }
}
