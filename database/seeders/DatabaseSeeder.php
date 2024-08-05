<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Database\Seeders\PesanSeeder as SeedersPesanSeeder;
use Illuminate\Database\Seeder;
use PesanSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([MakanansSeeder::class]);
        $this->call([UsersTableSeeder::class]);
        $this->call([KasSeeder::class]);
        $this->call([KasKeluarSeeder::class]);
        $this->call([KasMasukSeeder::class]);
        $this->call([KasMasukMakananSeeder::class]);
        $this->call([SeedersPesanSeeder::class]);
    }
}