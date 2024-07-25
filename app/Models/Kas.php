<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kas extends Model
{
    use HasFactory;

    protected $table = 'kas';

    protected $fillable = ['kode'];

    public function kasMasuk()
    {
        return $this->hasOne(KasMasuk::class, 'kode', 'kode');
    }
    public function kasKeluar()
    {
        return $this->hasOne(KasKeluar::class, 'kode', 'kode');
    }
}
