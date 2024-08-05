import * as Yup from "yup";

const MakananSchema = Yup.object().shape({
    nama: Yup.string()
        .max(50, "Nama makanan tidak boleh lebih dari 50 karakter")
        .required("Nama makanan harus diisi"),
    kategori: Yup.string()
        .max(30, "Kategori makanan tidak boleh lebih dari 30 karakter")
        .required("Kategori makanan harus diisi"),
    harga: Yup.number()
        .required("Harga makanan harus diisi")
        .positive("Harga harus lebih dari Rp 0")
        .integer("Harga harus berupa bilangan bulat"),
    image: Yup.mixed().required("Gambar makanan harus diunggah"),
    deskripsi: Yup.string().required("Deskripsi makanan harus diisi"),
});

export default MakananSchema;
