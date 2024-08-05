<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pesan extends Model
{
    use HasFactory;
    protected $table = 'pesans';

    protected $fillable = [
        'kode',
        'nama',
        'makanan_id',
        'jumlah',
        'status'
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
