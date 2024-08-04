<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KasMasukMakanan extends Model
{
    use HasFactory;
    protected $table = 'kas_masuk_makanan';

    protected $fillable = [
        'kode',
        'makanan_id',
        'jumlah',
    ];

    public function makanan()
    {
        return $this->belongsTo(Makanan::class, 'makanan_id', 'id');
    }

    public function kasMasuk()
    {
        return $this->belongsTo(KasMasuk::class, 'kode', 'kode');
    }
}