import * as Yup from "yup";

const KasPengeluaranSchema = Yup.object().shape({
    kode: Yup.string().required("Kode harus diisi"),
    nama: Yup.string().required("Nama harus diisi"),
    jumlah: Yup.number()
        .required("Jumlah harus diisi")
        .moreThan(0, "Jumlah harus lebih dari 0"),
    total: Yup.number()
        .required("Total harus diisi")
        .moreThan(0, "Total harus lebih dari 0"),
    metode_pembayaran: Yup.string().required("Metode pembayaran harus dipilih"),
    keterangan: Yup.string().nullable(),
});

export default KasPengeluaranSchema;