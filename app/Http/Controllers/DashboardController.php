<?php

namespace App\Http\Controllers;

use App\Models\KasKeluar;
use App\Models\KasMasuk;
use App\Models\Kas;
use App\Models\KasMasukMakanan;
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

        $totalKasMasukHariIni = KasMasukMakanan
        ::whereDate('kas_masuk_makanan.updated_at', $today)
            ->join('makanans', 'kas_masuk_makanan.makanan_id', '=', 'makanans.id')
            ->selectRaw('SUM(kas_masuk_makanan.jumlah * makanans.harga) as total')
            ->value('total');

        $totalKasMasukMingguIni = KasMasukMakanan
        ::whereBetween('kas_masuk_makanan.updated_at', [$startOfWeek, $endOfToday])
            ->join('makanans', 'kas_masuk_makanan.makanan_id', '=', 'makanans.id')
            ->selectRaw('SUM(kas_masuk_makanan.jumlah * makanans.harga) as total')
            ->value('total');

        $totalKasMasukBulanIni = KasMasukMakanan
        ::whereBetween('kas_masuk_makanan.updated_at', [$startOfMonth, $endOfToday])
            ->join('makanans', 'kas_masuk_makanan.makanan_id', '=', 'makanans.id')
            ->selectRaw('SUM(kas_masuk_makanan.jumlah * makanans.harga) as total')
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
