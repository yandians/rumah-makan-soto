<?php

namespace App\Http\Controllers;

use App\Models\Makanan;
use App\Http\Requests\StoreMakananRequest;
use App\Http\Requests\UpdateMakananRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MakananController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Makanan::query();
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('nama', 'like', '%' . $searchTerm . '%')
                    ->orWhere('kategori', 'like', '%' . $searchTerm . '%')
                    ->orWhere('harga', 'like', '%' . $searchTerm . '%');
            });
        }

        $query->orderBy('nama');

        $totalMakanan = $query->count();
        $makanans = $query->paginate(10);

        $page = $request->input('page');

        return Inertia::render('Makanan/Index', [
            'makanans' => $makanans,
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
            'pageTerm' => $page,
            'totalMakanan' => $totalMakanan,
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
    public function store(StoreMakananRequest $request)
    {
        try {
            $makanan = new Makanan();
            $makanan->nama = $request['nama'];
            $makanan->kategori = $request['kategori'];
            $makanan->harga = $request['harga'];
            $makanan->save();

            return redirect()->route('makanan.index')->with('message', sprintf(
                "Makanan dengan nama %s berhasil dibuat!",
                $request['nama']
            ));
        } catch (\Exception $e) {
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Makanan $makanan,  $id)
    {
        try {
            $MakananData = Makanan::where('id', $id)
                ->orderByDesc('id')
                ->first();

            if (!$MakananData) {
                return response()->json(['message' => 'Produk not found.'], 404);
            }

            return response()->json($MakananData);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Makanan $makanan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMakananRequest $request, Makanan $makanan)
    {
        try {
            $makanan->nama = $request->nama;
            $makanan->kategori = $request->kategori;
            $makanan->harga = $request->harga;
            $makanan->save();

            return redirect()->route('makanan.index')->with('message', sprintf(
                "Makanan dengan nama %s berhasil diupdate!",
                $request->nama
            ));
        } catch (\Exception $e) {
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat mengupdate data: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Makanan $makanan)
    {
        $makanan->delete();
        $namaMakanan = $makanan->nama;

        return redirect()->back()->with('message', sprintf("Produk dengan nama %s berhasil dihapus!", $namaMakanan));
    }
}
