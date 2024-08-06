import React, { useState, useMemo, useEffect } from "react";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { HiOutlinePlusSm } from "react-icons/hi";
import { useForm } from "@inertiajs/react";
import Select from "react-select";
import KasPendapatanSchema from "./KasPendapatanSchema";
import axios from "axios"; // Import axios untuk mengambil data

function formatRupiah(angka) {
    var formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });
    return formatter.format(angka);
}

export default function Edit({
    makanans,
    lastKode,
    show,
    onClose,
    idKasMasuk,
}) {
    const { data, setData, put, errors, reset } = useForm({
        kode: "",
        makanans: [],
        kas_masuk_pesan: [],
        metode_pembayaran: "",
        status: "",
    });

    const [kasMasuk, setKasMasuk] = useState(null);

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
                        makanans: kasMasukData.kas_masuk_makanan || [],
                        kas_masuk_pesan: kasMasukData.kas_masuk_pesan || [],
                        metode_pembayaran: kasMasukData.metode_pembayaran,
                        status: kasMasukData.status,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching produk:", error);
                });
        }
    }, [idKasMasuk]);

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [selectedProduk, setSelectedProduk] = useState(null);
    const [jumlah, setJumlah] = useState(1);

    const handleToggleModal = () => {
        setOpenModalCreate(!openModalCreate);
    };

    const parseRupiah = (value) => {
        return parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    };

    const handleSelectProduk = (selectedOption) => {
        setSelectedProduk(selectedOption);
    };

    const handleAddProduk = () => {
        if (selectedProduk) {
            const newProduk = {
                makanan_id: selectedProduk.value,
                nama: selectedProduk.label,
                harga: selectedProduk.harga,
                jumlah: jumlah,
            };
            setData({ ...data, makanans: [...data.makanans, newProduk] });
            setSelectedProduk(null);
            setJumlah(1);
        }
    };

    const handleRemoveProduk = (index) => {
        const newProduks = [...data.makanans];
        newProduks.splice(index, 1);
        setData({ ...data, makanans: newProduks });
    };

    const handleReset = () => {
        reset();
        setSelectedProduk(null);
        setJumlah(1);
    };

    const [validationErrors, setValidationErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await KasPendapatanSchema.validate(data, { abortEarly: false });
            put(`/pendapatan/${idKasMasuk}`, {
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

    const optionsProduk = useMemo(() => {
        return makanans
            .filter((makanan) => {
                return !data.makanans.some((p) => p.makanan_id === makanan.id);
            })
            .map((makanan) => ({
                value: makanan.id,
                label: makanan.nama,
                harga: makanan.harga,
            }));
    }, [makanans, data.makanans]);

    const totalPembayaran = useMemo(() => {
        if (data.makanans.length > 1) {
            return data.makanans.reduce((total, makanan) => {
                const hargaProduk = makanan.harga
                    ? makanan.harga
                    : makanan.makanan.harga * makanan.jumlah;
                return total + hargaProduk;
            }, 0);
        } else {
            return data.kas_masuk_pesan.reduce((total, makanan) => {
                const hargaProduk = makanan.harga
                    ? makanan.harga
                    : makanan.makanan.harga * makanan.jumlah;
                return total + hargaProduk;
            }, 0);
        }
    }, [data.makanans, data.kas_masuk_pesan]);

    return (
        <>
            <Modal show={show} onClose={onClose} size="4xl">
                <Modal.Header>Tambah Pendapatan</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <Label htmlFor="produk" value="Pilih Produk" />
                            <div className="ml-4 flex-1">
                                <Select
                                    id="produk"
                                    value={selectedProduk}
                                    onChange={handleSelectProduk}
                                    options={optionsProduk}
                                    placeholder="Pilih produk..."
                                    isClearable
                                    className="w-full"
                                />
                            </div>
                            {(validationErrors.nama || errors.nama) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.nama || errors.nama}
                                </div>
                            )}
                        </div>

                        {selectedProduk && (
                            <div className="mt-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama Produk
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Harga
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jumlah
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {selectedProduk.label}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatRupiah(
                                                    selectedProduk.harga
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <TextInput
                                                    type="number"
                                                    value={jumlah}
                                                    onChange={(e) =>
                                                        setJumlah(
                                                            parseInt(
                                                                e.target.value,
                                                                10
                                                            )
                                                        )
                                                    }
                                                    className="w-24 px-2 py-1 border rounded-md"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatRupiah(
                                                    selectedProduk.harga *
                                                        jumlah
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <Button
                                                    onClick={handleAddProduk}
                                                    color="green"
                                                    size="sm"
                                                >
                                                    Tambah
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="mt-4">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Produk
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Harga
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jumlah
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.makanans.map((makanan, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {makanan.nama
                                                    ? makanan.nama
                                                    : makanan.makanan.nama}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatRupiah(
                                                    makanan.harga
                                                        ? makanan.harga
                                                        : makanan.makanan.harga
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {makanan.jumlah}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatRupiah(
                                                    makanan.harga
                                                        ? makanan.harga
                                                        : makanan.makanan
                                                              .harga *
                                                              makanan.jumlah
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <Button
                                                    onClick={() =>
                                                        handleRemoveProduk(
                                                            index
                                                        )
                                                    }
                                                    color="red"
                                                    size="sm"
                                                >
                                                    Hapus
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {data.makanans.length < 1 &&
                                        data.kas_masuk_pesan.map(
                                            (makanan, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {makanan.makanan.nama}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatRupiah(
                                                            makanan.harga
                                                                ? makanan.harga
                                                                : makanan
                                                                      .makanan
                                                                      .harga
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {makanan.jumlah}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatRupiah(
                                                            makanan.harga
                                                                ? makanan.harga
                                                                : makanan
                                                                      .makanan
                                                                      .harga *
                                                                      makanan.jumlah
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <Button
                                                            onClick={() =>
                                                                handleRemoveProduk(
                                                                    index
                                                                )
                                                            }
                                                            color="red"
                                                            size="sm"
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Total Pembayaran
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatRupiah(totalPembayaran)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="mt-4">
                            <Label
                                htmlFor="metode_pembayaran"
                                value="Metode Pembayaran"
                            />
                            <div className="flex space-x-4">
                                <div>
                                    <input
                                        type="radio"
                                        id="Tunai"
                                        name="metode_pembayaran"
                                        value="Tunai"
                                        checked={
                                            data.metode_pembayaran === "Tunai"
                                        }
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                metode_pembayaran:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                    <label htmlFor="Tunai" className="ml-2">
                                        Tunai
                                    </label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="Debit"
                                        name="metode_pembayaran"
                                        value="Debit"
                                        checked={
                                            data.metode_pembayaran === "Debit"
                                        }
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                metode_pembayaran:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                    <label htmlFor="Debit" className="ml-2">
                                        Debit
                                    </label>
                                </div>
                            </div>
                            {(validationErrors.metode_pembayaran ||
                                errors.metode_pembayaran) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.metode_pembayaran ||
                                        errors.metode_pembayaran}
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
