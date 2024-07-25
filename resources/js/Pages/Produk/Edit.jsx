import { Button, Modal, TextInput, Label, Select } from "flowbite-react";
import { useRef, useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { HiOutlinePlusSm } from "react-icons/hi";
import ProdukSchema from "./ProdukSchema";

function formatRupiah(angka) {
    let cleaned = ("" + angka).replace(/\D/g, "");
    let formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(parseInt(cleaned));

    return formatted;
}

const customTheme = {
    field: {
        input: {
            colors: {
                gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
                failure:
                    "border-red-500 bg-gray-50 text-gray-900 placeholder-gray-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500",
            },
        },
    },
};

export default function Edit({ show, onClose, idProduk }) {
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
    
    const handleReset = () => {
        reset();
    };

    const [validationErrors, setValidationErrors] = useState({});

    const parseRupiah = (value) => {
        return parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    };

    const handleRupiahInputChange = (event) => {
        const { value } = event.target;
        setData((prevData) => ({
            ...prevData,
            harga: parseRupiah(value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ProdukSchema.validate(data, { abortEarly: false });
           put(`/produk/${idProduk}`,
                {
                    onSuccess: () => {
                        reset();
                        onClose();
                    },
                }
            );
        } catch (err) {
            if (err.inner) {
                const newErrors = {};
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
                setValidationErrors(newErrors);
            }
        }
    };

    return (
        <>
            <Modal show={show} onClose={onClose}>
                <Modal.Header>Tambah Produk</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="nama" value="Nama Produk" />
                            </div>
                            <TextInput
                                theme={customTheme}
                                id="nama"
                                placeholder="Nama Produk"
                                onChange={(e) =>
                                    setData("nama", e.target.value)
                                }
                                value={data.nama}
                                required
                                color={
                                    validationErrors.nama || errors.nama
                                        ? "failure"
                                        : "gray"
                                }
                            />
                            {(validationErrors.nama || errors.nama) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.nama || errors.nama}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="kategori" value="Kategori" />
                            </div>
                            <Select
                                id="kategori"
                                onChange={(e) =>
                                    setData("kategori", e.target.value)
                                }
                                value={data.kategori}
                                required
                            >
                                <option>Pilih Kategori</option>
                                <option value="makanan">Makanan</option>
                                <option value="minuman">Minuman</option>
                                <option value="lainnya">Lainnya</option>
                            </Select>
                            {(validationErrors.kategori || errors.kategori) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.kategori ||
                                        errors.kategori}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="harga" value="Harga" />
                            </div>
                            <TextInput
                                theme={customTheme}
                                id="harga"
                                type="text"
                                placeholder="Harga"
                                value={formatRupiah(data.harga)}
                                onChange={handleRupiahInputChange}
                                color={
                                    validationErrors.harga || errors.harga
                                        ? "failure"
                                        : "gray"
                                }
                            />
                            {(validationErrors.harga || errors.harga) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.harga || errors.harga}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end w-full">
                            <Button
                                onClick={handleReset}
                                color="failure"
                                className="mr-2"
                            >
                                Reset
                            </Button>
                            <Button onClick={handleSubmit} color="success">
                                Simpan
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
