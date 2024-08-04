<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DaftarMenuController extends Controller
{
    public function index()
    {
        $makanans = Produk::all();

        return Inertia::render('DaftarMakanan', [
            'makanans' => $makanans
        ]);
    }
}