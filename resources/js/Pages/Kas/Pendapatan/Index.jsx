import React, { useState, useEffect, forwardRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
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
    Button,
} from "flowbite-react";
import { HiSearch, HiOutlineDotsHorizontal, HiCheck } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Create from "./Create";
import Edit from "./Edit";
import Delete from "./Delete";
import moment from "moment";
import Show from "./Show";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { format } from "date-fns";
import { id } from "date-fns/locale";
registerLocale("id", id);
setDefaultLocale("id");

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
    lastKode,
    kasMasuk,
    totalKasMasuk,
    startDate: initialStartDate,
    endDate: initialEndDate,
    searchTerm: initialSearchTerm,
    pageTerm,
}) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
    const [currentPage, setCurrentPage] = useState(parseInt(pageTerm) || 1);
    const perPage = 10;
    const page = currentPage;

    const totalPages = Math.ceil(kasMasuk.total / perPage);
    const onPageChange = (page) => {
        setCurrentPage(page);
        handlePage(page);
    };

    const handlePage = (page) => {
        Inertia.get(
            route("kasPendapatan.index"),
            { page: page },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const [idKasMasuk, setIdKasMasuk] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditClick = (idProduk) => {
        setShowEditModal(true);
        setIdKasMasuk(idProduk);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
    };

    const [showModal, setShowModal] = useState(false);

    const handleClick = (idProduk) => {
        setShowModal(true);
        setIdKasMasuk(idProduk);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteClick = (idProduk) => {
        setShowDeleteModal(true);
        setIdKasMasuk(idProduk);
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

    const [state, setState] = useState([
        {
            startDate: initialStartDate ? new Date(initialStartDate) : null,
            endDate: initialEndDate ? new Date(initialEndDate) : null,
            key: "selection",
        },
    ]);

    const onChange = (dates) => {
        const [start, end] = dates;
        setState([{ startDate: start, endDate: end, key: "selection" }]);
    };

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
        const renderedValues = () => {
            const [start, end] = value.split(" - ");
            if (!end || start === end) {
                return start;
            }
            return `${start} - ${end}`;
        };
        return (
            <TextInput
                type="text"
                onClick={onClick}
                ref={ref}
                placeholder="Pilih tanggal..."
                value={renderedValues()}
                readOnly
            />
        );
    });

    const handleReset = () => {
        setSearchTerm("");
        setState([
            {
                startDate: null,
                endDate: null,
                key: "selection",
            },
        ]);
        Inertia.get(route("kasPendapatan.index"));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const startDate = state[0].startDate
            ? format(state[0].startDate, "yyyy-MM-dd")
            : null;
        const endDate = state[0].endDate
            ? format(state[0].endDate, "yyyy-MM-dd")
            : state[0].startDate
            ? format(state[0].startDate, "yyyy-MM-dd")
            : null;

        const filterParams = {
            search: searchTerm,
            startDate,
            endDate,
        };

        Inertia.get(route("kasPendapatan.index"), filterParams);
    };

    const statusColor = {
        "Menunggu Pembayaran": "bg-red-600",
        "Sudah Dibayar": "bg-blue-500",
        "Sedang Diproses": "bg-yellow-600",
        "Selesai": "bg-green-500",
    };

    const statusLabel = {
        "Menunggu Pembayaran" : "Menunggu Pembayaran",
        "Sudah Dibayar": "Sudah Dibayar",
        "Sedang Diproses": "Sedang Diproses",
        "Selesai": "Selesai",
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pendaptan
                </h2>
            }
        >
            <div>
                <ToastContainer />
            </div>

            <Head title="Pendaptan" />

            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-10 pt-10 pb-5 2xl:pb-10 text-gray-900 text-[28px] 2xl:text-4xl font-medium">
                            DAFTAR PENDAPATAN
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="mx-10">
                                <form onSubmit={handleSubmit} className="">
                                    <div className="flex items-center">
                                        <TextInput
                                            id="search"
                                            type="text"
                                            icon={HiSearch}
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                        <div className="ml-2">
                                            <DatePicker
                                                selected={state[0].startDate}
                                                onChange={onChange}
                                                startDate={state[0].startDate}
                                                endDate={state[0].endDate}
                                                selectsRange
                                                customInput={
                                                    <ExampleCustomInput />
                                                }
                                                dateFormat="dd MMMM yyyy"
                                            />
                                        </div>
                                        <div className="flex">
                                            <Button
                                                color="failure"
                                                onClick={handleReset}
                                                type="reset"
                                                className="ml-2"
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                className="ml-2"
                                                color="success"
                                                type="submit"
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="ml-4">
                                <Create
                                    makanans={makanans}
                                    lastKode={lastKode}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto px-10 py-4">
                            <Table hoverable>
                                <TableHead>
                                    <TableHeadCell>Tanggal</TableHeadCell>
                                    <TableHeadCell>Kode</TableHeadCell>
                                    <TableHeadCell>Nama Produk</TableHeadCell>
                                    <TableHeadCell>Total</TableHeadCell>
                                    <TableHeadCell>Status</TableHeadCell>

                                    <TableHeadCell>
                                        <span className="sr-only">Edit</span>
                                    </TableHeadCell>
                                </TableHead>
                                <TableBody className="divide-y">
                                    {kasMasuk.data.length === 0 ? (
                                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <TableCell
                                                colSpan={5}
                                                className="text-center"
                                            >
                                                Pendapatan Tidak Ada
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        kasMasuk.data.map((kasMasuk, index) => (
                                            <TableRow
                                                className="bg-white dark:border-gray-700 dark:bg-gray-800 align-top"
                                                key={kasMasuk.id}
                                            >
                                                <TableCell>
                                                    {moment(kasMasuk.update_at)
                                                        .locale("id")
                                                        .format("D MMM YYYY")}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                    {kasMasuk.kode}
                                                </TableCell>

                                                <TableCell>
                                                    {kasMasuk.kode.startsWith(
                                                        "PSN"
                                                    ) ? (
                                                        <ul>
                                                            {kasMasuk.kas_masuk_pesan.map(
                                                                (sk) => (
                                                                    <li
                                                                        key={
                                                                            sk.id
                                                                        }
                                                                    >
                                                                        {"- "}
                                                                        {
                                                                            sk
                                                                                .makanan
                                                                                .nama
                                                                        }{" "}
                                                                        {/* Menampilkan nama produk */}{" "}
                                                                        (Jumlah:{" "}
                                                                        {
                                                                            sk.jumlah
                                                                        }
                                                                        , Harga:{" "}
                                                                        {formatRupiah(
                                                                            sk
                                                                                .makanan
                                                                                .harga
                                                                        )}
                                                                        ){" "}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <ul>
                                                            {kasMasuk.kas_masuk_makanan.map(
                                                                (sk) => (
                                                                    <li
                                                                        key={
                                                                            sk.id
                                                                        }
                                                                    >
                                                                        {"- "}
                                                                        {
                                                                            sk
                                                                                .makanan
                                                                                .nama
                                                                        }{" "}
                                                                        {/* Menampilkan nama produk */}{" "}
                                                                        (
                                                                        {
                                                                            sk.jumlah
                                                                        }
                                                                        * ,{" "}
                                                                        {formatRupiah(
                                                                            sk
                                                                                .makanan
                                                                                .harga
                                                                        )}
                                                                        ){" "}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {kasMasuk.kode.startsWith(
                                                        "PSN"
                                                    ) ? (
                                                        <>
                                                            {formatRupiah(
                                                                kasMasuk.kas_masuk_pesan.reduce(
                                                                    (
                                                                        total,
                                                                        sk
                                                                    ) =>
                                                                        total +
                                                                        sk.jumlah *
                                                                            sk
                                                                                .makanan
                                                                                .harga,
                                                                    0
                                                                )
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {formatRupiah(
                                                                kasMasuk.kas_masuk_makanan.reduce(
                                                                    (
                                                                        total,
                                                                        sk
                                                                    ) =>
                                                                        total +
                                                                        sk.jumlah *
                                                                            sk
                                                                                .makanan
                                                                                .harga,
                                                                    0
                                                                )
                                                            )}
                                                        </>
                                                    )}
                                                    {/* {formatRupiah(
                                                        kasMasuk.kas_masuk_makanan.reduce(
                                                            (total, sk) =>
                                                                total +
                                                                sk.jumlah *
                                                                    sk.makanan
                                                                        .harga,
                                                            0
                                                        )
                                                    )} */}
                                                </TableCell>

                                                <TableCell>
                                                    <span
                                                        className={`w-full text-nowrap ml-2 ${statusColor[kasMasuk.status] || "bg-gray-500"} text-white px-2 py-1 rounded`}
                                                    >
                                                        {statusLabel[kasMasuk.status] || "Unknown Status"}
                                                    </span>
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
                                                                handleClick(
                                                                    kasMasuk.kode
                                                                )
                                                            }
                                                        >
                                                            Detail
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    kasMasuk.kode
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    kasMasuk.id
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
                                    Total {totalKasMasuk} pendapatan data
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
                    makanans={makanans}
                    idKasMasuk={idKasMasuk}
                />
            )}
            {showModal && (
                <Show
                    show={showModal}
                    onClose={handleModalClose}
                    makanans={makanans}
                    idKasMasuk={idKasMasuk}
                />
            )}
            {showDeleteModal && (
                <Delete
                    show={showDeleteModal}
                    onClose={handleDeleteModalClose}
                    idKasMasuk={idKasMasuk}
                />
            )}
        </AuthenticatedLayout>
    );
}
