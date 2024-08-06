import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, router } from "@inertiajs/react";
import { Button } from "flowbite-react";
import { FaShoppingCart } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function formatRupiah(angka) {
    var formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });
    return formatter.format(angka);
}

export default function Index({
    auth,
    makanans,
    pesans,
    totalMakanan,
    searchTerm: initialSearchTerm,
    pageTerm,
}) {
    const { data, setData, put, errors, processing, reset } = useForm({
        pesan: pesans,
    });

    const [editIndex, setEditIndex] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

    const statusColor = {
        pending: "bg-red-600",
        paid: "bg-blue-500",
        on_process: "bg-yellow-600",
        completed: "bg-green-500",
    };

    const statusLabel = {
        pending: "Menunggu Pembayaran",
        paid: "Sudah Dibayar",
        on_process: "Sedang Diproses",
        completed: "Selesai",
    };

    const handleStatusChange = (index, newStatus) => {
        const updatedPesan = [...data.pesan];
        updatedPesan[index].status = statusLabel[newStatus];
        setData("pesan", updatedPesan);
        setShowEditPopup(false);
        toast.success("Sukses Mengubah Status Pesanan!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await put(`/pesan/`, {
                data: data,
                onSuccess: () => {
                    toast.success("Data berhasil disimpan!");
                    reset();
                    window.location.href="/pesan";
                    
                },
                onError: (errors) => {
                    console.error(errors); // Log error di konsol
                    toast.error("Terjadi kesalahan saat menyimpan data.");
                },
            });
        } catch (err) {
            console.error(err); // Log error di konsol
            toast.error("Terjadi kesalahan.");
        }
    };


    const toggleEdit = (index, event) => {
        if (editIndex === index) {
            setEditIndex(null);
            setShowEditPopup(false);
        } else {
            setEditIndex(index);
            setShowEditPopup(true);
            setPopupPosition({
                top: event.currentTarget.offsetTop + event.currentTarget.offsetHeight,
                left: event.currentTarget.offsetLeft,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Produk
                </h2>
            }
        >
            <ToastContainer />

            <div className="pt-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-10 pt-10 pb-5 2xl:pb-10 text-gray-900 text-[28px] 2xl:text-4xl font-medium">
                            {/* <FaShoppingCart className="inline mr-2" /> */}
                            DAFTAR PESANAN
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Kode
                                    </th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Makanan
                                    </th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.pesan.map((item, index) => {
                                    const statusKey = Object.keys(statusLabel).find(
                                        (key) => statusLabel[key] === item.status
                                    );
                                    return (
                                        <tr key={index}>
                                            <td className="px-4 py-5 border-b border-gray-200 text-sm">
                                                {item.kode}
                                            </td>
                                            <td className="px-4 py-5 border-b border-gray-200 text-sm">
                                                {item.kas_masuk_pesan[0].nama}
                                            </td>
                                            <td className="px-4 py-5 border-b border-gray-200 text-sm">
                                                <ul>
                                                    {item.kas_masuk_pesan.map((sk) => (
                                                        <li key={sk.id}>
                                                            {sk.nama} ({sk.jumlah}*, {formatRupiah(sk.makanan.harga)})
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-4 py-5 border-b border-gray-200 text-sm">
                                                {formatRupiah(
                                                    item.kas_masuk_pesan.reduce(
                                                        (total, sk) =>
                                                            total + sk.jumlah * sk.makanan.harga,
                                                        0
                                                    )
                                                )}
                                            </td>
                                            <td className="px-4 py-5 border-b border-gray-200 text-sm text-center">
                                                {showEditPopup && editIndex === index ? (
                                                    <div className="" style={{ top: popupPosition.top, left: popupPosition.left }}>
                                                        <select
                                                            value={statusKey || ""}
                                                            onChange={(e) => handleStatusChange(index, e.target.value)}
                                                            className="form-select block w-full mt-1"
                                                        >
                                                            {Object.entries(statusLabel).map(([key, label]) => (
                                                                <option key={key} value={key}>
                                                                    {label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <div className={`p-2 rounded-lg text-white ${statusColor[statusKey] || "bg-gray-500"}`}>
                                                        {item.status}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-5 border-b border-gray-200 text-sm text-center relative">
                                                <button
                                                    onClick={(e) => toggleEdit(index, e)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    {showEditPopup && editIndex === index ? <MdCancel /> : <CiEdit />}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="mx-auto sm:px-6 lg:px-8 py-4 text-center">
                <Button type="button" onClick={handleSubmit} color="success" disabled={processing}>
                    {processing ? "Menyimpan..." : "Simpan"}
                </Button>
            </div>
        </AuthenticatedLayout>
    );
}
