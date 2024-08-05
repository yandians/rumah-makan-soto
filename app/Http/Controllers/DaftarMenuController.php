<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Makanan;
use Inertia\Inertia;

class DaftarMenuController extends Controller
{
    public function index()
    {
        $makanans = Makanan::all();

        return Inertia::render('DaftarMakanan', [
            'makanans' => $makanans
        ]);
    }
}