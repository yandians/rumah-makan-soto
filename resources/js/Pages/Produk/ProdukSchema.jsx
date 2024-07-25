import * as Yup from "yup";

const ProdukSchema = Yup.object().shape({
    nama: Yup.string().required("Nama produk harus diisi"),
    kategori: Yup.string().required("Kategori produk harus diisi"),
    harga: Yup.number()
        .required("Harga produk harus diisi")
        .positive("Harga harus lebih dari Rp 0")
        .integer("Harga harus berupa bilangan bulat"),
});

export default ProdukSchema;
