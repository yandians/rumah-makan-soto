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
    
    public function kasMasukMakanan()
    {
        return $this->hasMany(KasMasukMakanan::class, 'kode', 'kode');
    }
}
