import React, { useState, useMemo, useEffect } from "react";
import { Button, Modal, TextInput, Label, Textarea  } from "flowbite-react";
import { HiOutlinePlusSm } from "react-icons/hi";
import { useForm } from "@inertiajs/react";
import Select from "react-select";
import KasPengeluaranSchema from "./KasPengeluaranSchema";

function formatRupiah(angka) {
    var formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });
    return formatter.format(angka);
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

export default function Edit({ idKasKeluar, show, onClose, }) {
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

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const parseRupiah = (value) => {
        return parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleRupiahInputChange = (event) => {
        const { value } = event.target;
        setData((prevData) => ({
            ...prevData,
            total: parseRupiah(value),
        }));
    };

    const handleReset = () => {
        reset();
    };

    const [validationErrors, setValidationErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await KasPengeluaranSchema.validate(data, { abortEarly: false });
            put(`/pengeluaran/${idKasKeluar}`, {
                onSuccess: () => {
                    reset();
                    onClose(false);
                },
            });
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
            <Modal
                show={show}
                onClose={onClose}
                size="4xl"
            >
                <Modal.Header>Edit Pengeluaran</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="nama" value="Nama Pengeluaran" />
                            </div>
                            <TextInput
                                theme={customTheme}
                                id="nama"
                                placeholder="Nama Pengeluaran"
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
                                <Label htmlFor="nama" value="Jumlah" />
                            </div>
                            <TextInput
                                type="number"
                                name="jumlah"
                                value={data.jumlah}
                                onChange={handleChange}
                                className="w-24 rounded-md"
                            />
                            {(validationErrors.jumlah || errors.jumlah) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.jumlah ||
                                        errors.najumlahma}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="nama" value="Total" />
                            </div>
                            <TextInput
                                theme={customTheme}
                                id="total"
                                type="text"
                                placeholder="Total"
                                value={formatRupiah(data.total)}
                                onChange={handleRupiahInputChange}
                                color={
                                    validationErrors.total || errors.total
                                        ? "failure"
                                        : "gray"
                                }
                            />
                            {(validationErrors.total || errors.total) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.total || errors.total}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="keterangan" value="Keterangan" />
                            </div>
                            <Textarea 
                                theme={customTheme}
                                id="keterangan"
                                placeholder="Keterangan"
                                onChange={(e) =>
                                    setData("keterangan", e.target.value)
                                }
                                value={data.keterangan}
                                required
                                color={
                                    validationErrors.keterangan || errors.keterangan
                                        ? "failure"
                                        : "gray"
                                }
                            />
                            {(validationErrors.keterangan || errors.keterangan) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.keterangan || errors.keterangan}
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-between">
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
                </Modal.Footer>
            </Modal>
        </>
    );
}
