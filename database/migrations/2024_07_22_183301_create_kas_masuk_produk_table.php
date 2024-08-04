<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKasMasukProdukTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('kas_masuk_produk', function (Blueprint $table) {
            $table->id();
            $table->string('kode');
            $table->unsignedBigInteger('makanan_id');
            $table->integer('jumlah');
            $table->timestamps();

            $table->foreign('makanan_id')->references('id')->on('makanans')->onDelete('cascade');
            $table->foreign('kode')->references('kode')->on('kas_masuk')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('kas_masuk_produk');
    }
}
