import * as Yup from "yup";

const KasPendapatanSchema = Yup.object().shape({
    makanans: Yup.array().of(
        Yup.object().shape({
            makanan_id: Yup.number().required("Produk ID harus diisi"),
            jumlah: Yup.number().required("Jumlah harus diisi"),
        })
    ),
    metode_pembayaran: Yup.string().required("Metode pembayaran harus dipilih"),
});

export default KasPendapatanSchema;