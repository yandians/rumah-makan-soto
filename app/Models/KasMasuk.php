<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KasMasuk extends Model
{
    use HasFactory;

    protected $table = 'kas_masuk';

    protected $fillable = [
        'kode',
        'metode_pembayaran',
    ];

    public function kas()
    {
        return $this->belongsTo(Kas::class, 'kode', 'kode');
    }
    
    public function kasMasukProduk()
    {
        return $this->hasMany(KasMasukProduk::class, 'kode', 'kode');
    }
}
