import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Inertia } from "@inertiajs/inertia";

export default function Delete({ show, onClose, idKasKeluar }) {
    const { data, setData, put, errors, reset } = useForm({
        kode: "",
        nama: "",
        jumlah: 0,
        total: 0,
        metode_pembayaran: "",
        keterangan: "",
    });

    const [kasKeluar, setKasKeluar] = useState(null);

    useEffect(() => {
        if (idKasKeluar) {
            axios
                .get(`/pengeluaran/${idKasKeluar}`)
                .then((response) => {
                    const kasKeluarData = response.data;
                    setKasKeluar(kasKeluarData);

                    setData({
                        ...data,
                        kode: kasKeluarData.kode,
                        nama: kasKeluarData.nama,
                        jumlah: kasKeluarData.jumlah,
                        total: kasKeluarData.total,
                        metode_pembayaran: kasKeluarData.metode_pembayaran,
                        keterangan: kasKeluarData.keterangan || "",

                    });
                })
                .catch((error) => {
                    console.error("Error fetching produk:", error);
                });
        }
    }, [idKasKeluar]);

    const handleDelete = (kode) => {
        Inertia.delete(route("kasPengeluaran.destroy", kode));
    };

    return (
        <>
            <Modal show={show} onClose={onClose} size="md" popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apakah Anda yakin ingin menghapus Pengeluaran dengan kode {data.kode}{" "}
                            ?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => handleDelete(data.kode)}
                            >
                                Yakin
                            </Button>
                            <Button color="gray" onClick={onClose}>
                                Tidak
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
