<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMakananRequest extends FormRequest
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
            'nama' => 'required|string|max:50|unique:makanans',
            'kategori' => 'required|string|max:30',
            'harga' => 'required|integer|min:1',
            'image' => 'required',
            'deskripsi' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'nama.required' => 'Nama makanan wajib diisi.',
            'nama.string' => 'Nama makanan harus berupa teks.',
            'nama.max' => 'Nama makanan tidak boleh lebih dari 50 karakter.',
            'nama.unique' => 'Nama makanan sudah ada.',
            'kategori.required' => 'Kategori makanan wajib diisi.',
            'kategori.string' => 'Kategori makanan harus berupa teks.',
            'kategori.max' => 'Kategori makanan tidak boleh lebih dari 30 karakter.',
            'harga.required' => 'Harga makanan wajib diisi.',
            'harga.integer' => 'Harga makanan harus berupa angka.',
            'harga.min' => 'Harga makanan tidak boleh kurang dari 1.',
            'image.required' => 'URL gambar makanan wajib diisi.',
            'deskripsi.required' => 'Deskripsi makanan wajib diisi.',
            'deskripsi.string' => 'Deskripsi makanan harus berupa teks.',
        ];
    }
}
