<?php

namespace App\Http\Controllers;

use App\Models\Pesan;
use App\Http\Requests\StorePesanRequest;
use App\Http\Requests\UpdatePesanRequest;
use App\Models\Kas;
use App\Models\KasMasuk;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;



class PesanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Pesan/Index', []);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePesanRequest $request)
    {
        try {
            DB::beginTransaction();
            $lastKodePesan = Pesan::where('kode', 'like', 'PSN%')->orderBy('kode', 'desc')->first();
            $lastKode = $lastKodePesan ? $lastKodePesan->kode : "PSN000";
            $lastNumber = (int)substr($lastKode, 3);
            $newNumber = $lastNumber + 1;
            $newKode = 'PSN' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);

            $kas = Kas::create([
                'kode' => $newKode,
            ]);

            $kasMasuk = KasMasuk::create([
                'kode' => $newKode,
                'status' => 'pending'
            ]);

            foreach ($request->pesan as $item) {    
                                $pesan = new Pesan();
                $pesan->kode = $newKode;
                $pesan->nama = $item['nama'];
                $pesan->makanan_id = $item['produk_id'];
                $pesan->jumlah = $item['jumlah'];
                $pesan->save();
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Pesan $pesan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pesan $pesan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePesanRequest $request, Pesan $pesan)
    {
        // dd("hallo");
        // try {
        //     DB::beginTransaction();
            
        //     // Temukan Kas yang sesuai dengan kode yang diberikan
        //     $kas = Kas::where('kode', $kode)->first();
    
        //     if (!$kas) {
        //         return back()->withErrors(['message' => 'Data Kas tidak ditemukan untuk kode ' . $kode]);
        //     }
    
        //     // Perbarui data Kas dengan data baru dari request
        //     $kas->update([
        //         'kode' => $request->input('kode', $kas->kode), // Hanya mengupdate jika ada data baru
        //     ]);
    
        //     // Temukan KasMasuk yang sesuai dengan kode Kas
        //     $kasMasuk = KasMasuk::where('kode', $kode)->first();
    
        //     if (!$kasMasuk) {
        //         return back()->withErrors(['message' => 'Data KasMasuk tidak ditemukan untuk kode ' . $kode]);
        //     }
    
        //     // Perbarui status jika ada data status baru
        //     $kasMasuk->update([
        //         'status' => $request->input('status', $kasMasuk->status), // Hanya mengupdate jika ada data baru
        //     ]);
    
        //     // Hapus semua pesan yang ada untuk kode tersebut sebelum menambahkan yang baru
        //     Pesan::where('kode', $kode)->delete();
    
        //     // Tambahkan pesan baru dari request
        //     foreach ($request->input('pesan', []) as $item) {
        //         $pesan = new Pesan();
        //         $pesan->kode = $kode;
        //         $pesan->nama = $item['nama'];
        //         $pesan->makanan_id = $item['produk_id'];
        //         $pesan->jumlah = $item['jumlah'];
        //         $pesan->save();
        //     }
    
        //     DB::commit();
    
        //     return redirect()->route('kas.index')->with('success', 'Data berhasil diperbarui.');
        // } catch (\Exception $e) {
        //     DB::rollback();
        //     return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat memperbarui data: ' . $e->getMessage()]);
        // }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pesan $pesan, $kode)
    {
        try {
            DB::beginTransaction();
            
            Kas::where('kode', $kode)->delete();
            KasMasuk::where('kode', $kode)->delete();
            Pesan::where('kode', $kode)->delete();

            DB::commit();

            return redirect()->route('kasPengeluaran.index')->with('message', sprintf(
                "Pesanan dengan code %s berhasil dihapus!",
                $kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage()]);
        }
    }
}
