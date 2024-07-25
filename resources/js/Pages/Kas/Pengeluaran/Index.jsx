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
        Badge,
    } from "flowbite-react";
    import { HiSearch, HiOutlineDotsHorizontal, HiCheck } from "react-icons/hi";
    import { ToastContainer, toast } from "react-toastify";
    import "react-toastify/dist/ReactToastify.css";
    import Create from "./Create";
    import Edit from "./Edit";
    import Delete from "./Delete";
    import moment from "moment";

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
        produks,
        lastKode,
        kasKeluar,
        totalKasKeluar,
        startDate: initialStartDate,
        endDate: initialEndDate,
        searchTerm: initialSearchTerm,
        pageTerm,
    }) {
        const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
        const [currentPage, setCurrentPage] = useState(parseInt(pageTerm) || 1);
        const perPage = 10;
        const page = currentPage;

        const totalPages = Math.ceil(kasKeluar.total / perPage);
        const onPageChange = (page) => {
            setCurrentPage(page);
            handlePage(page);
        };

        const handlePage = (page) => {
            Inertia.get(
                route("kasPengeluaran.index"),
                { page: page },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        };

        const [idKasKeluar, setIdKasKeluar] = useState(null);
        const [showEditModal, setShowEditModal] = useState(false);

        const handleEditClick = (idProduk) => {
            setShowEditModal(true);
            setIdKasKeluar(idProduk);
        };

        const handleEditModalClose = () => {
            setShowEditModal(false);
        };

        const [showDeleteModal, setShowDeleteModal] = useState(false);

        const handleDeleteClick = (idProduk) => {
            setShowDeleteModal(true);
            setIdKasKeluar(idProduk);
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
            Inertia.get(route("kasPengeluaran.index"));
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

            Inertia.get(route("kasPengeluaran.index"), filterParams);
        };

        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Pengeluaran
                    </h2>
                }
            >
                <div>
                    <ToastContainer />
                </div>

                <Head title="Pengeluaran" />

                <div className="py-6">
                    <div className="mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="px-10 pt-10 pb-5 2xl:pb-10 text-gray-900 text-[28px] 2xl:text-4xl font-medium">
                                DAFTAR PENGELUARAN
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
                                    <Create lastKode={lastKode} />
                                </div>
                            </div>
                            <div className="overflow-x-auto px-10 py-4">
                                <Table hoverable>
                                    <TableHead>
                                        <TableHeadCell>Tanggal</TableHeadCell>
                                        <TableHeadCell>Kode</TableHeadCell>
                                        <TableHeadCell>Nama</TableHeadCell>
                                        <TableHeadCell>Jumlah</TableHeadCell>
                                        <TableHeadCell>Total</TableHeadCell>
                                        <TableHeadCell>Keterangan</TableHeadCell>
                                        <TableHeadCell>
                                            <span className="sr-only">Edit</span>
                                        </TableHeadCell>
                                    </TableHead>
                                    <TableBody className="divide-y">
                                        {kasKeluar.data.length === 0 ? (
                                            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <TableCell
                                                    colSpan={7}
                                                    className="text-center"
                                                >
                                                    Pengeluaran Tidak Ada
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            kasKeluar.data.map(
                                                (kasKeluar, index) => (
                                                    <TableRow
                                                        className="bg-white dark:border-gray-700 dark:bg-gray-800 align-top"
                                                        key={kasKeluar.id}
                                                    >
                                                        <TableCell>
                                                            {moment(
                                                                kasKeluar.update_at
                                                            )
                                                                .locale("id")
                                                                .format(
                                                                    "D MMM YYYY"
                                                                )}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            {kasKeluar.kode}
                                                        </TableCell>
                                                        <TableCell>
                                                            {kasKeluar.nama}
                                                        </TableCell>
                                                        <TableCell>
                                                            {kasKeluar.jumlah}
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatRupiah(
                                                                kasKeluar.total
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {kasKeluar.keterangan}
                                                        </TableCell>
                                                        <TableCell width={10}>
                                                            <Dropdown
                                                                label=""
                                                                dismissOnClick={
                                                                    false
                                                                }
                                                                renderTrigger={() => (
                                                                    <span>
                                                                        <HiOutlineDotsHorizontal
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    </span>
                                                                )}
                                                            >
                                                                <Dropdown.Item
                                                                    onClick={() =>
                                                                        handleEditClick(
                                                                            kasKeluar.id
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                    onClick={() =>
                                                                        handleDeleteClick(
                                                                            kasKeluar.id
                                                                        )
                                                                    }
                                                                >
                                                                    Hapus
                                                                </Dropdown.Item>
                                                            </Dropdown>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex overflow-x-auto sm:justify-between px-10 pb-10 pt-4">
                                <div className="flex-shrink-0">
                                    <span className="text-sm 2xl:text-md italic text-slate-600">
                                        Total {totalKasKeluar} pengeluaran data
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
                        idKasKeluar={idKasKeluar}
                    />
                )}

                {showDeleteModal && (
                    <Delete
                        show={showDeleteModal}
                        onClose={handleDeleteModalClose}
                        idKasKeluar={idKasKeluar}
                    />
                )}
            </AuthenticatedLayout>
        );
    }
