<?php

namespace Database\Seeders;

use App\Models\Kas;
use App\Models\KasMasuk;
use App\Models\KasMasukMakanan;
use App\Models\Pesan;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class PesanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Seed Kas
        $kasData = [
            [
                'kode' => 'PSN001',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode' => 'KSP24004',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];
        Kas::insert($kasData);

        // Seed Kas Masuk
        $kasMasukData = [
            [
                'kode' => 'PSN001',
                'metode_pembayaran' => $faker->randomElement(['Tunai', 'Debit']),
                'status' => 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode' => 'KSP24004',
                'metode_pembayaran' => $faker->randomElement(['Tunai', 'Debit']),
                'status' => $faker->randomElement(['Completed']),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];
        KasMasuk::insert($kasMasukData);

        // Seed Kas Masuk Makanan
        $kasMasukMakananData = [
            [
                'kode' => 'KSP24004',
                'makanan_id' => 1,
                'jumlah' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];
        KasMasukMakanan::insert($kasMasukMakananData);

        // Seed Pesans
        $pesansData = [
            [
                'kode' => 'PSN001',
                'nama' => $faker->name,
                'makanan_id' => $faker->numberBetween(1, 5),
                'jumlah' => $faker->numberBetween(1, 100),
                'status' => $faker->randomElement(['Pending']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode' => 'KSP24004',
                'nama' => 'Joko',
                'makanan_id' => 1,
                'jumlah' => 1,
                'status' => $faker->randomElement(['Completed']),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];
        Pesan::insert($pesansData);
    }
}
