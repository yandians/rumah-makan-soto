<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Makanan extends Model
{
    use HasFactory;
    protected $table = 'makanans';


    protected $fillable = [
        'nama',
        'kategori',
        'harga',
        'image',
        'deskripsi'
    ];

    public function kasMasukProduk()
    {
        return $this->hasMany(KasMasukProduk::class);
    }
}
