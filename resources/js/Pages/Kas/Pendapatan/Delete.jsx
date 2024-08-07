import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Inertia } from "@inertiajs/inertia";

export default function Delete({ show, onClose, idKasMasuk }) {
    const { data, setData, put, errors, reset } = useForm({
        kode: "",
        produks: [], // Pastikan produks diinisialisasi dengan array kosong
        metode_pembayaran: "",
    });

    const [kasMasuk, setKasMasuk] = useState(null);
    console.log("id",idKasMasuk)

    useEffect(() => {
        if (idKasMasuk) {
            axios
                .get(`/pendapatan/${idKasMasuk}`)
                .then((response) => {
                    const kasMasukData = response.data;
                    setKasMasuk(kasMasukData);

                    setData({
                        ...data,
                        kode: kasMasukData.kode,
                        produks: kasMasukData.kas_masuk_produk || [],
                        metode_pembayaran: kasMasukData.metode_pembayaran,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching produk:", error);
                });
        }
    }, [idKasMasuk]); // Tambahkan idKasMasuk ke dependencies

    const handleDelete = (kode) => {
        Inertia.delete(route("kasPendapatan.destroy", kode));
    };

    return (
        <>
            <Modal show={show} onClose={onClose} size="md" popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apakah Anda yakin ingin menghapus pendapatan dengan kode {data.kode}{" "}
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
