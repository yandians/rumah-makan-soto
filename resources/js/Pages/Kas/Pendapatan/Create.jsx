import React, { useState, useMemo } from "react";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { HiOutlinePlusSm } from "react-icons/hi";
import { useForm } from "@inertiajs/react";
import Select from "react-select";
import KasPendapatanSchema from "./KasPendapatanSchema";

function formatRupiah(angka) {
    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });
    return formatter.format(angka);
}

export default function Create({ makanans, lastKode }) {
    const modifyString = (str) => {
        let lastThreeDigits = str.slice(-3);
        let incrementedDigits = (parseInt(lastThreeDigits) + 1)
            .toString()
            .padStart(3, "0");
        return str.slice(0, -3) + incrementedDigits;
    };

    const modifiedString = modifyString(lastKode);

    const { data, setData, post, errors, reset } = useForm({
        kode: modifiedString,
        makanans: [],
        metode_pembayaran: "",
        status: "", // Add status to the form data
    });

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [selectedProduk, setSelectedProduk] = useState(null);
    const [jumlah, setJumlah] = useState(1);
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedStatus, setSelectedStatus] = useState(""); // Add state for selectedStatus

    const handleToggleModal = () => setOpenModalCreate(!openModalCreate);

    const handleSelectProduk = (selectedOption) => setSelectedProduk(selectedOption);

    const handleAddProduk = () => {
        if (selectedProduk) {
            const newProduk = {
                makanan_id: selectedProduk.value,
                nama: selectedProduk.label,
                harga: selectedProduk.harga,
                jumlah,
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
        setSelectedStatus(""); // Reset selected status
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await KasPendapatanSchema.validate(data, { abortEarly: false });
            post("/pendapatan", {
                onSuccess: () => {
                    reset();
                    setOpenModalCreate(false);
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
        return data.makanans.reduce((total, makanan) => {
            return total + makanan.harga * makanan.jumlah;
        }, 0);
    }, [data.makanans]);

    const statusColor = {
        "Menunggu Pembayaran": "bg-red-600",
        "Sudah Dibayar": "bg-blue-500",
        "Sedang Diproses": "bg-yellow-600",
        "Selesai": "bg-green-500",
    };

    const statusLabel = {
        "Menunggu Pembayaran": "Menunggu Pembayaran",
        "Sudah Dibayar": "Sudah Dibayar",
        "Sedang Diproses": "Sedang Diproses",
        "Selesai": "Selesai",
    };

    const handleChange = (event) => {
        const status = event.target.value;
        setSelectedStatus(status);
        setData({ ...data, status }); // Update form data
    };

    return (
        <>
            <Button
                color="blue"
                className="text-end mx-10"
                size="sm"
                onClick={handleToggleModal}
            >
                <HiOutlinePlusSm className="text-xl mr-2" /> Tambah Pendapatan
            </Button>
            <Modal
                show={openModalCreate}
                onClose={() => setOpenModalCreate(false)}
                size="4xl"
            >
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
                                                {formatRupiah(selectedProduk.harga)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <TextInput
                                                    type="number"
                                                    value={jumlah}
                                                    onChange={(e) =>
                                                        setJumlah(
                                                            parseInt(e.target.value, 10) || 1
                                                        )
                                                    }
                                                    className="w-24 rounded-md"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatRupiah(selectedProduk.harga * jumlah)}
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
                                                {makanan.nama}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatRupiah(makanan.harga)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {makanan.jumlah}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatRupiah(makanan.harga * makanan.jumlah)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <Button
                                                    onClick={() => handleRemoveProduk(index)}
                                                    color="red"
                                                    size="sm"
                                                >
                                                    Hapus
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
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

                        <div className="relative">
                            <Label htmlFor="status" value="Pilih Status" />
                            <select
                                id="status"
                                value={selectedStatus}
                                onChange={handleChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                            >
                                <option value="" disabled>
                                    Pilih Status
                                </option>
                                {Object.keys(statusLabel).map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                        style={{
                                            backgroundColor: statusColor[status],
                                        }}
                                    >
                                        {statusLabel[status]}
                                    </option>
                                ))}
                            </select>
                            {(validationErrors.status || errors.status) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.status || errors.status}
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