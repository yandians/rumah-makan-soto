<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePesanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
{
    return [
        // 'pesan' => 'required|array',
        // 'pesan.*.nama' => 'required|string|max:255',
        // 'pesan.*.produk_id' => 'required|exists:makanans,id',
        // 'pesan.*.jumlah' => 'required|integer|min:1',
        'pesan.*.status' => 'required|string|in:Menunggu Pembayaran,Sudah Dibayar,Sedang Diproses,Selesai,Cencel',
    ];
}

public function messages()
{
    return [
        // 'pesan.required' => 'Pesan wajib diisi.',
        // 'pesan.array' => 'Pesan harus berupa array.',
        // 'pesan.*.nama.required' => 'Nama wajib diisi.',
        // 'pesan.*.nama.string' => 'Nama harus berupa teks.',
        // 'pesan.*.nama.max' => 'Nama maksimal 255 karakter.',
        // 'pesan.*.produk_id.required' => 'ID produk wajib diisi.',
        // 'pesan.*.produk_id.exists' => 'ID produk tidak ditemukan.',
        // 'pesan.*.jumlah.required' => 'Jumlah wajib diisi.',
        // 'pesan.*.jumlah.integer' => 'Jumlah harus berupa angka.',
        // 'pesan.*.jumlah.min' => 'Jumlah minimal adalah 1.',
        'status.required' => 'Status wajib diisi.',
        'status.string' => 'Status harus berupa teks.',
        'status.in' => 'Status harus salah satu dari: Menunggu Pembayaran,Sudah Dibayar,Sedang Diproses,Selesai,Cencel.',
    ];
}

}
