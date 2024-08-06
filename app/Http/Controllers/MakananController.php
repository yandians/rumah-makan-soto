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
            $originalFilename = $request->file('image')->getClientOriginalName();
            $timestamp = now()->timestamp;

            $sanitizedFilename = str_replace(' ', '_', $originalFilename);
            $newFilename = $timestamp . '_' . $sanitizedFilename;

            $path = $request->file('image')->storeAs('images', $newFilename, 'public');

            $makanan = new Makanan();
            $makanan->nama = $request['nama'];
            $makanan->kategori = $request['kategori'];
            $makanan->harga = $request['harga'];
            $makanan->image = 'storage/' . $path;
            $makanan->deskripsi = $request['deskripsi'];
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
                return response()->json(['message' => 'Makanan not found.'], 404);
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
            if ($request->hasFile('image')) {
                if ($makanan->image && \Illuminate\Support\Facades\Storage::disk('public')->exists(str_replace('storage/', '', $makanan->image))) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('storage/', '', $makanan->image));
                }

                $originalFilename = $request->file('image')->getClientOriginalName();
                $timestamp = now()->timestamp;

                $sanitizedFilename = str_replace(' ', '_', $originalFilename);
                $newFilename = $timestamp . '_' . $sanitizedFilename;

                $path = $request->file('image')->storeAs('images', $newFilename, 'public');

                $makanan->image = 'storage/' . $path;
            }

            $makanan->nama = $request['nama'];
            $makanan->kategori = $request['kategori'];
            $makanan->harga = $request['harga'];
            $makanan->deskripsi = $request['deskripsi'];
            $makanan->save();

            return redirect()->route('makanan.index')->with('message', sprintf(
                "Makanan dengan nama %s berhasil diperbarui!",
                $request['nama']
            ));
        } catch (\Exception $e) {
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat memperbarui data: ' . $e->getMessage()]);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Makanan $makanan)
    {
        try {
            // Check if the image exists and delete it
            if ($makanan->image && \Illuminate\Support\Facades\Storage::disk('public')->exists(str_replace('storage/', '', $makanan->image))) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('storage/', '', $makanan->image));
            }
    
            // Delete the makanan record
            $makanan->delete();
    
            return redirect()->route('makanan.index')->with('message', sprintf(
                "Makanan dengan nama %s berhasil dihapus!",
                $makanan->nama
            ));
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage()]);
        }
    }
}