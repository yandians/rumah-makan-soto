<?php

namespace Database\Seeders;

use App\Models\Kas;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['kode' => 'KSK24001'],
            ['kode' => 'KSK24002'],
            ['kode' => 'KSK24003'],
            ['kode' => 'KSK24004'],
            ['kode' => 'KSK24005'],
            ['kode' => 'KSK24006'],
            ['kode' => 'KSK24007'],
            ['kode' => 'KSK24008'],
            ['kode' => 'KSK24009'],
            ['kode' => 'KSK24010'],
            ['kode' => 'KSK24011'],
            ['kode' => 'KSK24012'],
            ['kode' => 'KSP24001'],
            ['kode' => 'KSP24002'],
            ['kode' => 'KSP24003'],
        ];

        foreach ($items as $item) {
            Kas::create($item);
        }
    }
}
