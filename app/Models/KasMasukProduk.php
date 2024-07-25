<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KasMasukProduk extends Model
{
    use HasFactory;

    protected $table = 'kas_masuk_produk';

    protected $fillable = [
        'kode',
        'produk_id',
        'jumlah',
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class, 'produk_id', 'id');
    }

    public function kasMasuk()
    {
        return $this->belongsTo(KasMasuk::class, 'kode', 'kode');
    }
}
