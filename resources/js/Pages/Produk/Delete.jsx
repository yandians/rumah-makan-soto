import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Inertia } from "@inertiajs/inertia";

export default function Delete({ show, onClose, idProduk }) {
    const { data, setData, put, errors, reset } = useForm({
        nama: "",
        kategori: "",
        harga: 0,
    });

    const [produk, setProduk] = useState(null);
    useEffect(() => {
        if (idProduk) {
            axios
                .get(`/produk/${idProduk}`)
                .then((response) => {
                    const ProdukData = response.data;
                    setProduk(ProdukData);

                    setData((prevData) => ({
                        ...prevData,
                        nama: ProdukData.nama,
                        kategori: ProdukData.kategori,
                        harga: ProdukData.harga,
                    }));
                })
                .catch((error) => {
                    console.error("Error fetching produk:", error);
                });
        }
    }, [idProduk]);

    const handleDelete = (idProduk) => {
        Inertia.delete(route("produk.destroy", idProduk));
    };

    return (
        <>
            <Modal show={show} onClose={onClose} size="md" popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apakah Anda yakin ingin menghapus produk {data.nama}{" "}
                            ?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => handleDelete(idProduk)}
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
