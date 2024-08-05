<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KasKeluar;

class KasKeluarSeeder extends Seeder
{
    public function run()
    {
        $items = [
            [
                'kode' => 'KSK24001',
                'nama' => 'Beras',
                'total' => 100000,
                'jumlah' => 2,
            ],
            [
                'kode' => 'KSK24002',
                'nama' => 'Gula',
                'total' => 50000,
                'jumlah' => 3,
            ],
            [
                'kode' => 'KSK24003',
                'nama' => 'Kopi Bubuk',
                'total' => 75000,
                'jumlah' => 1,
            ],
            [
                'kode' => 'KSK24004',
                'nama' => 'Susu Kental Manis',
                'total' => 30000,
                'jumlah' => 4,
            ],
            [
                'kode' => 'KSK24005',
                'nama' => 'Telur',
                'total' => 20000,
                'jumlah' => 5,
            ],
            [
                'kode' => 'KSK24006',
                'nama' => 'Garam',
                'total' => 15000,
                'jumlah' => 2,
            ],
            [
                'kode' => 'KSK24007',
                'nama' => 'Teh Celup',
                'total' => 25000,
                'jumlah' => 1,
            ],
            [
                'kode' => 'KSK24008',
                'nama' => 'Sabun Mandi',
                'total' => 20000,
                'jumlah' => 3,
            ],
            [
                'kode' => 'KSK24009',
                'nama' => 'Shampoo',
                'total' => 30000,
                'jumlah' => 2,
            ],
            [
                'kode' => 'KSK24010',
                'nama' => 'Pasta Gigi',
                'total' => 15000,
                'jumlah' => 1,
            ],
            [
                'kode' => 'KSK24011',
                'nama' => 'Tisu Toilet',
                'total' => 10000,
                'jumlah' => 2,
            ],
            [
                'kode' => 'KSK24012',
                'nama' => 'Masker',
                'total' => 5000,
                'jumlah' => 3,
            ],
        ];

        foreach ($items as $item) {
            KasKeluar::create($item);
        }
    }
}
