<?php

namespace Database\Seeders;

use App\Models\KasMasukProduk;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KasMasukProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'kode' => 'KSP24001',
                'makanan_id' => 1,
                'jumlah' => 5,
            ],
            [
                'kode' => 'KSP24001',
                'makanan_id' => 2,
                'jumlah' => 3,
            ],
            [
                'kode' => 'KSP24002',
                'makanan_id' => 3,
                'jumlah' => 10,
            ],
            [
                'kode' => 'KSP24003',
                'makanan_id' => 4,
                'jumlah' => 7,
            ],
        ];

        foreach ($items as $item) {
            KasMasukProduk::create($item);
        }
    }
}
