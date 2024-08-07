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

const PrintLaporanBukuBesar = React.forwardRef(({ kas, date }, ref) => {
    let saldo = 0;
    return (
        <div ref={ref} className="print:my-10 print:mx-20 print:text-[9px]">
            <div className="px-10 pt-10 pb-5 text-gray-900 text-lg xl:text-xl font-medium text-center">
                LAPORAN BUKU BESAR
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
                        <TableHeadCell>Pendapatan</TableHeadCell>
                        <TableHeadCell>Pengeluran</TableHeadCell>
                        <TableHeadCell>Saldo</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {kas.length === 0 ? (
                            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell colSpan={7} className="text-center">
                                    Laporan Buku Besar Tidak Ada
                                </TableCell>
                            </TableRow>
                        ) : (
                            kas.map((kas, index) => (
                                <TableRow
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800 align-top"
                                    key={kas.id}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {moment(kas.update_at)
                                            .locale("id")
                                            .format("D MMM YYYY")}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {kas.kode}
                                    </TableCell>
                                    <TableCell>
                                        {kas.kode.startsWith("KSK") ? (
                                            <>
                                                {kas.kas_keluar.nama}
                                                <br />
                                                Jumlah: {
                                                    kas.kas_keluar.jumlah
                                                },{" "}
                                                {kas.kas_keluar.keterangan
                                                    ? `Detail: ${kas.kas_keluar.keterangan}`
                                                    : "Detail: -"}
                                            </>
                                        ) : kas.kode.startsWith("KSP") ? (
                                            <>
                                                <ul>
                                                    {kas.kas_masuk.kas_masuk_makanan.map(
                                                        (sk) => (
                                                            <li key={sk.id}>
                                                                {"- "}
                                                                {
                                                                    sk.makanan
                                                                        .nama
                                                                }{" "}
                                                                (Jumlah :{" "}
                                                                {sk.jumlah},{" "}
                                                                {formatRupiah(
                                                                    sk.makanan
                                                                        .harga
                                                                )}
                                                                ){" "}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </>
                                        ) : (
                                            "Unknown"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {kas.kode.startsWith("KSK") ? (
                                            " - "
                                        ) : kas.kode.startsWith("KSP") ? (
                                            <div className="flex items-center">
                                                
                                                {formatRupiah(
                                                    kas.kas_masuk.kas_masuk_makanan.reduce(
                                                        (total, sk) =>
                                                            total +
                                                            sk.jumlah *
                                                                sk.makanan.harga,
                                                        0
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            "Unknown"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {kas.kode.startsWith("KSK") ? (
                                            <div className="flex items-center">
                                              
                                                {formatRupiah(kas.kas_keluar.total)}
                                            </div>
                                        ) : kas.kode.startsWith("KSP") ? (
                                            "-"
                                        ) : (
                                            "Unknown"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {kas.kode.startsWith("KSK") ? (
                                            formatRupiah(
                                                (saldo -= kas.kas_keluar.total)
                                            )
                                        ) : kas.kode.startsWith("KSP") ? (
                                            <>
                                                {formatRupiah(
                                                    (saldo +=
                                                        kas.kas_masuk.kas_masuk_makanan.reduce(
                                                            (total, sk) =>
                                                                total +
                                                                sk.jumlah *
                                                                    sk.makanan
                                                                        .harga,
                                                            0
                                                        ))
                                                )}
                                            </>
                                        ) : (
                                            "kas masuk"
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
});

export default PrintLaporanBukuBesar;
