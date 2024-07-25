import * as Yup from "yup";

const KasPendapatanSchema = Yup.object().shape({
    produks: Yup.array().of(
        Yup.object().shape({
            produk_id: Yup.number().required("Produk ID harus diisi"),
            jumlah: Yup.number().required("Jumlah harus diisi"),
        })
    ),
    metode_pembayaran: Yup.string().required("Metode pembayaran harus dipilih"),
});

export default KasPendapatanSchema;