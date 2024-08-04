<?php

namespace App\Http\Controllers;

use App\Models\Kas;
use App\Http\Requests\StoreKasRequest;
use App\Http\Requests\UpdateKasRequest;
use App\Models\KasKeluar;
use App\Models\KasMasuk;
use App\Models\KasMasukMakanan;
use App\Models\KasMasukProduk;
use App\Models\Makanan;
use App\Models\Produk;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Http\Request;



class KasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function indexPendapatan(Request $request)
    {
        $query = KasMasuk::query();

        $searchTerm = $request->input('search');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        if (!empty($searchTerm)) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('kode', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('kasMasukMakanan.makanan', function ($q) use ($searchTerm) {
                        $q->where('nama', 'like', '%' . $searchTerm . '%');
                    });
            });
        }

        if (!empty($startDate) && !empty($endDate)) {
            $startDate = date('Y-m-d 00:00:00', strtotime($startDate));
            $endDate = date('Y-m-d 23:59:59', strtotime($endDate));
            $query->whereBetween('updated_at', [$startDate, $endDate]);
        } elseif (!empty($startDate)) {
            $startDate = date('Y-m-d 00:00:00', strtotime($startDate));
            $query->where('updated_at', '>=', $startDate);
        } elseif (!empty($endDate)) {
            $endDate = date('Y-m-d 23:59:59', strtotime($endDate));
            $query->where('updated_at', '<=', $endDate);
        }

        $query->orderByDesc('updated_at');

        $totalKasMasuk = $query->count();

        $kasMasuk = $query->with('kasMasukMakanan.makanan')->paginate(10);

        $page = $request->input('page');

        $makanans = Makanan::all();

        $lastKasMasukMakanan = KasMasukMakanan::where('kode', 'like', 'KSP24%')->orderBy('kode', 'desc')->first();
        $lastKode = $lastKasMasukMakanan ? $lastKasMasukMakanan->kode : "KSP24000";

        return Inertia::render('Kas/Pendapatan/Index', [
            'kasMasuk' => $kasMasuk,
            'makanans' => $makanans,
            'status' => session('status'),
            'searchTerm' => $searchTerm,
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'pageTerm' => $page,
            'lastKode' => $lastKode,
            'totalKasMasuk' => $totalKasMasuk
        ]);
    }

    public function indexPesan(Request $request)
    {
        return Inertia::render('Kas/Pesan/Index', []);
    }

    public function indexPengeluaran(Request $request)
    {
        $query = KasKeluar::query();

        $searchTerm = $request->input('search');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        if (!empty($searchTerm)) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('kode', 'like', '%' . $searchTerm . '%')
                    ->orWhere('nama', 'like', '%' . $searchTerm . '%')
                    ->orWhere('jumlah', 'like', '%' . $searchTerm . '%')
                    ->orWhere('total', 'like', '%' . $searchTerm . '%')
                    ->orWhere('metode_pembayaran', 'like', '%' . $searchTerm . '%')
                    ->orWhere('keterangan', 'like', '%' . $searchTerm . '%');
            });
        }

        if (!empty($startDate) && !empty($endDate)) {
            $startDate = date('Y-m-d 00:00:00', strtotime($startDate));
            $endDate = date('Y-m-d 23:59:59', strtotime($endDate));
            $query->whereBetween('updated_at', [$startDate, $endDate]);
        } elseif (!empty($startDate)) {
            $startDate = date('Y-m-d 00:00:00', strtotime($startDate));
            $query->where('updated_at', '>=', $startDate);
        } elseif (!empty($endDate)) {
            $endDate = date('Y-m-d 23:59:59', strtotime($endDate));
            $query->where('updated_at', '<=', $endDate);
        }

        $query->orderByDesc('updated_at');

        $totalKasKeluar = $query->count();
        // $kasMasuk = $query->with('kasMasukProduk.produk')->paginate(10);
        $kasKeluar = $query->paginate(10);

        $page = $request->input('page');

        // $produks = Produk::all();

        $lastKasMasukProduk = KasKeluar::where('kode', 'like', 'KSK24%')->orderBy('kode', 'desc')->first();
        $lastKode = $lastKasMasukProduk ? $lastKasMasukProduk->kode : "KSK24000";

        return Inertia::render('Kas/Pengeluaran/Index', [
            'kasKeluar' => $kasKeluar,
            'status' => session('status'),
            'searchTerm' => $searchTerm,
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'pageTerm' => $page,
            'lastKode' => $lastKode,
            'totalKasKeluar' => $totalKasKeluar
        ]);
    }

    public function indexLaporanPendapatan(Request $request)
    {
        $query = KasMasuk::query();

        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        if (!empty($startDate) && !empty($endDate)) {
            $startDate = date('Y-m-d 00:00:00', strtotime($startDate));
            $endDate = date('Y-m-d 23:59:59', strtotime($endDate));
            $query->whereBetween('updated_at', [$startDate, $endDate]);
        } elseif (!empty($startDate)) {
            $startDate = date('Y-m-d 00:00:00', strtotime($startDate));
            $query->where('updated_at', '>=', $startDate);
        } elseif (!empty($endDate)) {
            $endDate = date('Y-m-d 23:59:59', strtotime($endDate));
            $query->where('updated_at', '<=', $endDate);
        }

        $query->orderByDesc('updated_at');

        $totalKasMasuk = $query->count();

        $kasMasuk = $query->with('kasMasukMakanan.makanan')->get();

        return Inertia::render('Kas/Laporan/IndexLaporanPendapatan', [
            'kasMasuk' => $kasMasuk,
            'status' => session('status'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'totalKasMasuk' => $totalKasMasuk
        ]);
    }

    public function indexLaporanPengeluaran(Request $request)
    {
        $query = KasKeluar::query();

        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        if (!empty($startDate) && !empty($endDate)) {
            $startDate = date('Y-m-d 00:00:00', strtotime($startDate));
            $endDate = date('Y-m-d 23:59:59', strtotime($endDate));
            $query->whereBetween('updated_at', [$startDate, $endDate]);
        } elseif (!empty($startDate)) {
            $startDate = date('Y-m-d 00:00:00', strtotime($startDate));
            $query->where('updated_at', '>=', $startDate);
        } elseif (!empty($endDate)) {
            $endDate = date('Y-m-d 23:59:59', strtotime($endDate));
            $query->where('updated_at', '<=', $endDate);
        }

        $query->orderByDesc('updated_at');

        $kasKeluar = $query->get();

        return Inertia::render('Kas/Laporan/IndexLaporanPengeluaran', [
            'kasKeluar' => $kasKeluar,
            'status' => session('status'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
        ]);
    }

    public function indexLaporanBukuBesar(Request $request)
    {
        $query = Kas::query();

        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        if (!empty($startDate) && !empty($endDate)) {
            $startDate = date('Y-m-d 00:00:00', strtotime($startDate));
            $endDate = date('Y-m-d 23:59:59', strtotime($endDate));
            $query->whereBetween('updated_at', [$startDate, $endDate]);
        } elseif (!empty($startDate)) {
            $startDate = date('Y-m-d 00:00:00', strtotime($startDate));
            $query->where('updated_at', '>=', $startDate);
        } elseif (!empty($endDate)) {
            $endDate = date('Y-m-d 23:59:59', strtotime($endDate));
            $query->where('updated_at', '<=', $endDate);
        }

        $query->orderByDesc('updated_at');

        $kas = $query->with('kasKeluar', 'kasMasuk.kasMasukMakanan.makanan')->get();

        dd($kas);

        $page = $request->input('page');

        return Inertia::render('Kas/Laporan/IndexLaporanBukuBesar', [
            'kas' => $kas,
            'status' => session('status'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'pageTerm' => $page,
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
    public function storePendapatan(StoreKasRequest $request)
    {
        try {
            DB::beginTransaction();
            $metode_pembayaran = $request->input('metode_pembayaran');

            $kas = Kas::create([
                'kode' => $request->kode,
            ]);

            $kasMasuk = KasMasuk::create([
                'kode' => $request->kode,
                'metode_pembayaran' => $metode_pembayaran,
            ]);

            $errors = [];
            foreach ($request->input('makanans') as $index => $makanans) {
                $validator = Validator::make($makanans, [
                    'makanan_id' => 'required|integer|min:0',
                    'jumlah' => 'required|integer|min:0',
                ]);

                if ($validator->fails()) {
                    return back()->withInput()->withErrors($validator);
                } else {
                    KasMasukMakanan::create([
                        'kode' => $request->kode,
                        'makanan_id' => $makanans['makanan_id'],
                        'jumlah' => $makanans['jumlah'],
                    ]);
                }
            }

            if (!empty($errors)) {
                DB::rollback();
                return back()->withInput()->withErrors($errors); // Mengembalikan pesan kesalahan ke view
            }

            DB::commit();

            return redirect()->route('kasPendapatan.index')->with('message', sprintf(
                "Pendapatan dengan code %s berhasil dibuat!",
                $request->kode // Menggunakan $request->kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }

    public function storePesan(StoreKasRequest $request)
    {
        try {
            DB::beginTransaction();
            $metode_pembayaran = $request->input('metode_pembayaran');

            $kas = Kas::create([
                'kode' => $request->kode,
            ]);

            $kasMasuk = KasMasuk::create([
                'kode' => $request->kode,
                'metode_pembayaran' => $metode_pembayaran,
                'status_pembayaran' => $request->status,
            ]);

            $errors = [];
            foreach ($request->input('makanans') as $index => $makanans) {
                $validator = Validator::make($makanans, [
                    'makanan_id' => 'required|integer|min:0',
                    'jumlah' => 'required|integer|min:0',
                ]);

                if ($validator->fails()) {
                    return back()->withInput()->withErrors($validator);
                } else {
                    KasMasukMakanan::create([
                        'kode' => $request->kode,
                        'makanan_id' => $makanans['makanan_id'],
                        'jumlah' => $makanans['jumlah'],
                    ]);
                }
            }

            if (!empty($errors)) {
                DB::rollback();
                return back()->withInput()->withErrors($errors); // Mengembalikan pesan kesalahan ke view
            }

            DB::commit();

            return redirect()->route('kasPendapatan.index')->with('message', sprintf(
                "Pendapatan dengan code %s berhasil dibuat!",
                $request->kode // Menggunakan $request->kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }

    public function storePengeluaran(StoreKasRequest $request)
    {
        try {
            DB::beginTransaction();

            $kas = Kas::create([
                'kode' => $request->kode,
            ]);

            $kasMasuk = KasKeluar::create([
                'kode' => $request->kode,
                'nama' => $request->nama,
                'jumlah' => $request->jumlah,
                'total' => $request->total,
                'metode_pembayaran' => $request->metode_pembayaran,
                'keterangan' => $request->keterangan,
            ]);

            DB::commit();

            return redirect()->route('kasPengeluaran.index')->with('message', sprintf(
                "Pengeluaran dengan code %s berhasil dibuat!",
                $request->kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }


    public function store(StoreKasRequest $request)
    {
    }

    /**
     * Display the specified resource.
     */
    public function showPendapatan(Kas $kas, $id)
    {
        $kasMasuk = KasMasuk::with('kasMasukMakanan.makanan')
            ->where('id', 'like', $id)
            ->first();

        if (!$kasMasuk) {
            return response()->json(['message' => 'Kas masuk not found.'], 404);
        }
        return response()->json($kasMasuk);
    }

    public function showPengeluaran(Kas $kas, $id)
    {
        $kasKeluar = KasKeluar::where('id', 'like', $id)
            ->first();

        if (!$kasKeluar) {
            return response()->json(['message' => 'Produk not found.'], 404);
        }
        return response()->json($kasKeluar);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function updatePendapatan(Kas $kas, StoreKasRequest $request, $idKasMasuk)
    {
        try {
            DB::beginTransaction();
            $metode_pembayaran = $request->input('metode_pembayaran');

            KasMasuk::where('kode', $request->kode)->delete();

            $kasMasuk = KasMasuk::create([
                'kode' => $request->kode,
                'metode_pembayaran' => $metode_pembayaran,
            ]);

            KasMasukMakanan::where('kode', $request->kode)->delete();

            $errors = [];
            foreach ($request->input('makanans') as $index => $makanans) {
                $validator = Validator::make($makanans, [
                    'makanan_id' => 'required|integer|min:0',
                    'jumlah' => 'required|integer|min:0',
                ]);

                if ($validator->fails()) {
                    return back()->withInput()->withErrors($validator);
                } else {
                    KasMasukMakanan::create([
                        'kode' => $request->kode,
                        'makanan_id' => $makanans['makanan_id'],
                        'jumlah' => $makanans['jumlah'],
                    ]);
                }
            }

            if (!empty($errors)) {
                DB::rollback();
                return back()->withInput()->withErrors($errors); // Mengembalikan pesan kesalahan ke view
            }

            DB::commit();

            return redirect()->route('kasPendapatan.index')->with('message', sprintf(
                "Pendapatan dengan code %s berhasil diperbaharui!",
                $request->kode // Menggunakan $request->kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }

    public function updatePengeluaran(Kas $kas, StoreKasRequest $request, $idKasKeluar)
    {
        try {
            DB::beginTransaction();
            KasKeluar::where('id', $idKasKeluar)->delete();

            $kasKeluar = KasKeluar::create([
                'kode' => $request->kode,
                'nama' => $request->nama,
                'jumlah' => $request->jumlah,
                'total' => $request->total,
                'metode_pembayaran' => $request->metode_pembayaran,
                'keterangan' => $request->keterangan,
            ]);

            DB::commit();

            return redirect()->route('kasPengeluaran.index')->with('message', sprintf(
                "Pengeluaran dengan code %s berhasil diperbaharui!",
                $request->kode // Menggunakan $request->kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKasRequest $request, Kas $kas)
    {
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroyPendapatan(Kas $kas, $kode)
    {
        try {
            DB::beginTransaction();

            Kas::where('kode', $kode)->delete();

            KasMasuk::where('kode', $kode)->delete();

            KasMasukProduk::where('kode', $kode)->delete();

            DB::commit();

            return redirect()->route('kasPendapatan.index')->with('message', sprintf(
                "Pendapatan dengan code %s berhasil dihapus!",
                $kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage()]);
        }
    }

    public function destroyPengeluaran(Kas $kas, $kode)
    {
        try {
            DB::beginTransaction();

            Kas::where('kode', $kode)->delete();

            KasKeluar::where('kode', $kode)->delete();

            DB::commit();

            return redirect()->route('kasPengeluaran.index')->with('message', sprintf(
                "Pengeluaran dengan code %s berhasil dihapus!",
                $kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage()]);
        }
    }

    public function destroy(Kas $kas)
    {
        //
    }
}
