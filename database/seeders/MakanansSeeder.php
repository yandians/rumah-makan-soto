<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;


class MakanansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        DB::table('makanans')->insert([
            [
                'nama' => 'Soto Ayam',
                'harga' => 15000,
                'kategori' => 'Makanan',
                'image' => '/storage/images/soto.png',
                'deskripsi' => 'Soto ayam dengan kuah kuning yang gurih dan segar, dilengkapi dengan potongan ayam dan sayuran.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Soto Betawi',
                'harga' => 20000,
                'kategori' => 'Makanan',
                'image' => '/storage/images/soto_betawi.png',
                'deskripsi' => 'Soto Betawi khas dengan kuah santan yang kaya rasa, disajikan dengan daging sapi dan jeroan.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Soto Jogja',
                'harga' => 20000,
                'kategori' => 'Makanan',
                'image' => '/storage/images/soto_jogja.png',
                'deskripsi' => 'Soto Jogja yang terkenal dengan cita rasa manis dan gurih, dilengkapi dengan potongan daging sapi.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Soto Makasar',
                'harga' => 20000,
                'kategori' => 'Makanan',
                'image' => '/storage/images/soto_makasar.png',
                'deskripsi' => 'Soto Makasar dengan kuah kental dan bumbu rempah yang khas, dilengkapi dengan potongan daging sapi.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Soto Malang',
                'harga' => 20000,
                'kategori' => 'Makanan',
                'image' => '/storage/images/soto_malang.png',
                'deskripsi' => 'Soto Malang dengan kuah bening dan cita rasa segar, dilengkapi dengan potongan ayam dan sayuran.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Soto Padang',
                'harga' => 5000,
                'kategori' => 'Makanan',
                'image' => '/storage/images/soto_padang.png',
                'deskripsi' => 'Soto Padang dengan kuah bening dan cita rasa gurih, disajikan dengan daging sapi dan perkedel.',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
