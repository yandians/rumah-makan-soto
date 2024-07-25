<?php

namespace App\Http\Controllers;

use App\Models\KasKeluar;
use App\Models\KasMasuk;
use App\Models\KasMasukProduk;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today('Asia/Jakarta');

        $startOfWeek = $today->copy()->startOfWeek();
        $startOfMonth = $today->copy()->startOfMonth();
        $endOfToday = $today->copy()->endOfDay();

        $totalKasMasukHariIni = KasMasukProduk::whereDate('kas_masuk_produk.updated_at', $today)
            ->join('produks', 'kas_masuk_produk.produk_id', '=', 'produks.id')
            ->selectRaw('SUM(kas_masuk_produk.jumlah * produks.harga) as total')
            ->value('total');

        $totalKasMasukMingguIni = KasMasukProduk::whereBetween('kas_masuk_produk.updated_at', [$startOfWeek, $endOfToday])
            ->join('produks', 'kas_masuk_produk.produk_id', '=', 'produks.id')
            ->selectRaw('SUM(kas_masuk_produk.jumlah * produks.harga) as total')
            ->value('total');

        $totalKasMasukBulanIni = KasMasukProduk::whereBetween('kas_masuk_produk.updated_at', [$startOfMonth, $endOfToday])
            ->join('produks', 'kas_masuk_produk.produk_id', '=', 'produks.id')
            ->selectRaw('SUM(kas_masuk_produk.jumlah * produks.harga) as total')
            ->value('total');


        $totalUangKeluarHariIni = KasKeluar::whereDate('updated_at', $today)->sum('total');
        $totalUangKeluarMingguIni = KasKeluar::whereBetween('updated_at', [$startOfWeek, $endOfToday])->sum('total');
        $totalUangKeluarBulanIni = KasKeluar::whereBetween('updated_at', [$startOfMonth, $endOfToday])->sum('total');


        return Inertia::render('Dashboard', [
            'totalKasMasukHariIni' => $totalKasMasukHariIni,
            'totalKasMasukMingguIni' => $totalKasMasukMingguIni,
            'totalKasMasukBulanIni' => $totalKasMasukBulanIni,
            'totalUangKeluarHariIni' => $totalUangKeluarHariIni,
            'totalUangKeluarMingguIni' => $totalUangKeluarMingguIni,
            'totalUangKeluarBulanIni' => $totalUangKeluarBulanIni,
        ]);
    }
}
