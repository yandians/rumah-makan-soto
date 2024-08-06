import React, { useState, useEffect, useRef, forwardRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
} from "flowbite-react";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
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

const PrintLaporanPendapatan = React.forwardRef(({ kasMasuk, date }, ref) => {
    const totalPendapatan = kasMasuk.reduce((total, kas) => {
        return (
            total +
            kas.kas_masuk_makanan.reduce((subTotal, sk) => {
                return subTotal + sk.jumlah * sk.makanan.harga;
            }, 0)
        );
    }, 0);
    return (
        <div ref={ref} className="print:my-10 print:mx-20 print:text-[9px]">
            <div className="px-10 pt-10 pb-5 text-gray-900 text-lg xl:text-xl font-medium text-center">
                LAPORAN PENDAPATAN
                <br />
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
                    </TableHead>
                    <TableBody className="divide-y">
                        {kasMasuk.length === 0 ? (
                            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell colSpan={5} className="text-center">
                                    Lapporan Kas Masuk Tidak Ada
                                </TableCell>
                            </TableRow>
                        ) : (
                            kasMasuk.map((kasMasuk, index) => (
                                <TableRow
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800 align-top"
                                    key={kasMasuk.id}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {moment(kasMasuk.update_at)
                                            .locale("id")
                                            .format("D MMM YYYY")}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {kasMasuk.kode}
                                    </TableCell>
                                    <TableCell>
                                        <ul>
                                            {kasMasuk.kas_masuk_makanan.map(
                                                (sk) => (
                                                    <li key={sk.id}>
                                                        {"- "}
                                                        {sk.makanan.nama}{" "}
                                                        ({sk.jumlah}*, {" "}
                                                        {formatRupiah(
                                                            sk.makanan.harga
                                                        )}
                                                        ){" "}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </TableCell>
                                    <TableCell className="flex items-center">
                                        {formatRupiah(
                                            kasMasuk.kas_masuk_makanan.reduce(
                                                (total, sk) =>
                                                    total +
                                                    sk.jumlah * sk.makanan.harga,
                                                0
                                            )
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <TableCell
                                colSpan={4}
                                className="text-right font-bold"
                            >
                                Total Pendapatan
                            </TableCell>
                            <TableCell className="font-bold">
                                {formatRupiah(totalPendapatan)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
});

export default PrintLaporanPendapatan;
