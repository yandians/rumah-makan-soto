<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kas_keluar', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 30)->unique();
            $table->string('nama', 50);
            $table->integer('jumlah');
            $table->integer('total');
            $table->string('metode_pembayaran', 10);
            $table->string('keterangan', 100)->nullable();
            $table->timestamps();

            $table->foreign('kode')->references('kode')->on('kas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kas_keluar');
    }
};
