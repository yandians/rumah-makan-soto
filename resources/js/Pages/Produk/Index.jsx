import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    TextInput,
    Pagination,
    Dropdown,
} from "flowbite-react";
import { HiSearch, HiOutlineDotsHorizontal, HiCheck } from "react-icons/hi";
import { Inertia } from "@inertiajs/inertia";
import Create from "./Create";
import Edit from "./Edit";
import Delete from "./Delete";
import { ToastContainer, toast } from "react-toastify";
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
    produks,
    totalProduks,
    searchTerm: initialSearchTerm,
    pageTerm
}) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
    const [currentPage, setCurrentPage] = useState(parseInt(pageTerm) || 1);
    const perPage = 10;
    const page = currentPage;

    const handleSearch = () => {
        Inertia.get(
            route("produk.index"),
            { search: searchTerm, page: currentPage },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setSearchTerm(e.target.value.trim());
            handleSearch(e);
        }
    };

    // page
    const totalPages = Math.ceil(produks.total / perPage);
    const onPageChange = (page) => {
        setCurrentPage(page);
        handlePage(page);
    };

    const handlePage = (page) => {
        Inertia.get(
            route("produk.index"),
            { page: page },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const [idProduk, setIdProduk] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditClick = (idProduk) => {
        setShowEditModal(true);
        setIdProduk(idProduk);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteClick = (idProduk) => {
        setShowDeleteModal(true);
        setIdProduk(idProduk);
    };

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
    };

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
        }
    }, [flash]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Produk
                </h2>
            }
        >
            <div>
                {/* <button onClick={notify}>Notify!</button> */}
                <ToastContainer />
            </div>

            <Head title="Produk" />

            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-10 pt-10 pb-5 2xl:pb-10 text-gray-900 text-[28px] 2xl:text-4xl font-medium">
                            DAFTAR PRODUK
                        </div>
                        <div className="flex justify-between">
                            <div className="px-10 max-w-sm 2xl:max-w-md">
                                <TextInput
                                    id="search"
                                    type="text"
                                    icon={HiSearch}
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <Create />
                        </div>
                        <div className="overflow-x-auto px-10 py-4">
                            <Table hoverable>
                                <TableHead>
                                    <TableHeadCell>Nama Produk</TableHeadCell>
                                    <TableHeadCell>Kategori</TableHeadCell>
                                    <TableHeadCell>Harga</TableHeadCell>

                                    <TableHeadCell>
                                        <span className="sr-only">Edit</span>
                                    </TableHeadCell>
                                </TableHead>
                                <TableBody className="divide-y">
                                    {produks.data.length === 0 ? (
                                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <TableCell
                                                colSpan={4}
                                                className="text-center"
                                            >
                                                Produk Tidak Ada
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        produks.data.map((produk, index) => (
                                            <TableRow
                                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                                key={produk.id}
                                            >
                                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                    {produk.nama}
                                                </TableCell>
                                                <TableCell>
                                                    {produk.kategori}
                                                </TableCell>
                                                <TableCell>
                                                    {formatRupiah(produk.harga)}
                                                </TableCell>
                                                <TableCell width={10}>
                                                    <Dropdown
                                                        label=""
                                                        dismissOnClick={false}
                                                        renderTrigger={() => (
                                                            <span>
                                                                <HiOutlineDotsHorizontal
                                                                    size={20}
                                                                />
                                                            </span>
                                                        )}
                                                    >
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    produk.id
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    produk.id
                                                                )
                                                            }
                                                        >
                                                            Hapus
                                                        </Dropdown.Item>
                                                    </Dropdown>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex overflow-x-auto sm:justify-between px-10 pb-10 pt-4">
                            <div className="flex-shrink-0">
                                <span className="text-sm 2xl:text-md italic text-slate-600">
                                    Total {totalProduks} produk data
                                </span>
                            </div>
                            <div className="flex-shrink-0">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={onPageChange}
                                    previousLabel="Sebelumnya"
                                    nextLabel="Selanjutnya"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Edit */}
            {showEditModal && (
                <Edit
                    show={showEditModal}
                    onClose={handleEditModalClose}
                    idProduk={idProduk}
                />
            )}
            {/* Modal Delete */}
            {showDeleteModal && (
                <Delete
                    show={showDeleteModal}
                    onClose={handleDeleteModalClose}
                    idProduk={idProduk}
                />
            )}
        </AuthenticatedLayout>
    );
}
