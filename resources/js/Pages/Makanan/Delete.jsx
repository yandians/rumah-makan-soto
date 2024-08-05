import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Inertia } from "@inertiajs/inertia";

export default function Delete({ show, onClose, idMakanan }) {
    const { data, setData, post, errors, processing, reset } = useForm({
        nama: "",
        kategori: "",
        harga: 0,
        image: null,
        deskripsi: "",
    });

    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [previewImage, setPreviewImage] = useState(data.image);

    const [makanan, setMakanan] = useState(null);
    useEffect(() => {
        if (idMakanan) {
            axios
                .get(`/makanan/${idMakanan}`)
                .then((response) => {
                    const MakananData = response.data;
                    setMakanan(MakananData);
                    setPreviewImage(MakananData.image || null);
                    setData({
                        nama: MakananData.nama,
                        kategori: MakananData.kategori,
                        harga: MakananData.harga,
                        image: null,
                        deskripsi: MakananData.deskripsi,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching produk:", error);
                });
        }
    }, [idMakanan]);


    const handleDelete = (idMakanan) => {
        Inertia.delete(route("produk.destroy", idMakanan));
    };

    return (
        <>
            <Modal show={show} onClose={onClose} size="md" popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apakah Anda yakin ingin menghapus {data.nama}{" "}
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
