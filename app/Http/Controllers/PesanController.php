<?php

namespace App\Http\Controllers;

use App\Models\Pesan;
use App\Http\Requests\StorePesanRequest;
use App\Http\Requests\UpdatePesanRequest;
use App\Models\Kas;
use App\Models\KasMasuk;
use App\Models\KasMasukMakanan;
use App\Models\Makanan;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;



class PesanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $makanans = Makanan::all();
        $pesans = KasMasuk::query()
            ->with('kasMasukPesan.makanan')
            ->where('kode', 'like', 'PSN%')
            ->orderBy('updated_at', 'desc')
            ->get();
        return Inertia::render('Pesan/Index', [
            'makanans' => $makanans,
            'pesans' => $pesans,
        ]);
    }

    public function indexTest()
    {
        $makanans = Makanan::all();
        $pesans = Pesan::orderBy('updated_at', 'desc')->get();
        dd($pesans);
        return Inertia::render('Pesan/IndexTest', [
            'makanans' => $makanans,
            'pesans' => $pesans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }


    public function storeTest(StorePesanRequest $request)
    {
        dd($request);
    }

    public function store(StorePesanRequest $request)
    {
        try {
            DB::beginTransaction();

            // Generate the new kode
            $lastKodePesan = Pesan::where('kode', 'like', 'PSN%')->orderBy('kode', 'desc')->first();
            $lastKode = $lastKodePesan ? $lastKodePesan->kode : "PSN000";
            $lastNumber = (int)substr($lastKode, 3);
            $newNumber = $lastNumber + 1;
            $newKode = 'PSN' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);

            // Create new kas and kas_masuk records
            $kas = Kas::create(['kode' => $newKode]);
            $kasMasuk = KasMasuk::create(['kode' => $newKode, 'status' => 'pending']);

            // Save pesan records
            foreach ($request->pesan as $item) {
                $pesan = new Pesan();
                $pesan->kode = $newKode;
                $pesan->nama = $item['nama'];
                $pesan->makanan_id = $item['produk_id']; // Use produk_id instead of id
                $pesan->jumlah = $item['jumlah'];
                $pesan->save();
            }

            DB::commit();

            return redirect()->back()->with('message', 'Pesanan Anda berhasil disimpan. Silahkan bayar ke kasir dengan kode invoice: ' . $newKode);
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
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
        try {
            DB::beginTransaction();

            $kode = "";

            foreach ($request->pesan as $item) {
                $kode = $item['kode'];
                $status = $item['status'];

                $kodeLama = $item['kode'];
                $newKode = $kodeLama;

                if (strpos($kodeLama, 'PSN') === 0) {
                    if ($status === "Cencel") {
                        Kas::where('kode', $item['kode'])->delete();
                        KasMasuk::where('kode', $item['kode'])->delete();
                        Pesan::where('kode', $item['kode'])->delete();
                        DB::commit();
                        return redirect()->back()->with('message', 'Pesanan Anda berhasil dihapus dengan kode invoice: ' . $kode);
                    }
                    $lastKodePesan = KasMasuk::where('kode', 'like', 'KSP24%')->orderBy('kode', 'desc')->first();
                    $lastKode = $lastKodePesan ? $lastKodePesan->kode : "KSP24000";
                    // dd($lastKode);
                    $lastNumber = (int)substr($lastKode, 3);
                    $newNumber = $lastNumber + 1;
                    $newKode = 'KSP' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);

                    Kas::where('kode', $item['kode'])->delete();
                    KasMasuk::where('kode', $item['kode'])->delete();
                    Pesan::where('kode', $item['kode'])->delete();

                    $kas = Kas::create(['kode' => $newKode]);
                    $kasMasuk = KasMasuk::create(['kode' => $newKode, 'status' => $status]);

                    foreach ($item['kas_masuk_pesan'] as $makanan) {
                        KasMasukMakanan::create([
                            'kode' => $newKode, // Use newKode here
                            'makanan_id' => $makanan['makanan_id'],
                            'jumlah' => $makanan['jumlah'],
                        ]);
                    }
                } else {
                    foreach ($item['kas_masuk_pesan'] as $makanan) {
                        KasMasukMakanan::updateOrCreate(
                            [
                                'kode' => $kode, // Ensure to use the existing kode
                                'makanan_id' => $makanan['makanan_id'],
                            ],
                            [
                                'jumlah' => $makanan['jumlah'],
                            ]
                        );
                    }
                }
            }

            DB::commit();

            return redirect()->back()->with('message', 'Pesanan Anda berhasil diperbarui dengan kode invoice: ' . $kode);
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat memperbarui data: ' . $e->getMessage()]);
        }
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
