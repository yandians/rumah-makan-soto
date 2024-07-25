<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProduksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('produks')->insert([
            [
                'nama' => 'Soto Ayam',
                'harga' => 15000,
                'kategori' => 'Makanan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Soto Betawi',
                'harga' => 20000,
                'kategori' => 'Makanan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Soto Padang',
                'harga' => 20000,
                'kategori' => 'Makanan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Soto Malang',
                'harga' => 20000,
                'kategori' => 'Makanan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Soto Banjar',
                'harga' => 20000,
                'kategori' => 'Makanan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Es Teh Manis',
                'harga' => 5000,
                'kategori' => 'Minuman',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Es Jeruk',
                'harga' => 6000,
                'kategori' => 'Minuman',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Kopi Tubruk',
                'harga' => 7000,
                'kategori' => 'Minuman',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Kerupuk Udang',
                'harga' => 3000,
                'kategori' => 'Lainnya',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Gorengan Tahu',
                'harga' => 2000,
                'kategori' => 'Lainnya',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Gorengan Tempe',
                'harga' => 1500,
                'kategori' => 'Lainnya',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
