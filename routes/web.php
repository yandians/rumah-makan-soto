<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DaftarMenuController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KasController;
use App\Http\Controllers\MakananController;
use App\Http\Controllers\PesanController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/', function () {
//     return Inertia::location(route('login'));
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'pelanggan'])
    ->name('dashboard');

    Route::get('/generate', function(){
        \Illuminate\Support\Facades\Artisan::call('storage:link');
        echo 'ok';
     });

     Route::get('/generate-link', function () {
        $targetFolder = base_path().'/storage/app/public';
        $linkFolder = $_SERVER['DOCUMENT_ROOT'].'/storage';
        symlink($targetFolder, $linkFolder);
     });

Route::middleware(['auth', 'pegawai'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::get('/pendapatan', [KasController::class, 'indexPendapatan'])->name('kasPendapatan.index');
    Route::post('/pendapatan', [KasController::class, 'storePendapatan'])->name('kasPendapatan.store');
    Route::get('/pendapatan/{id}', [KasController::class, 'showPendapatan'])->name('kasPendapatan.show');;
    Route::put('/pendapatan/{pendapatan}', [KasController::class, 'updatePendapatan'])->name('kasPendapatan.update');
    Route::delete('/pendapatan/{kode}', [KasController::class, 'destroyPendapatan'])->name('kasPendapatan.destroy');

    Route::get('/pengeluaran', [KasController::class, 'indexPengeluaran'])->name('kasPengeluaran.index');
    Route::post('/pengeluaran', [KasController::class, 'storePengeluaran'])->name('kasPengeluaran.store');
    Route::get('/pengeluaran/{id}', [KasController::class, 'showPengeluaran'])->name('kasPengeluaran.show');;
    Route::put('/pengeluaran/{pengeluaran}', [KasController::class, 'updatePengeluaran'])->name('kasPengeluaran.update');
    Route::delete('/pengeluaran/{kode}', [KasController::class, 'destroyPengeluaran'])->name('kasPengeluaran.destroy');

    Route::get('/pesan', [PesanController::class, 'index'])->name('pesan.index');
    Route::post('/pesan', [PesanController::class, 'store'])->name('pesan.store');
    Route::get('/pesan/{id}', [PesanController::class, 'show'])->name('pesan.show');;
    Route::put('/pesan/{pesan}', [PesanController::class, 'update'])->name('pesan.update');
    Route::delete('/pesan/{kode}', [PesanController::class, 'destroy'])->name('pesan.destroy');

    Route::get('/kas/create', [KasController::class, 'create'])->name('kas.create');
    Route::post('/kas', [KasController::class, 'store'])->name('kas.store');
    Route::get('/kas/{id}', [KasController::class, 'show'])->name('kas.show');;
    Route::get('/kas/{kas}/edit', [KasController::class, 'edit'])->name('kas.edit');
    Route::put('/kas/{kas}', [KasController::class, 'update'])->name('kas.update');
    Route::delete('/kas/{kas}', [KasController::class, 'destroy'])->name('kas.destroy');
});

Route::middleware(['auth', 'owner'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/admin/create', [AdminController::class, 'create'])->name('admin.create');
    Route::post('/admin', [AdminController::class, 'store'])->name('admin.store');
    Route::get('/admin/{id}', [AdminController::class, 'show'])->name('admin.show');;
    Route::get('/admin/{admin}/edit', [AdminController::class, 'edit'])->name('admin.edit');
    Route::put('/admin/{user}', [AdminController::class, 'update'])->name('admin.update');
    Route::delete('/admin/{user}', [AdminController::class, 'destroy'])->name('admin.destroy');

    Route::get('/produk', [ProdukController::class, 'index'])->name('produk.index');
    Route::get('/produk/create', [ProdukController::class, 'create'])->name('produk.create');
    Route::post('/produk', [ProdukController::class, 'store'])->name('produk.store');
    Route::get('/produk/{id}', [ProdukController::class, 'show'])->name('produk.show');;
    Route::get('/produk/{produk}/edit', [ProdukController::class, 'edit'])->name('produk.edit');
    Route::put('/produk/{produk}', [ProdukController::class, 'update'])->name('produk.update');
    Route::delete('/produk/{produk}', [ProdukController::class, 'destroy'])->name('produk.destroy');

    Route::get('/makanan', [MakananController::class, 'index'])->name('makanan.index');
    Route::get('/makanan/create', [MakananController::class, 'create'])->name('makanan.create');
    Route::post('/makanan', [MakananController::class, 'store'])->name('makanan.store');
    Route::get('/makanan/{id}', [MakananController::class, 'show'])->name('makanan.show');;
    Route::get('/makanan/{makanan}/edit', [MakananController::class, 'edit'])->name('makanan.edit');
    Route::post('/makanan/{makanan}', [MakananController::class, 'update'])->name('makanan.update');
    Route::delete('/makanan/{makanan}', [MakananController::class, 'destroy'])->name('makanan.destroy');
    
    Route::get('/laporan/pendapatan', [KasController::class, 'indexLaporanPendapatan'])->name('kasLaporanPendapatan.index');
    Route::get('/laporan/pengeluaran', [KasController::class, 'indexLaporanPengeluaran'])->name('kasLaporanPengeluaran.index');
    Route::get('/laporan/bukubesar', [KasController::class, 'indexLaporanBukuBesar'])->name('kasLaporanBukuBesar.index');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/daftar-menu', [DaftarMenuController::class, 'index'])->name('daftarMenu.index');
});


require __DIR__ . '/auth.php';