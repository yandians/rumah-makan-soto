import React, { useState, useEffect, useRef, forwardRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useReactToPrint } from "react-to-print";
import { Inertia } from "@inertiajs/inertia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    TextInput,
    Badge,
    Button,
} from "flowbite-react";
import { HiPrinter } from "react-icons/hi";
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

const PrintLaporanPengeluaran = React.forwardRef(({ kasKeluar, date }, ref) => {
    const totalPengeluaran = kasKeluar.reduce(
        (total, item) => total + item.total,
        0
    );
    return (
        <div ref={ref} className="print:my-10 print:mx-20 print:text-[9px]">
            <div className="px-10 pt-10 pb-5 text-gray-900 text-lg xl:text-xl font-medium text-center">
                LAPORAN PENGELUARAN
                <br />
                {/* Priode {" "} */}
                {date[0].startDate || date[0].endDate
                    ? date[0].startDate && date[0].endDate
                        ? date[0].startDate.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        }) ===
                            date[0].endDate.toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })
                            ? ` Priode ${date[0].startDate.toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }
                            )} `
                            : ` Priode ${date[0].startDate.toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }
                            )} - ${date[0].endDate.toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}`
                        : ""
                    : ""}
            </div>

            <div className="overflow-x-auto px-10 py-4">
                <Table hoverable>
                    <TableHead>
                        <TableHeadCell className="w-16">No</TableHeadCell>
                        <TableHeadCell>Tanggal</TableHeadCell>
                        <TableHeadCell>Kode</TableHeadCell>
                        <TableHeadCell>Keterangan</TableHeadCell>
                        <TableHeadCell>Pengeluran</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {kasKeluar.length === 0 ? (
                            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell colSpan={5} className="text-center">
                                    Laporan Pengeluaran Tidak Ada
                                </TableCell>
                            </TableRow>
                        ) : (
                            kasKeluar.map((kasKeluar, index) => (
                                <TableRow
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800 align-top"
                                    key={kasKeluar.id}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {moment(kasKeluar.update_at)
                                            .locale("id")
                                            .format("D MMM YYYY")}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {kasKeluar.kode}
                                    </TableCell>
                                    <TableCell>
                                        {kasKeluar.nama}
                                        <br />
                                        Jumlah: {kasKeluar.jumlah},{" "}
                                        {kasKeluar.keterangan
                                            ? `Detail: ${kasKeluar.keterangan}`
                                            : "Detail: -"}
                                    </TableCell>

                                    <TableCell className="flex items-center">
                                        <Badge
                                            color="gray"
                                            className="w-fit mr-2"
                                        >
                                            {kasKeluar.metode_pembayaran}
                                        </Badge>
                                        {formatRupiah(kasKeluar.total)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <TableCell
                                colSpan={4}
                                className="text-right font-bold"
                            >
                                Total Pengeluaran
                            </TableCell>
                            <TableCell className="font-bold">
                                {formatRupiah(totalPengeluaran)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
});

export default PrintLaporanPengeluaran;
