<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KasKeluar extends Model
{
    use HasFactory;

    protected $table = 'kas_keluar';

    protected $fillable = [
        'kode',
        'nama',
        'jumlah',
        'total',
        'metode_pembayaran',
        'keterangan',
    ];

    public function kas()
    {
        return $this->belongsTo(Kas::class, 'kode', 'kode');
    }
}
