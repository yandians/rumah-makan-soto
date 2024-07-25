<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProdukRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255|unique:produks',
            'kategori' => 'required|string|max:255',
            'harga' => 'required|numeric|min:0',
        ];
    }

    public function messages()
    {
        return [
            'nama.required' => 'Nama produk wajib diisi.',
            'nama.string' => 'Nama produk harus berupa teks.',
            'nama.max' => 'Nama produk tidak boleh lebih dari :max karakter.',
            'nama.unique' => 'Nama produk sudah ada dalam basis data.',


            'kategori.required' => 'Kategori produk wajib diisi.',
            'kategori.string' => 'Kategori produk harus berupa teks.',
            'kategori.max' => 'Kategori produk tidak boleh lebih dari :max karakter.',

            'harga.required' => 'Harga produk wajib diisi.',
            'harga.numeric' => 'Harga produk harus berupa angka.',
            'harga.min' => 'Harga produk tidak boleh kurang dari :min.',
        ];
    }
}
