import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import { Button } from "flowbite-react";
import { FaShoppingCart } from 'react-icons/fa';
import { CiEdit } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Index({
    auth,
    makanans,
    totalMakanan,
    searchTerm: initialSearchTerm,
    pageTerm,
}) {
    const { data, setData, post, errors, processing, reset } = useForm({
        pesan: [
            { kode: "001", nama: "yusseno", makanan_id: 1, jumlah: 10, status: "Menunggu Pembayaran" },
            { kode: "002", nama: "johndoe", makanan_id: 2, jumlah: 5, status: "Selesai" },
            // Tambahkan data pesanan lainnya sesuai kebutuhan
        ],
    });

    const [editIndex, setEditIndex] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

    const statusColor = {
        pending: 'red-600',
        paid: 'blue-500',
        on_process: 'yellow-600',
        completed: 'green-500'
    };

    const statusLabel = {
        pending: 'Menunggu Pembayaran',
        paid: 'Sudah Dibayar',
        on_process: 'Sedang Diproses',
        completed: 'Selesai'
    };

    const handleStatusChange = (index, newStatus) => {
        const updatedPesan = [...data.pesan];
        updatedPesan[index].status = statusLabel[newStatus];
        setData('pesan', updatedPesan);
        setShowEditPopup(false);

        toast.success('Sukses Mengubah Status Pesanan!')
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            post("/pesan")
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

    const toggleEdit = (index, event) => {
        if (editIndex === index) {
            setEditIndex(null);
            setShowEditPopup(false);
        } else {
            setEditIndex(index);
            setShowEditPopup(true);
            setPopupPosition({
                top: event.currentTarget.offsetTop + event.currentTarget.offsetHeight,
                left: event.currentTarget.offsetLeft
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

            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-10 pt-10 pb-5 2xl:pb-10 text-gray-900 text-[28px] 2xl:text-4xl font-medium">
                            <FaShoppingCart className="inline mr-2" />
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
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Kode
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Makanan ID
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.pesan.map((item, index) => {
                                    const statusKey = Object.keys(statusLabel).find(key => statusLabel[key] === item.status);
                                    return (
                                        <tr key={index}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {item.kode}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {item.nama}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {item.makanan_id}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {item.jumlah}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                {showEditPopup && editIndex === index ? (
                                                    <div className="relative">
                                                        <select
                                                            value={statusKey}
                                                            onChange={(e) => handleStatusChange(index, e.target.value)}
                                                            className="form-select block w-full mt-1"
                                                        >
                                                            <option value="pending">Menunggu Pembayaran</option>
                                                            <option value="paid">Sudah Dibayar</option>
                                                            <option value="on_process">Sedang Diproses</option>
                                                            <option value="completed">Selesai</option>
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <div className={`p-2 rounded-lg text-white bg-${statusColor[statusKey]}`}>
                                                        {item.status}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm relative">
                                                <button onClick={(e) => toggleEdit(index, e)}>
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
            <div className="mx-auto sm:px-6 lg:px-8 py-4">
                <Button type="submit" onClick={handleSubmit} color="success">
                    Simpan
                </Button>
            </div>
        </AuthenticatedLayout>
    );
}
